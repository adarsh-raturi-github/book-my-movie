/*
  Warnings:

  - You are about to drop the column `createdAt` on the `movie_projections` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `movie_projections` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `screen_projections` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `screen_projections` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `show_seats` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `show_seats` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `shows` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `shows` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `movie_projections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `screen_projections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `show_seats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie_projections" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "screen_projections" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "show_seats" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "shows" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
