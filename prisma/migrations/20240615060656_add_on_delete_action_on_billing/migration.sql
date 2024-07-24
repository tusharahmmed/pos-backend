-- DropForeignKey
ALTER TABLE "billing_products" DROP CONSTRAINT "billing_products_product_id_fkey";

-- AddForeignKey
ALTER TABLE "billing_products" ADD CONSTRAINT "billing_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
