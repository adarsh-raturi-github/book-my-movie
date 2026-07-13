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
  "/api/theaters/:theaterId/screens/:id",
  nonAuthorizeMiddleware,
  [
    param("theaterId").isUUID().withMessage("Invalid theater id"),
    param("id").isUUID().withMessage("Invalid screen id"),
  ],
  requestValidatorMiddleware,
  checkPermission(Permission.THEATER_READ),
  async (req: Request, res: Response) => {
    const { theaterId, id } = req.params as {
      theaterId: string;
      id: string;
    };

    // const existingTheater = await prisma.theater.findFirst({
    //   where: {
    //     id: theaterId as string,
    //     deleted: false,
    //   },
    // });

    // if (!existingTheater) {
    //   throw new NotFoundError();
    // }

    // const screen = await prisma.screen.findFirst({
    //   where: {
    //     id,
    //     theaterId,
    //     deleted: false,
    //   },
    // });

    // use two queries or just one
    const screen = await prisma.screen.findFirst({
      where: {
        id,
        theaterId,
        deleted: false,
        theater: {
          deleted: false,
        },
      },
    });

    if (!screen) {
      throw new NotFoundError();
    }

    return res.send(screen);
  },
);

export { router as screengetRouter };
