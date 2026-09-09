/**
PATCH /api/shows/:id

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
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
  Role,
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

router.patch(
  "/api/shows/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_UPDATE),
  [
    body("startTime")
      .optional()
      .notEmpty()
      .withMessage("Start time is required")
      .isISO8601()
      .withMessage("Invalid start time")
      .toDate(),

    body("endTime")
      .optional()
      .notEmpty()
      .withMessage("End time is required")
      .isISO8601()
      .withMessage("Invalid end time")
      .toDate(),

    body("bookingOpenAt")
      .optional()
      .notEmpty()
      .withMessage("Booking open time is required")
      .isISO8601()
      .withMessage("Invalid booking open time")
      .toDate(),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    let { startTime, endTime, bookingOpenAt } = req.body;
    const { id } = req.params as { id: string };
    const currentUser = req.currentUser!;

    const existingShow = await prisma.show.findFirst({
      where: { id, deleted: false },
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
    startTime = startTime ?? existingShow.startTime;
    endTime = endTime ?? existingShow.endTime;
    bookingOpenAt = bookingOpenAt ?? existingShow.bookingOpenAt;

    const now = new Date();

    if (startTime <= now || endTime <= now) {
      throw new BadRequestError(
        "Show start time or end time must be in the future.",
      );
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

    if (existingShow?.status !== ShowStatusEnum.SCHEDULED) {
      throw new BadRequestError("Show cant be updated");
    }

    prisma.$transaction(async (tx) => {
      const overlappingShow = await prisma.show.findFirst({
        where: {
          id: {
            not: existingShow.id,
          },
          deleted: false,
          screenId: existingShow.screenId,
          startTime: {
            lt: endTime,
          },
          endTime: {
            gt: startTime,
          },
        },
      });
      if (overlappingShow) {
        throw new BadRequestError("Overlapping show");
      }

      const updatedShow = await prisma.show.update({
        data: {
          startTime,
          endTime,
          bookingOpenAt,
          version: {
            increment: 1,
          },
        },
        where: {
          id,
          deleted: false,
        },
      });

      res.status(200).send(updatedShow);
    });
  },
);

export { router as showUpdateRouter };
