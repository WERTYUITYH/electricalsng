import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const sellingPrices = pgTable("selling_prices", {
  productId: text("product_id").primaryKey(),
  priceNgn: integer("price_ngn").notNull(),
  availability: text("availability").notNull().default("Confirm availability"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
