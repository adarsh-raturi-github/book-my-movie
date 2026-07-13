import {
  checkPermission,
  nonAuthorizeMiddleware,
  NotFoundError,
  Permission,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../prisma.client";

const router = express.Router();

router.get(
  "/api/movies/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.MOVIE_READ),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const existingMovie = await prisma.movie.findFirst({
      where: {
        id: id as string,
        deleted: false,
      },
    });
    if (!existingMovie) {
      throw new NotFoundError();
    }

    return res.send(existingMovie);
  },
);

export { router as movieGetRoute };
