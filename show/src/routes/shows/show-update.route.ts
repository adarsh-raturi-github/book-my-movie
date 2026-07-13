/**
PATCH /api/shows/:id

Allowed fields:

- status
- startTime
- endTime
- bookingOpenAt

Not allowed:

- movieId
- screenId
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
import { ShowStatusEnum } from "../../enums";
const router = express.Router();

router.patch(
  "/api/shows/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_UPDATE),
  [
    body("movieId").optional().isUUID().withMessage("Invalid movie id"),

    body("screenId").optional().isUUID().withMessage("Invalid screen id"),

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

    body("status").optional().isIn(Object.values(ShowStatus)),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    let { screenId, movieId, startTime, endTime, bookingOpenAt, status } =
      req.body;
    const { id } = req.params as { id: string };
    const currentUser = req.currentUser!;

    if (movieId) {
      throw new BadRequestError("Editiing movie is not allowed");
    }
    if (screenId) {
      throw new BadRequestError("Screen change is not allowed");
    }

    const show = await prisma.show.findFirst({
      where: { id, deleted: false },
    });

    if (!show) {
      throw new NotFoundError();
    }

    if (show.createdBy !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new NotAuthorizeError("Cant update show");
    }
    startTime = startTime ?? show.startTime;
    endTime = endTime ?? show.endTime;
    bookingOpenAt = bookingOpenAt ?? show.bookingOpenAt;

    if (startTime <= new Date() || endTime <= new Date()) {
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

    if (show?.status !== ShowStatusEnum.SCHEDULED) {
      throw new BadRequestError("Show cant be updated");
    }
    const overlappingShow = await prisma.show.findFirst({
      where: {
        id: {
          not: show.id,
        },
        deleted: false,
        screenId: show.screenId,
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
      data: { status, startTime, endTime, bookingOpenAt },
      where: {
        id,
        deleted: false,
      },
    });

    res.status(201).send(updatedShow);
  },
);

export { router as showUpdateRouter };
