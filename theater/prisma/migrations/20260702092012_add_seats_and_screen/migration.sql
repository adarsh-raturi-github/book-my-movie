-- CreateEnum
CREATE TYPE "ScreenStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('REGULAR', 'IMAX', 'DOLBY', 'FOUR_DX');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('REGULAR', 'PREMIUM', 'RECLINER', 'WHEELCHAIR');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'UNDER_MAINTENANCE');

-- AlterTable
ALTER TABLE "theaters" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "screens" (
    "id" UUID NOT NULL,
    "theater_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "type" "ScreenType" NOT NULL DEFAULT 'REGULAR',
    "status" "ScreenStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" UUID NOT NULL,
    "screen_id" UUID NOT NULL,
    "row_label" VARCHAR(10) NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "seat_type" "SeatType" NOT NULL DEFAULT 'REGULAR',
    "status" "SeatStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "screens_theater_id_idx" ON "screens"("theater_id");

-- CreateIndex
CREATE INDEX "screens_status_idx" ON "screens"("status");

-- CreateIndex
CREATE UNIQUE INDEX "screens_theater_id_name_key" ON "screens"("theater_id", "name");

-- CreateIndex
CREATE INDEX "seats_screen_id_idx" ON "seats"("screen_id");

-- CreateIndex
CREATE INDEX "seats_status_idx" ON "seats"("status");

-- CreateIndex
CREATE UNIQUE INDEX "seats_screen_id_row_label_seat_number_key" ON "seats"("screen_id", "row_label", "seat_number");

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_theater_id_fkey" FOREIGN KEY ("theater_id") REFERENCES "theaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "screens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
