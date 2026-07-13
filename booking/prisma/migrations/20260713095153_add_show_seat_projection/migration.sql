-- CreateEnum
CREATE TYPE "ShowSeatStatus" AS ENUM ('AVAILABLE', 'LOCKED', 'BOOKED', 'BLOCKED');

-- CreateTable
CREATE TABLE "show_seat_projection" (
    "id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "ShowSeatStatus" NOT NULL,
    "booking_id" TEXT,
    "locked_until" TIMESTAMP(3),
    "entity_version" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "show_seat_projection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "show_seat_projection_show_id_idx" ON "show_seat_projection"("show_id");

-- CreateIndex
CREATE INDEX "show_seat_projection_seat_id_idx" ON "show_seat_projection"("seat_id");

-- CreateIndex
CREATE INDEX "show_seat_projection_status_idx" ON "show_seat_projection"("status");

-- CreateIndex
CREATE INDEX "show_seat_projection_booking_id_idx" ON "show_seat_projection"("booking_id");

-- CreateIndex
CREATE INDEX "show_seat_projection_locked_until_idx" ON "show_seat_projection"("locked_until");
