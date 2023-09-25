-- DropIndex
DROP INDEX "Orders_user_id_key";

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;
