/*
  Warnings:

  - You are about to drop the column `recipientIds` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "_MessageRecipient" ADD CONSTRAINT "_MessageRecipient_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MessageRecipient_AB_unique";

-- AlterTable
ALTER TABLE "_StudentParents" ADD CONSTRAINT "_StudentParents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_StudentParents_AB_unique";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "recipientIds";
