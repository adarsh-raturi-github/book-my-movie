import {
  BadRequestError,
  checkPermission,
  createEnvelope,
  ISeatCreateEventData,
  KafkaAggregateType,
  KafkaEventTypes,
  KafkaTopic,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
  Role,
  SeatStatusEnum,
  SeatTypeEnum,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { prisma } from "../../prisma.client";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.post(
  "/api/screens/:screenId/seats/bulk",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_UPDATE),
  [
    param("screenId").isUUID().withMessage("Invalid screen id"),

    body("seats")
      .isArray({ min: 1 })
      .withMessage("At least one seat is required"),

    body("seats.*.rowLabel")
      .trim()
      .notEmpty()
      .withMessage("Row label is required")
      .isLength({ min: 1, max: 5 })
      .withMessage("Row label is invalid"),

    body("seats.*.seatNumber")
      .isInt({ min: 1 })
      .withMessage("Seat number must be greater than 0"),

    // body("seats.*.seatType").isIn(SEAT_TYPES).withMessage("Invalid seat type"),
  ],
  requestValidatorMiddleware,

  async (req: Request, res: Response) => {
    const currentUser = req.currentUser!;

    const { screenId } = req.params as {
      screenId: string;
    };

    const { seats } = req.body as {
      seats: {
        rowLabel: string;
        seatNumber: number;
        seatType: SeatTypeEnum;
      }[];
    };

    const existingScreen = await prisma.screen.findFirst({
      where: {
        id: screenId,
        deleted: false,
      },
      include: {
        theater: true,
      },
    });

    if (!existingScreen) {
      throw new NotFoundError();
    }

    if (
      existingScreen.theater.ownerId !== currentUser.id &&
      currentUser.role !== Role.ADMIN
    ) {
      throw new NotAuthorizeError(
        "You are not authorized to manage this screen.",
      );
    }

    /**
     * Validate duplicate seats in request
     */
    const payloadSeats = new Set<string>();

    for (const seat of seats) {
      const key = `${seat.rowLabel.trim().toUpperCase()}-${seat.seatNumber}`;

      if (payloadSeats.has(key)) {
        throw new BadRequestError(
          `Duplicate seat found in request: ${seat.rowLabel}${seat.seatNumber}`,
        );
      }

      payloadSeats.add(key);
    }

    const created = await prisma.$transaction(async (tx) => {
      /**
       * Fetch existing seats
       */
      const existingSeats = await tx.seat.findMany({
        where: {
          screenId,
          deleted: false,
        },
        select: {
          rowLabel: true,
          seatNumber: true,
        },
      });

      const existingSeatSet = new Set(
        existingSeats.map(
          (seat) => `${seat.rowLabel.toUpperCase()}-${seat.seatNumber}`,
        ),
      );

      /**
       * Check duplicates against DB
       */
      for (const seat of seats) {
        const key = `${seat.rowLabel.trim().toUpperCase()}-${seat.seatNumber}`;

        if (existingSeatSet.has(key)) {
          throw new BadRequestError(
            `Seat ${seat.rowLabel}${seat.seatNumber} already exists.`,
          );
        }
      }

      /**
       * Bulk Insert
       */
      const createdSeats = await tx.seat.createManyAndReturn({
        data: seats.map((seat) => ({
          screenId,
          rowLabel: seat.rowLabel.trim().toUpperCase(),
          seatNumber: seat.seatNumber,
          seatType: seat.seatType,
          createdBy: currentUser.id,
          status: SeatStatusEnum.ACTIVE,
        })),
      });

      await tx.outbox.createMany({
        data: createdSeats.map(
          (seat) =>
            ({
              aggregateType: KafkaAggregateType.SEAT,
              aggregateId: seat.id,
              topic: KafkaTopic.THEATER_TOPIC,
              eventType: KafkaEventTypes.SEAT_CREATED,
              eventVersion: seat.entityVersion,
              payload: createEnvelope<ISeatCreateEventData>(
                {
                  topic: KafkaTopic.THEATER_TOPIC,
                  eventType: KafkaEventTypes.SEAT_CREATED,
                  serviceName: process.env.SERVICE_NAME!,
                },
                {
                  id: seat.id,
                  screenId: seat.screenId,
                  rowLabel: seat.rowLabel,
                  seatNumber: seat.seatNumber,
                  seatType: seat.seatType as SeatTypeEnum,
                  status: seat.status as SeatStatusEnum,
                  entityVersion: seat.entityVersion,
                },
              ),
            }) as any,
        ),
      });

      return createdSeats;
    });

    return res.status(201).send({
      created: created.length,
    });
  },
);

export { router as bulkCreateSeatRouter };
