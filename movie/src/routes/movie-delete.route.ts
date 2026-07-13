import {
  checkPermission,
  createEnvelope,
  IMovieDeleteEventData,
  KafkaAggregateType,
  KafkaEventTypes,
  KafkaTopic,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  Role,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../prisma.client";
import { Prisma } from "@prisma/client";

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
      throw new NotAuthorizeError(
        "You are not authorized to delete this movie.",
      );
    }

    const updatedMovie = await prisma.$transaction(async (tx) => {
      const updatedMovie = await tx.movie.update({
        where: {
          id: id,
        },
        data: {
          deleted: true,
          deletedBy: req.currentUser!.id,
          entityVersion: {
            increment: 1,
          },
        },
      });

      const event = createEnvelope<IMovieDeleteEventData>(
        {
          topic: KafkaTopic.MOVIE_TOPIC,
          eventType: KafkaEventTypes.MOVIE_DELETED,
          serviceName: process.env.SERVICE_NAME!,
        },
        {
          entityVersion: updatedMovie.entityVersion,
          id: updatedMovie.id,
        },
      );

      await tx.outbox.create({
        data: {
          aggregateType: KafkaAggregateType.MOVIE,
          aggregateId: updatedMovie.id,
          topic: KafkaTopic.MOVIE_TOPIC,
          eventType: KafkaEventTypes.MOVIE_DELETED,
          eventVersion: updatedMovie.entityVersion,
          payload: event as unknown as Prisma.InputJsonValue,
        },
      });
      return updatedMovie;
    });

    res.send(updatedMovie);
  },
);
export { router as movieDeleteRoute };
