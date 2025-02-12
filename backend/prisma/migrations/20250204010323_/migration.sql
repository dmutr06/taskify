/*
  Warnings:

  - Added the required column `isGroup` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isGroup" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT;
