import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  nonAuthorizeMiddleware,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import { BadRequestError } from "@adarsh-tickets/shared";
import { prisma } from "../prisma.client";
import jwt from "jsonwebtoken";
const router = express.Router();

router.patch(
  "/api/auth/me",
  nonAuthorizeMiddleware,
  [
    body("email").optional().trim().isEmail().withMessage("Email not valid"),

    body("phone")
      .optional()
      .trim()
      .isMobilePhone("en-IN")
      .withMessage("Please enter a valid Indian mobile number."),

    body("firstName").optional().trim().isLength({ min: 2, max: 50 }),

    body("lastName").optional().trim().isLength({ min: 2, max: 50 }),

    body("dateOfBirth").optional().isISO8601(),

    body("gender").optional().isIn(["MALE", "FEMALE", "OTHER"]),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    if (!Object.keys(req.body).length) {
      throw new BadRequestError("At least one field must be provided");
    }
    const data = req.body;
    const currentUser = req.currentUser;
    // check first email and phone not used by other user if email is changed
    const conditions = [];

    if (data.email) {
      conditions.push({ email: data.email });
    }

    if (data.phone) {
      conditions.push({ phone: data.phone });
    }

    if (conditions?.length) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: conditions,
          NOT: {
            id: currentUser!.id,
          },
        },
      });

      if (existingUser) {
        throw new BadRequestError("User already Exist with these details");
      }
    }

    // update the user record to using currentUser id and data

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser!.id,
      },
      data: {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
      },
    });

    const userJWT = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
      },
      process.env.JWT_KEY!,
    );

    res.send(200).send({
      user: updatedUser,
      token: userJWT,
    });
  },
);

export { router as updateUserRouter };
