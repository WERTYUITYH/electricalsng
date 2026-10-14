import { sellingPrices } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db } = await import("@/db");
    const prices = await db.select().from(sellingPrices);
    return Response.json(prices, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ error: "Current selling prices are temporarily unavailable. Please confirm with our team." }, { status: 503 });
  }
}
