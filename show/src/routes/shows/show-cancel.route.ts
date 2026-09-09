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
  "/api/shows/:id/cancel",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_UPDATE),
  [body("status").optional().isIn(Object.values(ShowStatus.CANCELLED))],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    let { status } = req.body;
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

    if (ShowStatus.SCHEDULED != existingShow.status) {
      throw new BadRequestError("Show cant be cancelled");
    }

    prisma.$transaction(async (tx) => {
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
      await tx.outbox.create({});
    });
  },
);

export { router as showUpdateRouter };
