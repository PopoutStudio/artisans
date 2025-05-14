-- AlterTable
ALTER TABLE "Artisan" ADD COLUMN     "codePostal" TEXT,
ADD COLUMN     "commune" TEXT,
ADD COLUMN     "rayon" INTEGER NOT NULL DEFAULT 10;
