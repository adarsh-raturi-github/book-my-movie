import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  Permission,
  requestValidatorMiddleware,
  Role,
} from "@adarsh-tickets/shared";
import { prisma } from "../prisma.client";
import { PasswordManagementHelperService } from "../services";
import jwt from "jsonwebtoken";
import { BadRequestError } from "@adarsh-tickets/shared";

const router = express.Router();

router.post(
  "/api/auth/signup",
  [
    body("email").trim().isEmail().withMessage("Email not valid"),
    body("phone")
      .trim()
      .isMobilePhone("en-IN")
      .withMessage("Please enter a valid Indian mobile number."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password not valid"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const { email, phone, password } = req.body;
    // first check whether user with this email already present or with this phone number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    // if user exists
    if (existingUser) {
      throw new BadRequestError("Email alreay in use");
    }
    // hash password
    const hashedPassword =
      await PasswordManagementHelperService.toHash(password);
    // if not than create user
    const [createdUser, userRole] = await Promise.all([
      prisma.user.create({
        data: {
          email,
          phone,
          passwordHash: hashedPassword,
          status: "ACTIVE",
        },
      }),
      prisma.role.findFirst({
        where: {
          name: Role.USER,
          deleted: false,
        },
      }),
    ]);

    await prisma.userRole.create({
      data: {
        userId: createdUser.id,
        roleId: userRole!.id,
      },
    });
    //Generate JWT
    const userJWT = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
        permissions: userRole?.permissions,
        role: Role.USER,
      },
      process.env.JWT_KEY!,
    );

    res.status(201).send({
      id: createdUser.id,
      email: createdUser.email,
      phone: createdUser.phone,
      token: userJWT,
    });
  },
);

export { router as signupRouter };
