import express, { Request, Response } from "express";
import {
  BadRequestError,
  checkPermission,
  createEnvelope,
  IScreenUpdateEventData,
  KafkaAggregateType,
  KafkaEventTypes,
  KafkaTopic,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
  Role,
  ScreenStatusEnum,
  ScreenTypeEnum,
} from "@adarsh-tickets/shared";
import { body, param } from "express-validator";
import { prisma } from "../../prisma.client";
import { SCREEN_STATUS, SCREEN_TYPES, THEATER_STATUS } from "../../constants";
import { Prisma } from "@prisma/client";
const router = express.Router();

router.patch(
  "/api/theaters/:theaterId/screens/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_UPDATE),
  [
    param("theaterId").isUUID().withMessage("Invalid theater id"),
    body("name")
      .optional()
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

    body("type")
      .optional()
      .isIn(SCREEN_TYPES)
      .withMessage("Invalid screen type"),

    body("status")
      .optional()
      .isIn(SCREEN_STATUS)
      .withMessage("Invalid screen status"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    if (!Object.keys(req.body).length) {
      throw new BadRequestError("At least one field must be provided.");
    }
    let { name, description, type, status } = req.body;

    const { id, theaterId } = req.params as { id: string; theaterId: string };
    const currentUser = req.currentUser!;

    const existingTheater = await prisma.theater.findFirst({
      where: {
        id: theaterId,
        deleted: false,
      },
    });

    if (!existingTheater) {
      throw new NotFoundError();
    }

    const existingScreen = await prisma.screen.findFirst({
      where: {
        id,
        deleted: false,
        theaterId,
        theater: {
          deleted: false,
        },
      },
    });

    if (!existingScreen) {
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

    const finalName = (name ?? existingScreen.name)?.trim();
    const isNameChange =
      finalName?.toLowerCase() !== existingScreen?.name?.toLowerCase();

    if (isNameChange) {
      const theater = await prisma.screen.findFirst({
        where: {
          id: { not: id },
          name: {
            equals: finalName,
            mode: "insensitive",
          },
          theaterId,
          theater: {
            deleted: false,
          },
          deleted: false,
        },
      });

      if (theater) {
        throw new BadRequestError(
          "A screen with the same name already exists for this theater.",
        );
      }
    }

    const screen = await prisma.$transaction(async (tx) => {
      const updatedScreen = await tx.screen.update({
        where: { id, deleted: false },
        data: {
          name: finalName.trim(),
          description: description?.trim(),
          type,
          status,
          updatedBy: currentUser.id,
          entityVersion: {
            increment: 1,
          },
        },
      });
      const event = createEnvelope<IScreenUpdateEventData>(
        {
          topic: KafkaTopic.THEATER_TOPIC,
          eventType: KafkaEventTypes.SCREEN_UPDATED,
          serviceName: process.env.SERVICE_NAME!,
        },
        {
          id,
          name: updatedScreen.name,
          type: updatedScreen.type as ScreenTypeEnum,
          status: updatedScreen.status as ScreenStatusEnum,
          entityVersion: updatedScreen.entityVersion,
        },
      );

      await tx.outbox.create({
        data: {
          aggregateType: KafkaAggregateType.SCREEN,
          aggregateId: id,
          topic: KafkaTopic.THEATER_TOPIC,
          eventType: KafkaEventTypes.SCREEN_UPDATED,
          eventVersion: updatedScreen.entityVersion,
          payload: event as unknown as Prisma.InputJsonValue,
        },
      });
      return updatedScreen;
    });
    return res.send(screen);
  },
);
export { router as screenUpdateRouter };
