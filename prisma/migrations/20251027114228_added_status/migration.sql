/*
  Warnings:

  - You are about to drop the column `canResetPassword` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isResentOtp` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isResetPassword` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordChangedAt` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Inactive', 'Banned');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "canResetPassword",
DROP COLUMN "isResentOtp",
DROP COLUMN "isResetPassword",
DROP COLUMN "passwordChangedAt",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'Active';
