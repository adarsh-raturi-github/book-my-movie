import {
  checkPermission,
  nonAuthorizeMiddleware,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../../prisma.client";
import { param } from "express-validator";

const router = express.Router();

router.get(
  "/api/screens/:screenId/seats",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_READ),
  [param("screenId").isUUID().withMessage("Invalid screenId id")],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const { screenId } = req.params as {
      screenId: string;
    };
    // findMany always return [] never return null
    const screen = await prisma.screen.findFirst({
      where: {
        id: screenId,
        deleted: false,
      },
    });

    if (!screen) {
      throw new NotFoundError();
    }

    const seats = await prisma.seat.findMany({
      where: {
        screenId,
        deleted: false,
      },
      orderBy: {
        rowLabel: "asc",
        seatNumber: "asc",
      },
    });

    return res.send(seats);
  },
);

export { router as seatListRoute };
