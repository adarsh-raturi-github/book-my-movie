-- AlterTable
ALTER TABLE "screens" ADD COLUMN     "entityVersion" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "seats" ADD COLUMN     "entityVersion" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "theaters" ADD COLUMN     "entityVersion" INTEGER NOT NULL DEFAULT 1;
