/*
  Warnings:

  - Changed the type of `type` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('ONE_TO_ONE', 'SUBGROUP', 'GROUP');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "type",
ADD COLUMN     "type" "ChatType" NOT NULL;
