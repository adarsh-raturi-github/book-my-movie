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
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { prisma } from "../../prisma.client";
import { ScreenStatus } from "@prisma/client";
import { SCREEN_TYPES } from "../../constants";
const router = express.Router();

router.post(
  "/api/screens/:screenId/seats",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_UPDATE),
  [
    param("screenId").isUUID().withMessage("Invalid screen id"),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Screen name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Screen name must be between 2 and 100 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Description cannot exceed 5000 characters"),

    body("type").isIn(SCREEN_TYPES).withMessage("Invalid screen type"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const currentUser = req.currentUser!;

    const { theaterId } = req.params as { theaterId: string };
    const { name, description, type } = req.body;

    const existingTheater = await prisma.theater.findFirst({
      where: {
        id: theaterId,
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
        "You are not authorized to manage this theater.",
      );
    }

    // if screen name exists for a theater
    const duplicate = await prisma.screen.findFirst({
      where: {
        theaterId,
        deleted: false,
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });
    if (duplicate) {
      throw new BadRequestError(
        "A screen with the same name already exists in this theater.",
      );
    }
    const screen = await prisma.screen.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        theaterId,
        type,
        status: ScreenStatus.ACTIVE,
        createdBy: currentUser.id,
        capacity: 0,
      },
    });
    return res.status(200).send(screen);
  },
);
