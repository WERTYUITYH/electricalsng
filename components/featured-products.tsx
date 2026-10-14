"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./product-card";

export type PriceOverride = { productId: string; priceNgn: number; availability: string };

export function applyPrices<Item extends Pick<Product, "id" | "sellingPrice" | "availability">>(items: Item[], overrides: PriceOverride[]) {
  return items.map(product => {
    const override = overrides.find(price => price.productId === product.id);
    return override && Number.isFinite(override.priceNgn) && override.priceNgn >= 0 ? { ...product, sellingPrice: override.priceNgn, availability: override.availability } : product;
  });
}

export function useSellingPrices<Item extends Pick<Product, "id" | "sellingPrice" | "availability">>(initial: Item[]) {
  const [overrides, setOverrides] = useState<PriceOverride[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/prices", { signal: controller.signal }).then(response => response.ok ? response.json() : null).then(data => { if (Array.isArray(data)) setOverrides(data); }).catch(() => {});
    return () => controller.abort();
  }, []);
  return applyPrices(initial, overrides);
}

export function FeaturedProducts({ initialProducts }: { initialProducts: Product[] }) {
  const featured = useSellingPrices(initialProducts);
  return <div className="product-grid featured-grid">{featured.map(product => <ProductCard product={product} key={product.id} />)}</div>;
}
