import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import type { OrderLine } from "@/lib/order";

export const sellingPrices = pgTable("selling_prices", {
  productId: text("product_id").primaryKey(),
  priceNgn: integer("price_ngn").notNull(),
  availability: text("availability").notNull().default("Confirm availability"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const carts = pgTable("carts", {
  tokenHash: text("token_hash").primaryKey(),
  items: jsonb("items").$type<OrderLine[]>().notNull().default([]),
  revision: integer("revision").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
