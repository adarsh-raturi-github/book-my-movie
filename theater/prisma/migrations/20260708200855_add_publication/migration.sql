/*
  Warnings:

  - You are about to drop the `Outbox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Outbox";

-- CreateTable
CREATE TABLE "outbox" (
    "id" UUID NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" UUID NOT NULL,
    "topic" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventVersion" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "correlationId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outbox_topic_idx" ON "outbox"("topic");

-- CreateIndex
CREATE INDEX "outbox_aggregateType_aggregateId_idx" ON "outbox"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "outbox_createdAt_idx" ON "outbox"("createdAt");

CREATE PUBLICATION theater_publication
FOR TABLE outbox;


/*
  Warnings:

  - You are about to drop the column `aggregateId` on the `outbox` table. All the data in the column will be lost.
  - You are about to drop the column `aggregateType` on the `outbox` table. All the data in the column will be lost.
  - You are about to drop the column `correlationId` on the `outbox` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `outbox` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `outbox` table. All the data in the column will be lost.
  - You are about to drop the column `eventVersion` on the `outbox` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `outbox` table. All the data in the column will be lost.
  - Added the required column `aggregate_id` to the `outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aggregate_type` to the `outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_type` to the `outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_version` to the `outbox` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "outbox_aggregateType_aggregateId_idx";

-- DropIndex
DROP INDEX "outbox_createdAt_idx";

-- AlterTable
ALTER TABLE "outbox" DROP COLUMN "aggregateId",
DROP COLUMN "aggregateType",
DROP COLUMN "correlationId",
DROP COLUMN "createdAt",
DROP COLUMN "eventType",
DROP COLUMN "eventVersion",
DROP COLUMN "processedAt",
ADD COLUMN     "aggregate_id" UUID NOT NULL,
ADD COLUMN     "aggregate_type" TEXT NOT NULL,
ADD COLUMN     "correlation_id" UUID,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_type" TEXT NOT NULL,
ADD COLUMN     "event_version" INTEGER NOT NULL,
ADD COLUMN     "processed_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "outbox_aggregate_type_aggregate_id_idx" ON "outbox"("aggregate_type", "aggregate_id");

-- CreateIndex
CREATE INDEX "outbox_created_at_idx" ON "outbox"("created_at");
