/*
  Warnings:

  - You are about to drop the column `status` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "status";

-- DropEnum
DROP TYPE "LinkStatus";
