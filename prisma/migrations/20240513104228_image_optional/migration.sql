-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" SET DEFAULT '';

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "image" SET DEFAULT '';
