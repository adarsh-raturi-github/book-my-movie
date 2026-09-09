import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  Role,
  requestValidatorMiddleware,
  KafkaAggregateType,
  KafkaTopic,
  DomainEventTypes,
  IShowSeatDeleteEventData,
  createEnvelope,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { prisma } from "../../prisma.client";
import { ShowSeatStatus, ShowStatus } from "@prisma/client";

const router = express.Router();

router.delete(
  "/api/shows/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_DELETE),
  [param("id").isUUID().withMessage("Invalid show id")],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const currentUser = req.currentUser!;

    const existingShow = await prisma.show.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!existingShow || existingShow.deleted) {
      throw new NotFoundError();
    }

    // Owner or Admin
    if (
      existingShow.createdBy !== currentUser.id &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new NotAuthorizeError(
        "You are not authorized to delete this show.",
      );
    }

    // Only scheduled shows can be deleted
    if (existingShow.status !== ShowStatus.SCHEDULED) {
      throw new BadRequestError("Only scheduled shows can be deleted.");
    }

    const deletedShow = await prisma.$transaction(async (tx) => {
      // Lock all active ShowSeat rows for this show before checking their status.
      // This prevents concurrent booking/seat-lock operations from modifying
      // these seats while the show deletion transaction is in progress.
      const showSeats = await tx.$queryRaw<
        {
          id: string;
          status: ShowSeatStatus;
          version: number;
        }[]
      >`
  SELECT id, status, version
  FROM show_seat
  WHERE show_id = ${id}
    AND deleted = false
  FOR UPDATE
`;
      const occupiedOrLockedSeats = showSeats.some(
        (seat) =>
          seat.status === ShowSeatStatus.BOOKED ||
          seat.status === ShowSeatStatus.LOCKED,
      );

      if (occupiedOrLockedSeats) {
        throw new BadRequestError(
          "Cannot delete a show while seats are booked or locked.",
        );
      }
      const show = await tx.show.update({
        where: {
          id,
          deleted: false,
        },
        data: {
          version: {
            increment: 1,
          },
          deleted: true,
          deletedAt: new Date(),
          deletedBy: currentUser.id,
        },
      });

      const udatedShowSeats = await tx.showSeat.updateManyAndReturn({
        where: {
          showId: id,
          deleted: false,
        },
        data: {
          version: {
            increment: 1,
          },
          deleted: true,
          deletedAt: new Date(),
          deletedBy: currentUser.id,
        },
      });

      await tx.outbox.createMany({
        data: udatedShowSeats.map(
          (showSeat) =>
            ({
              aggregateType: KafkaAggregateType.SHOW_SEAT,
              aggregateId: showSeat.id,
              topic: KafkaTopic.SHOW_TOPIC,
              eventType: DomainEventTypes.SHOW_SEAT_DELETED,
              eventVersion: showSeat.version,
              payload: createEnvelope<IShowSeatDeleteEventData>(
                {
                  topic: KafkaTopic.SHOW_TOPIC,
                  eventType: DomainEventTypes.SHOW_SEAT_DELETED,
                  serviceName: process.env.SERVICE_NAME!,
                },
                {
                  id: showSeat.id,
                  entityVersion: showSeat.version,
                },
              ),
            }) as any,
        ),
      });
      return show;
    });

    return res.status(204).send();
  },
);

export { router as showDeleteRouter };
