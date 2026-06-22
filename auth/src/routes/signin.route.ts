import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requestValidatorMiddleware } from "../../../packages/shared/src/middlewares";
import { prisma } from "../prisma.client";
import { BadRequestError } from "../../../packages/shared/src/errors";
import { PasswordManagementHelperService } from "../services";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/auth/signin",
  [
    body("email").trim().isEmail().withMessage("Email not valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password not valid"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    // first check email exist in system if not throw error Invalid credentials
    const { email, password } = req.body;
    //  if email exist fetch record
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }
    // email valid now compare password password i store in hash
    // compare if true return jwt
    const isPasswordSame = await PasswordManagementHelperService.compare(
      existingUser.passwordHash,
      password,
    );

    if (!isPasswordSame) {
      throw new BadRequestError("Invalid Credentials");
    }

    // otherwise return jwt
    //Generate JWT
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );

    res.status(201).send({
      id: existingUser.id,
      email: existingUser.email,
      phone: existingUser.phone,
      token: userJWT,
    });
  },
);
