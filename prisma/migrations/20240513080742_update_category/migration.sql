/*
  Warnings:

  - You are about to drop the column `storeId` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `categories` table. All the data in the column will be lost.
  - Added the required column `store_id` to the `brands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_storeId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_storeId_fkey";

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "storeId",
ADD COLUMN     "store_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "storeId",
ADD COLUMN     "store_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
