/*
  Warnings:

  - You are about to drop the column `memberId` on the `teamMember` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `teamMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,userId]` on the table `teamMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `teamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."teamMember" DROP CONSTRAINT "teamMember_memberId_fkey";

-- DropIndex
DROP INDEX "public"."teamMember_teamId_memberId_key";

-- AlterTable
ALTER TABLE "teamMember" DROP COLUMN "memberId",
DROP COLUMN "role",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teamMember_teamId_userId_key" ON "teamMember"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
