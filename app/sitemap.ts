import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/products", "/order", "/about", "/services", "/procurement", "/contact", "/faq", "/policies", "/privacy", ...products.map(product => `/products/${product.slug}`)].map(path => ({ url: `${site.url}${path}`, changeFrequency: path.startsWith("/products") ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.6 }));
}
