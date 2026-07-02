import {
  checkPermission,
  nonAuthorizeMiddleware,
  NotAuthorizeError,
  NotFoundError,
  Permission,
  Role,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../../prisma.client";

const router = express.Router();

router.delete(
  "/api/theaters/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.THEATER_DELETE),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const currentUser = req.currentUser!;
    const existingTheater = await prisma.theater.findFirst({
      where: {
        id: id as string,
        deleted: false,
      },
    });
    if (!existingTheater) {
      throw new NotFoundError();
    }
    if (
      existingTheater.ownerId !== currentUser.id &&
      req.currentUser?.role !== Role.ADMIN
    ) {
      throw new NotAuthorizeError("You are not the owner of this theater.");
    }
    await prisma.theater.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
        deletedBy: req.currentUser!.id,
      },
    });

    return res.send();
  },
);
