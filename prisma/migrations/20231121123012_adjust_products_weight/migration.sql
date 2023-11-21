/*
  Warnings:

  - Added the required column `weight` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Made the column `discount` on table `Products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;
