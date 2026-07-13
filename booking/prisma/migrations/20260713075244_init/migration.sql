-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CREATED', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "status" "BookingStatus" NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "entity_version" INTEGER NOT NULL DEFAULT 1,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_seat" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "show_seat_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "booking_seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_user_id_idx" ON "booking"("user_id");

-- CreateIndex
CREATE INDEX "booking_show_id_idx" ON "booking"("show_id");

-- CreateIndex
CREATE INDEX "booking_payment_id_idx" ON "booking"("payment_id");

-- CreateIndex
CREATE INDEX "booking_status_idx" ON "booking"("status");

-- CreateIndex
CREATE INDEX "booking_expires_at_idx" ON "booking"("expires_at");

-- CreateIndex
CREATE INDEX "booking_seat_booking_id_idx" ON "booking_seat"("booking_id");

-- CreateIndex
CREATE INDEX "booking_seat_show_seat_id_idx" ON "booking_seat"("show_seat_id");

-- AddForeignKey
ALTER TABLE "booking_seat" ADD CONSTRAINT "booking_seat_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
