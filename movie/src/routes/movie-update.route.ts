import express, { Request, Response } from "express";
import {
  BadRequestError,
  checkPermission,
  nonAuthorizeMiddleware,
  NotFoundError,
  Permission,
  requestValidatorMiddleware,
} from "@adarsh-tickets/shared";
import { body } from "express-validator";
import { prisma } from "../prisma.client";
import { MOVIE_CERTIFICATES } from "../constants";
const router = express.Router();

router.patch(
  "/api/movies/:id",
  nonAuthorizeMiddleware,
  checkPermission(Permission.MOVIE_UPDATE),
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 1, max: 255 })
      .withMessage("Title must be between 1 and 255 characters"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 10, max: 5000 })
      .withMessage("Description must be between 10 and 5000 characters"),

    body("durationMinutes")
      .optional()
      .isInt({ min: 1, max: 600 })
      .withMessage("Duration must be between 1 and 600 minutes"),

    body("languages")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one language is required"),

    body("languages.*")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Language cannot be empty"),

    body("genres")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one genre is required"),

    body("genres.*")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Genre cannot be empty"),

    body("certificate")
      .optional()
      .isIn(MOVIE_CERTIFICATES)
      .withMessage("Invalid movie certificate"),

    body("releaseDate")
      .optional()
      .isISO8601()
      .withMessage("Release date must be a valid date"),

    body("posterKey")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Poster Key is required")
      .isLength({ max: 500 })
      .withMessage("Poster Key is too long"),
  ],
  requestValidatorMiddleware,
  async (req: Request, res: Response) => {
    let {
      title,
      description,
      durationMinutes,
      languages,
      genres,
      certificate,
      releaseDate,
      posterKey,
    } = req.body;

    const id = req.params.id as string;
    if (!Object.keys(req.body).length) {
      throw new BadRequestError("At least one field must be provided");
    }

    const existingMovie = await prisma.movie.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
    if (!existingMovie) {
      throw new NotFoundError();
    }
    const finalTitle = (
      (title ?? existingMovie.title).trim() as string
    ).toLowerCase();
    const finalReleaseDate = releaseDate
      ? new Date(releaseDate)
      : existingMovie.releaseDate;
    const isTitleChange = finalTitle !== existingMovie.title;
    const isReleaseDateChanged =
      finalReleaseDate?.getTime() !== existingMovie.releaseDate?.getTime();

    if (isTitleChange || isReleaseDateChanged) {
      const duplicateMovie = await prisma.movie.findFirst({
        where: {
          deleted: false,
          title: finalTitle,
          releaseDate: finalReleaseDate,
          id: {
            not: id,
          },
        },
      });
      if (duplicateMovie) {
        throw new BadRequestError(
          "Movie already exists with the same title and release date.",
        );
      }
    }
    const movie = await prisma.movie.update({
      where: { id },
      data: {
        title: finalTitle,
        description,
        durationMinutes,
        languages,
        genres,
        certificate,
        releaseDate: finalReleaseDate,
        posterKey,
        updatedBy: req.currentUser!.id,
      },
    });

    res.status(200).send(movie);
  },
);
