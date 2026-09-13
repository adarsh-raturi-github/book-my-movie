/**
PATCH /api/shows/:id/cancel

Allowed fields:
- startTime
- endTime
- bookingOpenAt

Status changes are handled by dedicated domain operations.
movieId and screenId cannot be changed after show creation.
*/
import {
  BadRequestError,
  checkPermission,
  createEnvelope,
  DomainEventTypes,
  IShowSeatDeleteEventData,
  IShowSeatUpdateEventData,
  KafkaAggregateType,
  KafkaTopic,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
  Role,
  ShowSeatStatusEnum,
  ShowStatusEnum,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { prisma } from "../../prisma.client";
import {
  MovieStatus,
  ScreenStatus,
  ScreenType,
  SeatStatus,
  ShowSeatStatus,
  ShowStatus,
} from "@prisma/client";
import { pricingService } from "../../services/pricing.service";
const router = express.Router();

router.post(
  "/api/shows/:id/cancel",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_UPDATE),
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const currentUser = req.currentUser!;

    await prisma.$transaction(async (tx) => {
      const existingShow = await tx.show.findFirst({
        where: {
          id,
          deleted: false,
        },
      });

      if (!existingShow) {
        throw new NotFoundError();
      }
      if (
        existingShow.createdBy !== currentUser.id &&
        currentUser.role !== Role.ADMIN
      ) {
        throw new NotAuthorizeError("Cant update show");
      }

      if (ShowStatus.SCHEDULED != existingShow.status) {
        throw new BadRequestError("Show cant be cancelled");
      }
      // A show cannot be cancelled once any seat has been locked or booked.
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

      const bookedAndLockedSeats = showSeats.filter((seat) =>
        [ShowSeatStatusEnum.BOOKED, ShowSeatStatusEnum.LOCKED].includes(
          seat.status as ShowSeatStatusEnum,
        ),
      );

      if (bookedAndLockedSeats?.length) {
        throw new BadRequestError(
          "Can't cancel show ,seats are booked or locked ",
        );
      }

      await tx.show.update({
        data: {
          status: ShowStatus.CANCELLED,
          version: {
            increment: 1,
          },
        },
        where: {
          id,
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
              eventVersion: 1,
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
    });
  },
);

export { router as showCancelRouter };
