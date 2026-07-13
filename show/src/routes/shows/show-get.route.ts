import {
  checkPermission,
  nonAuthorizeMiddleware,
  NotFoundError,
  Permission,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../../prisma.client";

const router = express.Router();

router.get(
  "/api/shows/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.SHOW_READ),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const existingShow = await prisma.show.findFirst({
      where: {
        id: id as string,
        deleted: false,
      },
    });
    if (!existingShow) {
      throw new NotFoundError();
    }

    return res.send(existingShow);
  },
);

export { router as showGetRouter };
