import {
  checkPermission,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  Role,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../prisma.client";

const router = express.Router();

router.delete(
  "/api/movies/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.MOVIE_DELETE),
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

    if (
      existingMovie.createdBy !== req.currentUser?.id &&
      req.currentUser?.role !== Role.ADMIN
    ) {
      throw new NotAuthorizeError("Cant delete a show");
    }

    const updatedMovie = await prisma.movie.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
        deletedBy: req.currentUser!.id,
      },
    });

    res.send(updatedMovie);
  },
);
