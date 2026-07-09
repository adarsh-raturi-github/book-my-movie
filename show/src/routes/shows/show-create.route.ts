import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
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
import { ScreenTypeEnum, SeatTypeEnum } from "../../enums";
const router = express.Router();

router.post(
  "/api/shows",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_CREATE),
  [
    body("movieId").isUUID().withMessage("Invalid movie id"),

    body("screenId").isUUID().withMessage("Invalid screen id"),

    body("startTime")
      .notEmpty()
      .withMessage("Start time is required")
      .isISO8601()
      .withMessage("Invalid start time")
      .toDate(),

    body("endTime")
      .notEmpty()
      .withMessage("End time is required")
      .isISO8601()
      .withMessage("Invalid end time")
      .toDate(),

    body("bookingOpenAt")
      .notEmpty()
      .withMessage("Booking open time is required")
      .isISO8601()
      .withMessage("Invalid booking open time")
      .toDate(),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const { screenId, movieId, startTime, endTime, bookingOpenAt } = req.body;
    if (startTime <= new Date()) {
      throw new BadRequestError("Show start time must be in the future.");
    }
    const [screen, movie] = await Promise.all([
      prisma.screenProjection.findFirst({
        where: {
          id: screenId,
        },
      }),
      prisma.movieProjection.findFirst({
        where: {
          id: movieId,
        },
      }),
    ]);
    if (!screen) {
      throw new NotFoundError();
    }
    if (!movie) {
      throw new NotFoundError();
    }

    if (screen.status !== ScreenStatus.ACTIVE) {
      throw new BadRequestError("Screen is not active.");
    }
    if (movie.status !== MovieStatus.ACTIVE) {
      throw new BadRequestError("Movie is not active.");
    }
    if (startTime.getTime() >= endTime.getTime()) {
      throw new BadRequestError(
        "Start Time can't be equal or greater than end time",
      );
    }
    if (bookingOpenAt.getTime() > startTime.getTime()) {
      throw new BadRequestError(
        "Booking opend Time can't  greater than start time",
      );
    }

    const overlappingShow = await prisma.show.findFirst({
      where: {
        deleted: false,
        screenId,
        startTime: {
          lt: endTime,
        },
        endTime: {
          gt: startTime,
        },
      },
    });

    if (overlappingShow) {
      throw new BadRequestError(
        "Another show is already scheduled during this time.",
      );
    }

    const seats = await prisma.seatProjection.findMany({
      where: {
        screenId,
        status: SeatStatus.ACTIVE,
      },
      select: {
        id: true,
        seatType: true,
      },
    });

    if (seats?.length) {
      throw new BadRequestError("theater has no seats");
    }
    const show = await prisma.$transaction(async (tx) => {
      const show = await tx.show.create({
        data: {
          movieId,
          screenId,
          status: ShowStatus.SCHEDULED,
          startTime,
          endTime,
          bookingOpenAt,
          createdBy: `${req.currentUser?.id}`,
        },
      });

      await tx.showSeat.createMany({
        data: seats.map((seat) => {
          return {
            showId: show.id,
            seatId: seat.id,
            price: pricingService.calculateSeatPrice(
              screen.type as ScreenTypeEnum,
              seat.seatType as SeatTypeEnum,
            ),
            status: ShowSeatStatus.AVAILABLE,
            version: 1,
            createdBy: req.currentUser!.id,
          };
        }),
      });

      return show;
    });

    res.status(201).send(show);
  },
);
