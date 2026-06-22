import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requestValidatorMiddleware } from "../../../packages/shared/src/middlewares";
import { prisma } from "../prisma.client";
import { PasswordManagementHelperService } from "../services";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../packages/shared/src/errors";

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
    const createdUser = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash: hashedPassword,
        status: "ACTIVE",
      },
    });
    //Generate JWT
    const userJWT = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
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
