import { createHash, randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { carts } from "@/db/schema";
import { products } from "@/lib/products";
import type { OrderLine } from "@/lib/order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cookieName = process.env.NODE_ENV === "production" ? "__Host-electricalsng-cart" : "electricalsng-cart";
const lifetime = 60 * 60 * 24 * 30;
const headers = { "Cache-Control": "private, no-store", "Vary": "Cookie" };

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/db");
    const existingToken = request.cookies.get(cookieName)?.value;
    const token = existingToken && /^[a-f0-9]{64}$/.test(existingToken) ? existingToken : randomBytes(32).toString("hex");
    const hash = tokenHash(token);
    const [existing] = await db.select().from(carts).where(eq(carts.tokenHash, hash)).limit(1);
    const expiresAt = new Date(Date.now() + lifetime * 1000);
    let items: OrderLine[] = [];
    let revision = 0;
    if (existing && existing.expiresAt > new Date()) {
      items = existing.items;
      revision = existing.revision;
      await db.update(carts).set({ expiresAt }).where(eq(carts.tokenHash, hash));
    } else {
      const [cart] = await db.insert(carts).values({ tokenHash: hash, expiresAt }).onConflictDoUpdate({ target: carts.tokenHash, set: { items: [], revision: 0, expiresAt } }).returning();
      items = cart.items;
      revision = cart.revision;
    }
    const response = NextResponse.json({ items, revision }, { headers });
    response.cookies.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: lifetime });
    return response;
  } catch {
    return NextResponse.json({ error: "Saved carts are temporarily unavailable. Please retry; the product catalogue remains available." }, { status: 503, headers });
  }
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Please update your cart from this website." }, { status: 403, headers });
  }
  const token = request.cookies.get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "Reload your saved cart before making changes." }, { status: 401, headers });
  if (!request.headers.get("content-type")?.startsWith("application/json") || Number(request.headers.get("content-length")) > 2000) return NextResponse.json({ error: "Invalid cart request." }, { status: 400, headers });
  let payload: { action?: unknown; productId?: unknown; quantity?: unknown; revision?: unknown };
  try {
    const body = await request.text();
    if (body.length > 2000) throw new Error("Payload too large");
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid payload");
    payload = parsed;
  } catch {
    return NextResponse.json({ error: "Invalid cart request." }, { status: 400, headers });
  }
  const { action, productId, quantity, revision } = payload;
  if (!["add", "remove", "quantity", "clear"].includes(String(action)) || !Number.isSafeInteger(revision) || Number(revision) < 0
    || (action !== "clear" && (typeof productId !== "string" || !products.some(product => product.id === productId)))
    || (action === "quantity" && (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 999))) {
    return NextResponse.json({ error: "Choose a valid product and a whole-number quantity from 1 to 999." }, { status: 400, headers });
  }
  try {
    const { db } = await import("@/db");
    const hash = tokenHash(token);
    const [cart] = await db.select().from(carts).where(eq(carts.tokenHash, hash)).limit(1);
    if (!cart || cart.expiresAt <= new Date()) return NextResponse.json({ error: "Your saved cart has expired. Reload it to start again." }, { status: 401, headers });
    if (cart.revision !== revision) return NextResponse.json({ items: cart.items, revision: cart.revision }, { status: 409, headers });
    let items = cart.items;
    const existing = items.find(item => item.productId === productId);
    if (action === "clear") items = [];
    if (action === "remove") items = items.filter(item => item.productId !== productId);
    if (action === "quantity") items = items.map(item => item.productId === productId ? { ...item, quantity: quantity as number } : item);
    if (action === "add") {
      if ((!existing && items.length >= 20) || (existing && existing.quantity >= 999)) return NextResponse.json({ error: "A cart supports up to 20 different products and 999 units per product." }, { status: 400, headers });
      items = existing ? items.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { productId: productId as string, quantity: 1 }];
    }
    const [updated] = await db.update(carts).set({ items, revision: cart.revision + 1, expiresAt: new Date(Date.now() + lifetime * 1000) }).where(and(eq(carts.tokenHash, hash), eq(carts.revision, cart.revision))).returning();
    if (!updated) {
      const [latest] = await db.select().from(carts).where(eq(carts.tokenHash, hash)).limit(1);
      return NextResponse.json({ items: latest?.items ?? [], revision: latest?.revision ?? 0 }, { status: 409, headers });
    }
    return NextResponse.json({ items: updated.items, revision: updated.revision }, { headers });
  } catch {
    return NextResponse.json({ error: "Your cart change could not be confirmed. Refresh the cart before retrying." }, { status: 503, headers });
  }
}
