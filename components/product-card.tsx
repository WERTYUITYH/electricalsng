import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { productEnquiry } from "@/lib/enquiry";

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><Link className="product-image" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 600px) 46vw, (max-width: 1000px) 32vw, 25vw" /><span className="product-view"><ArrowUpRight size={19} /></span>{product.brand && <span className="product-brand-badge">{product.brand}</span>}</Link><div className="product-meta"><span>{product.category}</span><span>{product.id}</span></div><Link className="product-title" href={`/products/${product.slug}`}><h3>{product.name}</h3></Link><div className="product-price"><strong>{formatPrice(product)}</strong><span>{product.sellingPrice !== undefined ? "ElectricalsNG selling price" : product.referencePrice ? "Indicative reference" : "Confirm price & availability"}</span></div><div className="product-actions"><Link href={`/order?product=${product.id}`} aria-label={`Start an order request for ${product.name}`}>Order request <ArrowUpRight size={14} /></Link><a href={productEnquiry(product)} target="_blank" rel="noopener noreferrer" aria-label={`Enquire about ${product.name} on WhatsApp`}><MessageCircle size={16} /><span>Enquire</span></a></div></article>;
}
