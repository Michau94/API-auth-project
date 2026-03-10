/*
  Warnings:

  - You are about to drop the column `revokedAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "revokedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "usedAt" TIMESTAMP(3);
