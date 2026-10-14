import { readFile } from "node:fs/promises";
import { getDatabase } from "@netlify/database";

async function updatePrice() {
  const [productId, priceInput, availability = "Confirm availability"] = process.argv.slice(2);
  if (!productId || !priceInput) {
    throw new Error('Usage: npm run price:update -- ENG-ID WHOLE_NGN_PRICE "Confirmed availability text". Use --remove instead of a price to return to reference pricing.');
  }
  if (!/^ENG-\d+$/.test(productId)) throw new Error("Use a valid ElectricalsNG product ID.");
  const catalogue = await readFile(new URL("../lib/products.ts", import.meta.url), "utf8");
  if (!catalogue.includes(`"id": "${productId}"`)) throw new Error("Product ID is not in the catalogue.");
  if (!process.env.NETLIFY_DB_URL) throw new Error("Run in a trusted environment with the site's managed database write connection configured. Never expose this connection to the browser.");
  const database = getDatabase();
  if (priceInput === "--remove") {
    await database.sql`DELETE FROM selling_prices WHERE product_id = ${productId}`;
    console.log(`Removed selling-price override for ${productId}. Reference pricing remains unchanged.`);
    return;
  }
  const priceNgn = Number(priceInput);
  if (!/^\d+$/.test(priceInput) || !Number.isSafeInteger(priceNgn) || priceNgn < 0 || priceNgn > 2147483647) throw new Error("Price must be a non-negative whole NGN amount within the database integer limit.");
  if (availability.length > 200) throw new Error("Availability text must be 200 characters or fewer.");
  await database.sql`INSERT INTO selling_prices (product_id, price_ngn, availability, updated_at) VALUES (${productId}, ${priceNgn}, ${availability}, now()) ON CONFLICT (product_id) DO UPDATE SET price_ngn = excluded.price_ngn, availability = excluded.availability, updated_at = now()`;
  console.log(`Saved confirmed selling price for ${productId}. Allow up to three minutes for cached storefront prices to refresh.`);
}

updatePrice().catch(() => {
  console.error("Price update did not complete. Check the command, product ID, whole-NGN price and trusted database write access. No connection details are logged.");
  process.exitCode = 1;
});
