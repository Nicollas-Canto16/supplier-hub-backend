/*
  Warnings:

  - Made the column `email` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instagram` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `site` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact_name` on table `Supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "instagram" SET NOT NULL,
ALTER COLUMN "site" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "contact_name" SET NOT NULL;
