import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  Permission,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { prisma } from "../../prisma.client";
import { TheaterStatus } from "@prisma/client";
import { TheaterStatusEnum } from "../../enums";
const router = express.Router();

router.post(
  "/api/theaters",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_CREATE),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Theater name is required")
      .isLength({ min: 2, max: 255 })
      .withMessage("Theater name must be between 2 and 255 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Description cannot exceed 5000 characters"),

    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ max: 20 })
      .withMessage("Phone number cannot exceed 20 characters"),

    body("addressLine1")
      .trim()
      .notEmpty()
      .withMessage("Address Line 1 is required")
      .isLength({ max: 255 })
      .withMessage("Address Line 1 cannot exceed 255 characters"),

    body("addressLine2")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Address Line 2 cannot exceed 255 characters"),

    body("city")
      .trim()
      .notEmpty()
      .withMessage("City is required")
      .isLength({ max: 100 })
      .withMessage("City cannot exceed 100 characters"),

    body("state")
      .trim()
      .notEmpty()
      .withMessage("State is required")
      .isLength({ max: 100 })
      .withMessage("State cannot exceed 100 characters"),

    body("country")
      .trim()
      .notEmpty()
      .withMessage("Country is required")
      .isLength({ max: 100 })
      .withMessage("Country cannot exceed 100 characters"),

    body("postalCode")
      .trim()
      .notEmpty()
      .withMessage("Postal code is required")
      .isLength({ max: 20 })
      .withMessage("Postal code cannot exceed 20 characters"),

    body("timezone")
      .trim()
      .notEmpty()
      .withMessage("Timezone is required")
      .isLength({ max: 50 })
      .withMessage("Timezone cannot exceed 50 characters"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const currentUser = req.currentUser!;

    const {
      name,
      description,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      timezone,
    } = req.body;
    const existingTheater = await prisma.theater.findFirst({
      where: {
        ownerId: currentUser.id,
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        deleted: false,
      },
    });
    if (existingTheater) {
      throw new BadRequestError(
        "A theater with the same name already exists for this owner.",
      );
    }
    // create theater
    const theater = await prisma.theater.create({
      data: {
        name: name.trim(),
        description,
        ownerId: currentUser.id,
        phoneNumber,
        addressLine1,
        addressLine2,
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        postalCode: postalCode.trim(),
        timezone: timezone.trim(),
        status: TheaterStatusEnum.ACTIVE,
        createdBy: currentUser.id,
      },
    });
    return res.status(200).send(theater);
  },
);
