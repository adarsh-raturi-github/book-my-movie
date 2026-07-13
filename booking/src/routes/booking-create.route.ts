import {
  BadRequestError,
  checkPermission,
  createEnvelope,
  IScreenCreateEventData,
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
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { prisma } from "../prisma.client";
import { BookingStatusEnum, ShowSeatStatusEnum } from "../enums";

const router = express.Router();
/**
 *  Never trust the client.
The client should never decide how much to pay. thats why total amount is not payload
-----------------
userId not in pyalod reason:authenticated user is the booking owner.
Otherwise someone can book tickets for another user.
 */
router.post(
  "/api/bookings",

  nonAuthorizeMiddleware,
  checkPermission(Permission.BOOKING_CREATE),
  [
    body("showId").isUUID().withMessage("Invalid show id"),

    body("seatIds")
      .isArray({ min: 1 })
      .withMessage("At least one seat is required"),

    body("seatIds.*").isUUID().withMessage("Invalid seat id"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const currentUser = req.currentUser!;
    let { seatIds, showId } = req.body as { seatIds: string[]; showId: string };

    if (new Set(seatIds).size !== seatIds.length) {
      throw new BadRequestError("Duplicate seat ids are not allowed.");
    }
    seatIds = [...new Set(seatIds)];
    const showSeats = await prisma.showSeatProjection.findMany({
      where: {
        showId,
        seatId: { in: seatIds },
        OR: [
          { status: ShowSeatStatusEnum.AVAILABLE },
          {
            status: ShowSeatStatusEnum.LOCKED,
            lockedUntil: { gte: 150000 },
          },
        ],
      },
    });
    if (showSeats.length !== seatIds.length) {
      throw new BadRequestError("One or more seats are unavailable.");
    }

    let totalAmount = 0;
    for (const seat of showSeats) {
      totalAmount += Number(seat.price);
    }

    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId: currentUser.id,
          showId,
          status: BookingStatusEnum.CREATED,
          totalAmount,
          expiresAt: new Date(),
          createdBy: currentUser.id,
        },
      });
      await tx.bookingSeat.createMany({
        data: showSeats.map((d) => ({
          bookingId: booking.id,
          showSeatId: d.id,
          price: d.price,
          createdBy: currentUser.id,
        })),
      });

      const event = createEnvelope<IBookingCreateData>(
        {
          topic: KafkaTopic.BOOKING_TOPIC,
          eventType: KafkaEventTypes.BOOKING_CREATED,
          serviceName: process.env.SERVICE_NAME!,
        },
        {
          id: booking.id,
          seatIds,
          showId,
          entityVersion: booking.entityVersion,
          expiresAt: booking.expiresAt,
          totalAmount: booking.totalAmount,
          userId: currentUser.id,
        },
        booking.id,
      );

      await tx.outbox.create({
        data: {
          aggregateType: KafkaAggregateType.BOOKING,
          aggregateId: booking.id,
          topic: KafkaTopic.BOOKING_TOPIC,
          eventType: KafkaEventTypes.BOOKING_CREATED,
          eventVersion: booking.entityVersion,
          payload: event as unknown as Prisma.InputJsonValue,
        },
      });
    });
  },
);

export { router as bookingCreateRouter };
