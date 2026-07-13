import {
  checkPermission,
  createEnvelope,
  IScreenDeleteEventData,
  KafkaAggregateType,
  KafkaEventTypes,
  KafkaTopic,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
  Role,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../../prisma.client";
import { param } from "express-validator";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.delete(
  "/api/theaters/:theaterId/screens/:id",
  nonAuthorizeMiddleware,
  [
    param("theaterId").isUUID().withMessage("Invalid theater id"),
    param("id").isUUID().withMessage("Invalid screen id"),
  ],
  requestValidatorMiddleware,
  checkPermission(Permission.THEATER_UPDATE),
  async (req: Request, res: Response) => {
    const { theaterId, id } = req.params as {
      theaterId: string;
      id: string;
    };

    const currentUser = req.currentUser!;
    const existingTheater = await prisma.theater.findFirst({
      where: {
        id: theaterId as string,
        deleted: false,
      },
    });

    if (!existingTheater) {
      throw new NotFoundError();
    }

    const screen = await prisma.screen.findFirst({
      where: {
        id,
        theaterId,
        deleted: false,
      },
    });

    if (!screen) {
      throw new NotFoundError();
    }

    if (
      existingTheater.ownerId !== currentUser.id &&
      currentUser?.role !== Role.ADMIN
    ) {
      throw new NotAuthorizeError("You are not the owner of this theater.");
    }

    await prisma.$transaction(async (tx) => {
      const updatedScreen = await tx.screen.update({
        where: {
          id: id,
          deleted: false,
        },
        data: {
          deleted: true,
          deletedBy: req.currentUser!.id,
          entityVersion: {
            increment: 1,
          },
        },
      });

      const event = createEnvelope<IScreenDeleteEventData>(
        {
          topic: KafkaTopic.THEATER_TOPIC,
          eventType: KafkaEventTypes.SCREEN_DELETED,
          serviceName: process.env.SERVICE_NAME!,
        },
        {
          id,
          entityVersion: updatedScreen.entityVersion,
        },
      );
      await tx.outbox.create({
        data: {
          aggregateType: KafkaAggregateType.SCREEN,
          aggregateId: id,
          topic: KafkaTopic.THEATER_TOPIC,
          eventType: KafkaEventTypes.SCREEN_DELETED,
          eventVersion: updatedScreen.entityVersion,
          payload: event as unknown as Prisma.InputJsonValue,
        },
      });
    });

    return res.send({});
  },
);

export { router as screenDeleteRouter };
