-- CreateEnum
CREATE TYPE "MovieCertificate" AS ENUM ('U', 'UA', 'A');

-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "movies" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "languages" TEXT[],
    "genres" TEXT[],
    "certificate" "MovieCertificate" NOT NULL,
    "release_date" DATE NOT NULL,
    "poster_key" VARCHAR(255) NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "entity_version" INTEGER NOT NULL DEFAULT 1,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox" (
    "id" UUID NOT NULL,
    "aggregate_type" TEXT NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "topic" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "correlation_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movies_title_idx" ON "movies"("title");

-- CreateIndex
CREATE INDEX "movies_status_idx" ON "movies"("status");

-- CreateIndex
CREATE INDEX "movies_release_date_idx" ON "movies"("release_date");

-- CreateIndex
CREATE INDEX "outbox_topic_idx" ON "outbox"("topic");

-- CreateIndex
CREATE INDEX "outbox_aggregate_type_aggregate_id_idx" ON "outbox"("aggregate_type", "aggregate_id");

-- CreateIndex
CREATE INDEX "outbox_created_at_idx" ON "outbox"("created_at");


CREATE PUBLICATION movie_publication
FOR TABLE outbox;
