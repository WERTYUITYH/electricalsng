"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { categories, products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { useSellingPrices } from "./featured-products";

export function Catalogue() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "All products");
  const [brand, setBrand] = useState("All brands");
  const [sort, setSort] = useState("featured");
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [pricedOnly, setPricedOnly] = useState(false);
  const [limit, setLimit] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const catalogue = useSellingPrices(products);
  useEffect(() => { setCategory(params.get("category") || "All products"); setQuery(params.get("q") || ""); }, [params]);
  useEffect(() => { setLimit(12); }, [query, category, brand, sort, minimum, maximum, pricedOnly]);
  const filtered = useMemo(() => {
    const result = catalogue.filter(product => {
      const price = product.sellingPrice ?? product.referencePrice;
      return (category === "All products" || product.category === category) && (brand === "All brands" || (brand === "Unconfirmed" ? !product.brand : product.brand === brand)) && `${product.name} ${product.brand || ""} ${product.model || ""} ${product.category} ${product.id}`.toLowerCase().includes(query.toLowerCase().trim()) && (!pricedOnly || price !== null) && (!minimum || (price !== null && price >= Number(minimum))) && (!maximum || (price !== null && price <= Number(maximum)));
    });
    if (sort === "price-asc" || sort === "price-desc") result.sort((first, second) => {
      const firstPrice = first.sellingPrice ?? first.referencePrice;
      const secondPrice = second.sellingPrice ?? second.referencePrice;
      if (firstPrice === null) return secondPrice === null ? 0 : 1;
      if (secondPrice === null) return -1;
      return sort === "price-asc" ? firstPrice - secondPrice : secondPrice - firstPrice;
    });
    if (sort === "name") result.sort((first, second) => first.name.localeCompare(second.name));
    return result;
  }, [catalogue, query, category, brand, minimum, maximum, pricedOnly, sort]);
  const reset = () => { setQuery(""); setCategory("All products"); setBrand("All brands"); setMinimum(""); setMaximum(""); setPricedOnly(false); setSort("featured"); };
  const activeFilter = category !== "All products" || brand !== "All brands" || minimum || maximum || pricedOnly || query;
  return <div className="container catalogue-wrap"><div className="catalogue-search"><Search size={22} /><input aria-label="Search the product catalogue" value={query} onChange={event => setQuery(event.target.value)} autoFocus={params.get("search") === "true"} placeholder="Search products, brands or product codes…" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={19} /></button>}<span>{products.length} products, thoughtfully selected</span></div><div className="catalogue-mobile-tools"><button onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="catalogue-filters"><SlidersHorizontal size={17} />{filtersOpen ? "Hide filters" : "Filter products"}</button><span aria-live="polite">{filtered.length} products</span></div><div className="catalogue-layout"><aside id="catalogue-filters" className={`catalogue-sidebar ${filtersOpen ? "filters-open" : ""}`}><div className="filter-heading"><h2>Refine your selection</h2><SlidersHorizontal size={17} /></div><fieldset className="filter-group"><legend>Collections</legend>{["All products", ...categories].map(item => <label className={`category-filter ${category === item ? "filter-selected" : ""}`} key={item}><input type="radio" name="category" checked={category === item} onChange={() => setCategory(item)} /><span>{item}</span><span>{item === "All products" ? products.length : products.filter(product => product.category === item).length}</span></label>)}</fieldset><fieldset className="filter-group"><legend>Brand</legend><select aria-label="Filter by brand" value={brand} onChange={event => setBrand(event.target.value)}><option>All brands</option><option>Jinko</option><option value="Unconfirmed">Brand unconfirmed</option></select></fieldset><fieldset className="filter-group"><legend>Price range <span>NGN</span></legend><div className="price-filter-inputs"><label><span>Minimum</span><input type="number" min="0" step="1000" placeholder="₦ Min" value={minimum} onChange={event => setMinimum(event.target.value)} /></label><span>–</span><label><span>Maximum</span><input type="number" min="0" step="1000" placeholder="₦ Max" value={maximum} onChange={event => setMaximum(event.target.value)} /></label></div>{minimum && maximum && Number(minimum) > Number(maximum) && <p className="field-error">Minimum exceeds maximum.</p>}<label className="checkbox-label"><input type="checkbox" checked={pricedOnly} onChange={event => setPricedOnly(event.target.checked)} />Only products with a listed price</label><p className="filter-note">Filters use selling prices where set, otherwise researched reference prices. Unpriced items remain visible unless a price filter is applied.</p></fieldset>{activeFilter && <button className="reset-filters" onClick={reset}>Clear all filters <X size={14} /></button>}<div className="sidebar-help"><span className="small-label">A LITTLE EXPERTISE HELPS</span><h3>Not sure what<br />you need?</h3><p>Tell us about your space or project. We’ll help you find the right fit.</p><Link href="/contact" className="text-link">Talk to our team <ArrowUpRight size={16} /></Link></div></aside><div className="catalogue-results"><div className="results-toolbar"><p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}{category !== "All products" ? ` in ${category.toLowerCase()}` : " in the collection"}</p><label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Collection order</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>{activeFilter && <div className="active-filter-row"><span>Filtered selection</span><button onClick={reset}>Reset <X size={12} /></button></div>}{filtered.length ? <><div className="product-grid catalogue-grid">{filtered.slice(0, limit).map(product => <ProductCard product={product} key={product.id} />)}</div><div className="load-more"><p>Showing {Math.min(limit, filtered.length)} of {filtered.length} products</p>{limit < filtered.length && <button className="button button-dark" onClick={() => setLimit(value => value + 12)}>Show more products <ArrowDown size={17} /></button>}</div></> : <div className="empty-state"><Search size={36} strokeWidth={1} /><h2>No connections just yet.</h2><p>Try a different search or adjust your filters. Our team can also help source products for your project.</p><button className="button button-dark" onClick={reset}>Reset filters <ArrowUpRight size={17} /></button></div>}<p className="price-disclaimer catalogue-disclaimer">Reference prices are researched third-party comparisons, not confirmed ElectricalsNG quotations. Exact specifications and availability require confirmation. Prices researched 14 October 2026.</p></div></div></div>;
}
