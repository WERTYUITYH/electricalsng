import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Catalogue } from "@/components/catalogue";
import { Eyebrow, FinalCTA } from "@/components/ui";

export const metadata: Metadata = { title: "Product catalogue", description: "Browse the complete ElectricalsNG collection of lighting, chandeliers, wall lights, floor lamps and solar products. Explore sourced reference prices and request a quotation." };

export default function ProductsPage() {
  return <><section className="page-intro catalogue-intro"><div className="container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Products</span></div><div className="catalogue-title"><div><Eyebrow>THE ELECTRICALSNG COLLECTION</Eyebrow><h1>Find your<br /><span>right connection.</span></h1></div><p>Products for the spaces you live in.<br />Solutions for the projects you build.<br />Guidance to help you choose.</p></div></div></section><Suspense fallback={<div className="container loading-grid" aria-label="Loading catalogue" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <div className="product-skeleton" key={index} />)}</div>}><Catalogue /></Suspense><FinalCTA /></>;
}
