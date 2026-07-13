import {
  checkPermission,
  nonAuthorizeMiddleware,
  Permission,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import express, { Request, Response } from "express";
import { prisma } from "../prisma.client";
import { query } from "express-validator";

const router = express.Router();

router.get(
  "/api/movies",
  nonAuthorizeMiddleware,
  checkPermission(Permission.MOVIE_READ),
  [
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1, max: 100 }),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) || 10, 1),
      100,
    );

    const where = {
      deleted: false,
      ...req.filter,
    };
    const [movies, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.movie.count({ where }),
    ]);

    return res.send({
      data: movies,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  },
);

export { router as movieListRoute };
