"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function CartLink() {
  const items = useCart(state => state.items);
  const load = useCart(state => state.load);
  const ready = useCart(state => state.ready);
  useEffect(() => {
    void load();
    const refresh = () => { if (document.visibilityState === "visible") void load(true); };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [load]);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  return <Link href="/order" className="cart-link" aria-label={ready ? `Cart, ${count} items` : "Open saved cart"}><ShoppingBag size={20} /><span aria-hidden="true">{ready ? count : "–"}</span></Link>;
}

export function AddToCart({ productId, name, detail = false }: { productId: string; name: string; detail?: boolean }) {
  const change = useCart(state => state.change);
  const ready = useCart(state => state.ready);
  const saving = useCart(state => state.saving);
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timeout);
  }, [added]);
  return <button type="button" className={detail ? "button button-dark detail-order" : "add-to-cart"} disabled={!ready || saving || pending} aria-label={`Add ${name} to cart`} onClick={async () => { setPending(true); setAdded(await change({ action: "add", productId })); setPending(false); }}>{added ? <Check size={16} /> : <Plus size={16} />}<span aria-live="polite">{pending ? "Saving…" : added ? "Added to cart" : "Add to cart"}</span></button>;
}

export function CartNotice() {
  const error = useCart(state => state.error);
  const load = useCart(state => state.load);
  const loading = useCart(state => state.loading);
  if (!error) return null;
  return <div className="cart-notice" role="alert"><span>{error}</span><button type="button" disabled={loading} onClick={() => void load(true)}>{loading ? "Loading…" : "Refresh cart"}</button><Link href="/contact">Contact the team</Link></div>;
}
