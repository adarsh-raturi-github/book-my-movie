import express, { Request, Response } from "express";
import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
  Role,
} from "@adarsh-tickets/shared";
import { body } from "express-validator";
import { prisma } from "../../prisma.client";
import { THEATER_STATUS } from "../../constants";
const router = express.Router();

router.patch(
  "/api/theaters/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_UPDATE),
  [
    body("name")
      .optional()
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
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ max: 20 })
      .withMessage("Phone number cannot exceed 20 characters"),

    body("addressLine1")
      .optional()
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
      .optional()
      .trim()
      .notEmpty()
      .withMessage("City is required")
      .isLength({ max: 100 })
      .withMessage("City cannot exceed 100 characters"),

    body("state")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("State is required")
      .isLength({ max: 100 })
      .withMessage("State cannot exceed 100 characters"),

    body("country")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Country is required")
      .isLength({ max: 100 })
      .withMessage("Country cannot exceed 100 characters"),

    body("postalCode")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Postal code is required")
      .isLength({ max: 20 })
      .withMessage("Postal code cannot exceed 20 characters"),

    body("timezone")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Timezone is required")
      .isLength({ max: 50 })
      .withMessage("Timezone cannot exceed 50 characters"),

    body("status")
      .optional()
      .trim()
      .isIn(THEATER_STATUS)
      .withMessage("Invalid theater status"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    if (!Object.keys(req.body).length) {
      throw new BadRequestError("At least one field must be provided.");
    }
    let {
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
      status,
    } = req.body;

    const { id } = req.params as { id: string };
    const currentUser = req.currentUser!;

    const existingTheater = await prisma.theater.findFirst({
      where: {
        id,
        deleted: false,
      },
    });

    if (!existingTheater) {
      throw new NotFoundError();
    }

    if (
      existingTheater.ownerId !== currentUser.id &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new NotAuthorizeError(
        "You are not authorized to update this theater.",
      );
    }

    const finalName = (name || existingTheater.name)?.trim();
    const isNameChange =
      finalName?.toLowerCase() !== existingTheater?.name?.toLowerCase();

    if (isNameChange) {
      const theater = await prisma.theater.findFirst({
        where: {
          id: { not: id },
          name: {
            equals: finalName,
            mode: "insensitive",
          },
          deleted: false,
          ownerId: existingTheater.ownerId,
        },
      });

      if (theater) {
        throw new BadRequestError(
          "A theater with the same name already exists for this owner.",
        );
      }
    }

    const updatedTheater = await prisma.theater.update({
      where: { id, deleted: false },
      data: {
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
        status,
        updatedBy: currentUser.id,
      },
    });

    return res.send(updatedTheater);
  },
);

export { router as theaterUpdateRouter };
