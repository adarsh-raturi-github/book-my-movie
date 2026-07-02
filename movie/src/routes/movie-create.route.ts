import express, { Request, Response } from "express";
import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  Permission,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import { body } from "express-validator";
import { prisma } from "../prisma.client";
import { MOVIE_CERTIFICATES } from "../constants";
const router = express.Router();

router.post(
  "/api/movies",
  nonAuthorizeMiddleware,
  checkPermission(Permission.MOVIE_CREATE),
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 1, max: 255 })
      .withMessage("Title must be between 1 and 255 characters"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 10, max: 5000 })
      .withMessage("Description must be between 10 and 5000 characters"),

    body("durationMinutes")
      .isInt({ min: 1, max: 600 })
      .withMessage("Duration must be between 1 and 600 minutes"),

    body("languages")
      .isArray({ min: 1 })
      .withMessage("At least one language is required"),

    body("languages.*")
      .trim()
      .notEmpty()
      .withMessage("Language cannot be empty"),

    body("genres")
      .isArray({ min: 1 })
      .withMessage("At least one genre is required"),

    body("genres.*").trim().notEmpty().withMessage("Genre cannot be empty"),

    body("certificate")
      .isIn(MOVIE_CERTIFICATES)
      .withMessage("Invalid movie certificate"),

    body("releaseDate")
      .isISO8601()
      .withMessage("Release date must be a valid date"),

    body("posterKey")
      .trim()
      .notEmpty()
      .withMessage("Poster Key is required")
      .isLength({ max: 500 })
      .withMessage("Poster Key is too long"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    const {
      title,
      description,
      durationMinutes,
      languages,
      genres,
      certificate,
      releaseDate,
      posterKey,
    } = req.body;
    const normalizedTitle = (title.trim() as string).toLowerCase();
    const existingMovie = await prisma.movie.findFirst({
      where: {
        title: normalizedTitle,
        releaseDate: new Date(releaseDate),
        deleted: false,
      },
    });
    if (existingMovie) {
      throw new BadRequestError("Movie already exists");
    }

    try {
      const movie = await prisma.movie.create({
        data: {
          title: normalizedTitle,
          description,
          durationMinutes,
          languages,
          genres,
          certificate,
          releaseDate: new Date(releaseDate),
          posterKey,
          createdBy: `${req.currentUser?.id}`,
        },
      });

      res.status(201).send(movie);
    } catch (e: any) {
      throw new BadRequestError(e.message);
    }
  },
);
