import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  Role,
  requestValidatorMiddleware,
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

    // Don't delete shows that already have bookings
    const bookedSeats = await prisma.showSeat.count({
      where: {
        showId: id,
        status: ShowSeatStatus.BOOKED,
      },
    });

    if (bookedSeats > 0) {
      throw new BadRequestError(
        "Cannot delete a show with confirmed bookings.",
      );
    }

    const deletedShow = await prisma.$transaction(async (tx) => {
      const show = await tx.show.update({
        where: {
          id,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
          deletedBy: currentUser.id,
        },
      });

      await tx.showSeat.updateMany({
        where: {
          showId: id,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
          deletedBy: currentUser.id,
        },
      });

      // TODO:
      // Insert ShowDeleted event into Outbox table here.

      return show;
    });

    return res.status(200).send(deletedShow);
  },
);

export { router as deleteShowRouter };
