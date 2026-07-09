-- CreateEnum
CREATE TYPE "ShowStatus" AS ENUM ('SCHEDULED', 'RUNNING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShowSeatStatus" AS ENUM ('AVAILABLE', 'LOCKED', 'BOOKED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ScreenStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('REGULAR', 'IMAX', 'DOLBY', 'FOUR_DX');

-- CreateEnum
CREATE TYPE "MovieCertificate" AS ENUM ('U', 'UA', 'A');

-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('REGULAR', 'PREMIUM', 'RECLINER', 'WHEELCHAIR');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "shows" (
    "id" UUID NOT NULL,
    "movieId" UUID NOT NULL,
    "screenId" UUID NOT NULL,
    "status" "ShowStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "bookingOpenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_seats" (
    "id" UUID NOT NULL,
    "showId" UUID NOT NULL,
    "seatId" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "ShowSeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "lockExpiresAt" TIMESTAMP(3),
    "bookingId" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "show_seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screen_projections" (
    "id" UUID NOT NULL,
    "theaterId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ScreenType" NOT NULL,
    "status" "ScreenStatus" NOT NULL,
    "entityVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screen_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_projections" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "language" TEXT[],
    "certificate" "MovieCertificate" NOT NULL,
    "genres" TEXT[],
    "posterUrl" TEXT,
    "status" "MovieStatus" NOT NULL,
    "entityVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_projections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat_projections" (
    "id" UUID NOT NULL,
    "screenId" UUID NOT NULL,
    "rowLabel" VARCHAR(10) NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "seatType" "SeatType" NOT NULL,
    "status" "SeatStatus" NOT NULL,
    "entityVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "seat_projections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shows_movieId_idx" ON "shows"("movieId");

-- CreateIndex
CREATE INDEX "shows_screenId_idx" ON "shows"("screenId");

-- CreateIndex
CREATE INDEX "shows_status_idx" ON "shows"("status");

-- CreateIndex
CREATE INDEX "shows_startTime_idx" ON "shows"("startTime");

-- CreateIndex
CREATE INDEX "shows_bookingOpenAt_idx" ON "shows"("bookingOpenAt");

-- CreateIndex
CREATE INDEX "shows_screenId_startTime_idx" ON "shows"("screenId", "startTime");

-- CreateIndex
CREATE INDEX "show_seats_showId_idx" ON "show_seats"("showId");

-- CreateIndex
CREATE INDEX "show_seats_seatId_idx" ON "show_seats"("seatId");

-- CreateIndex
CREATE INDEX "show_seats_status_idx" ON "show_seats"("status");

-- CreateIndex
CREATE INDEX "show_seats_bookingId_idx" ON "show_seats"("bookingId");

-- CreateIndex
CREATE INDEX "show_seats_showId_status_idx" ON "show_seats"("showId", "status");

-- CreateIndex
CREATE INDEX "show_seats_showId_lockExpiresAt_idx" ON "show_seats"("showId", "lockExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "show_seats_showId_seatId_key" ON "show_seats"("showId", "seatId");

-- CreateIndex
CREATE INDEX "screen_projections_theaterId_idx" ON "screen_projections"("theaterId");

-- CreateIndex
CREATE INDEX "screen_projections_status_idx" ON "screen_projections"("status");

-- CreateIndex
CREATE UNIQUE INDEX "screen_projections_theaterId_name_key" ON "screen_projections"("theaterId", "name");

-- CreateIndex
CREATE INDEX "movie_projections_title_idx" ON "movie_projections"("title");

-- CreateIndex
CREATE INDEX "movie_projections_status_idx" ON "movie_projections"("status");

-- CreateIndex
CREATE INDEX "movie_projections_language_idx" ON "movie_projections"("language");

-- CreateIndex
CREATE INDEX "seat_projections_screenId_idx" ON "seat_projections"("screenId");

-- CreateIndex
CREATE INDEX "seat_projections_status_idx" ON "seat_projections"("status");

-- CreateIndex
CREATE INDEX "seat_projections_screenId_status_idx" ON "seat_projections"("screenId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "seat_projections_screenId_rowLabel_seatNumber_key" ON "seat_projections"("screenId", "rowLabel", "seatNumber");

-- AddForeignKey
ALTER TABLE "show_seats" ADD CONSTRAINT "show_seats_showId_fkey" FOREIGN KEY ("showId") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
