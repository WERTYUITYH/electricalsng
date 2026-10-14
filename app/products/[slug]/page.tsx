import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";
import { FeaturedProducts } from "@/components/featured-products";
import { Eyebrow, FinalCTA } from "@/components/ui";

export function generateStaticParams() { return products.map(product => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(item => item.slug === slug);
  return product ? { title: product.name, description: `${product.name} at ElectricalsNG. View product details, reference pricing and enquire about current selling price and availability.`, alternates: { canonical: `/products/${product.slug}` } } : { title: "Product not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(item => item.slug === slug);
  if (!product) notFound();
  const related = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4);
  return <><div className="container detail-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{product.name}</span></nav><ProductDetail initialProduct={product} />{related.length > 0 && <section className="related-products"><div className="section-heading compact-heading"><div><Eyebrow>KEEP EXPLORING</Eyebrow><h2>Good company.</h2></div><Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-link">More {product.category.toLowerCase()} ↗</Link></div><FeaturedProducts initialProducts={related} /></section>}</div><FinalCTA /></>;
}
