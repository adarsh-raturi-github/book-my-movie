import express, { Request, Response } from "express";
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
import { body, param } from "express-validator";
import { prisma } from "../../prisma.client";
import { SCREEN_STATUS, SCREEN_TYPES } from "../../constants";
const router = express.Router();

router.patch(
  "/api/screens/:screenId/seats/bulk",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_UPDATE),
  [
    param("screenId").isUUID().withMessage("Invalid screen id"),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Screen name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Screen name must be between 2 and 100 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Description cannot exceed 5000 characters"),

    body("type")
      .optional()
      .isIn(SCREEN_TYPES)
      .withMessage("Invalid screen type"),

    body("status")
      .optional()
      .isIn(SCREEN_STATUS)
      .withMessage("Invalid screen status"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    if (!Object.keys(req.body).length) {
      throw new BadRequestError("At least one field must be provided.");
    }

    const { screenId } = req.params as { screenId: string };
    const { seats } = req.body as { seats: any[] };
    const existingScreen = await prisma.screen.findFirst({
      where: {
        id: screenId,
        deleted: false,
      },
    });

    if (!existingScreen) {
      throw new NotFoundError();
    }

    const existingSeats = await prisma.seat.findMany({
      where: {
        OR:[
     {id: { in: seats.map((s) => s.id) }}
     
        ]
   
        
        rowLabel: { in: seats.map((s) => s.rowLabel) },
        seatNumber: { in: seats.map((s) => s.seatNumber) },
        deleted: false,
      },
    });

    const seatAllotment = new Map<
      string,
      { rowLabel: string; seatNumber: number }
    >();
    for (const seat of existingSeats) {
      seatAllotment.set(seat.id, {
        rowLabel: seat.rowLabel,
        seatNumber: seat.seatNumber,
      });
    }

    for (const seat of seats) {
    }
  },
);
