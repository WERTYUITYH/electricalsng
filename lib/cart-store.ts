"use client";

import { create } from "zustand";
import type { OrderLine } from "./order";

type CartAction = { action: "add" | "remove" | "quantity" | "clear"; productId?: string; quantity?: number };
type CartState = {
  items: OrderLine[];
  revision: number;
  ready: boolean;
  loading: boolean;
  saving: boolean;
  error: string;
  load: (refresh?: boolean) => Promise<void>;
  change: (action: CartAction) => Promise<boolean>;
};

let loading: Promise<void> | null = null;
let changes: Promise<unknown> = Promise.resolve();

export const useCart = create<CartState>((set, get) => ({
  items: [], revision: 0, ready: false, loading: false, saving: false, error: "",
  load: async (refresh = false) => {
    if (loading) return loading;
    if (get().saving || (get().ready && !refresh)) return;
    set({ loading: true, error: "" });
    loading = (async () => {
      try {
        const response = await fetch("/api/cart", { cache: "no-store", credentials: "same-origin" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Saved cart unavailable.");
        set({ items: data.items, revision: data.revision, ready: true });
      } catch {
        set({ error: "Your saved cart could not be loaded. Retry to restore it safely.", ready: false });
      } finally {
        set({ loading: false });
      }
    })();
    try { await loading; } finally { loading = null; }
  },
  change: action => {
    const operation = changes.then(async () => {
      await get().load();
      if (!get().ready) return false;
      set({ saving: true, error: "" });
      try {
        for (let attempt = 0; attempt < 2; attempt += 1) {
          const response = await fetch("/api/cart", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...action, revision: get().revision }) });
          const data = await response.json();
          if (response.status === 409) {
            set({ items: data.items, revision: data.revision });
            continue;
          }
          if (!response.ok) throw new Error(data.error || "Your cart change could not be confirmed.");
          set({ items: data.items, revision: data.revision });
          return true;
        }
        throw new Error("Your cart changed in another tab. Review the latest items and try again.");
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Your cart change could not be confirmed. Refresh the cart before retrying." });
        return false;
      } finally {
        set({ saving: false });
      }
    });
    changes = operation.catch(() => {});
    return operation;
  },
}));
