/*
  Warnings:

  - You are about to drop the column `contactName` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the `access_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_reset_token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "access_logs" DROP CONSTRAINT "access_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_token" DROP CONSTRAINT "password_reset_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "contactName",
ADD COLUMN     "contact_name" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "access_logs";

-- DropTable
DROP TABLE "password_reset_token";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "AccessLogAction";
