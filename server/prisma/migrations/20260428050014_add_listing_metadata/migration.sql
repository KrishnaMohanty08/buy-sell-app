-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "negotiable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" JSONB;
