"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/products";
import { productCategories } from "@/lib/categories";
import { ProductCard } from "./product-card";
import { useSellingPrices } from "./featured-products";

const pageSize = 12;
const filterKeys = ["q", "category", "brand", "sort", "min", "max", "priced", "page"];

export function Catalogue() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const rawCategory = params.get("category") || "";
  const selectedCategory = productCategories.find(category => category.slug === rawCategory || category.label === rawCategory);
  const category = selectedCategory?.slug || "";
  const brand = ["Jinko", "Unconfirmed"].includes(params.get("brand") || "") ? params.get("brand")! : "";
  const sort = ["price-asc", "price-desc", "name"].includes(params.get("sort") || "") ? params.get("sort")! : "featured";
  const minimum = params.get("min") || "";
  const maximum = params.get("max") || "";
  const minimumPrice = minimum.trim() && Number.isFinite(Number(minimum)) ? Math.max(0, Number(minimum)) : null;
  const maximumPrice = maximum.trim() && Number.isFinite(Number(maximum)) ? Math.max(0, Number(maximum)) : null;
  const pricedOnly = params.get("priced") === "true";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsHeading = useRef<HTMLDivElement>(null);
  const catalogue = useSellingPrices(products);

  function update(key: string, value: string, replace = false) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    const url = `${window.location.pathname}${next.size ? `?${next}` : ""}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }

  const filtered = useMemo(() => {
    const result = catalogue.filter(product => {
      const price = product.sellingPrice ?? product.referencePrice;
      return (!selectedCategory || product.category === selectedCategory.label)
        && (!brand || (brand === "Unconfirmed" ? !product.brand : product.brand === brand))
        && `${product.name} ${product.brand || ""} ${product.model || ""} ${product.category} ${product.id}`.toLowerCase().includes(query.toLowerCase().trim())
        && (!pricedOnly || price !== null)
        && (minimumPrice === null || (price !== null && price >= minimumPrice))
        && (maximumPrice === null || (price !== null && price <= maximumPrice));
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
  }, [catalogue, selectedCategory, brand, query, pricedOnly, minimumPrice, maximumPrice, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requestedPage = Number(params.get("page") || 1);
  const page = Math.min(pageCount, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const start = (page - 1) * pageSize;
  const activeFilter = Boolean(category || brand || minimum || maximum || pricedOnly || query || sort !== "featured");

  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    if (rawCategory && rawCategory !== category) {
      if (category) next.set("category", category); else next.delete("category");
    }
    if (params.has("page")) {
      if (page === 1) next.delete("page"); else next.set("page", String(page));
    }
    if (next.toString() !== params.toString()) window.history.replaceState(null, "", `${window.location.pathname}${next.size ? `?${next}` : ""}`);
  }, [params, rawCategory, category, page]);

  function reset() {
    const next = new URLSearchParams(window.location.search);
    filterKeys.forEach(key => next.delete(key));
    window.history.pushState(null, "", `${window.location.pathname}${next.size ? `?${next}` : ""}`);
  }

  function changePage(nextPage: number) {
    update("page", nextPage === 1 ? "" : String(nextPage));
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return <div className="container catalogue-wrap">
    <div className="catalogue-search"><Search size={22} /><input aria-label="Search the product catalogue" value={query} onChange={event => update("q", event.target.value, true)} autoFocus={params.get("search") === "true"} placeholder="Search products, brands or product codes…" />{query && <button onClick={() => update("q", "", true)} aria-label="Clear search"><X size={19} /></button>}<span>{products.length} products in the collection</span></div>
    <div className="catalogue-mobile-tools"><button onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="catalogue-filters"><SlidersHorizontal size={17} />{filtersOpen ? "Hide filters" : "Filter products"}</button><span aria-live="polite">{filtered.length} products</span></div>
    <div className="catalogue-layout">
      <aside id="catalogue-filters" className={`catalogue-sidebar ${filtersOpen ? "filters-open" : ""}`}>
        <div className="filter-heading"><h2>Refine your selection</h2><SlidersHorizontal size={17} /></div>
        <fieldset className="filter-group"><legend>Collections</legend>{[{ slug: "", label: "All products" }, ...productCategories].map(item => <label className={`category-filter ${category === item.slug ? "filter-selected" : ""}`} key={item.slug}><input type="radio" name="category" checked={category === item.slug} onChange={() => update("category", item.slug)} /><span>{item.label}</span><span>{item.slug ? products.filter(product => product.category === item.label).length : products.length}</span></label>)}</fieldset>
        <fieldset className="filter-group"><legend>Brand</legend><select aria-label="Filter by brand" value={brand} onChange={event => update("brand", event.target.value)}><option value="">All brands</option><option>Jinko</option><option value="Unconfirmed">Brand unconfirmed</option></select></fieldset>
        <fieldset className="filter-group"><legend>Price range <span>NGN</span></legend><div className="price-filter-inputs"><label><span>Minimum</span><input type="number" min="0" step="1000" placeholder="₦ Min" value={minimum} onChange={event => update("min", event.target.value, true)} /></label><span>–</span><label><span>Maximum</span><input type="number" min="0" step="1000" placeholder="₦ Max" value={maximum} onChange={event => update("max", event.target.value, true)} /></label></div>{minimumPrice !== null && maximumPrice !== null && minimumPrice > maximumPrice && <p className="field-error">Minimum exceeds maximum.</p>}<label className="checkbox-label"><input type="checkbox" checked={pricedOnly} onChange={event => update("priced", event.target.checked ? "true" : "")} />Only products with a listed price</label><p className="filter-note">Uses selling prices where set, otherwise indicative references. References are not business quotations.</p></fieldset>
        {activeFilter && <button className="reset-filters" onClick={reset}>Clear all filters <X size={14} /></button>}
        <div className="sidebar-help"><h3>Need product guidance?</h3><Link href="/contact" className="text-link">Talk to our team <ArrowUpRight size={16} /></Link></div>
      </aside>
      <div className="catalogue-results">
        <div className="results-toolbar" ref={resultsHeading} tabIndex={-1}><p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}{selectedCategory ? ` in ${selectedCategory.label.toLowerCase()}` : " in the collection"}</p><label>Sort by<select value={sort} onChange={event => update("sort", event.target.value === "featured" ? "" : event.target.value)}><option value="featured">Collection order</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
        {activeFilter && <div className="active-filter-row"><span>Filtered selection</span><button onClick={reset}>Reset <X size={12} /></button></div>}
        {filtered.length ? <><div className="product-grid catalogue-grid">{filtered.slice(start, start + pageSize).map(product => <ProductCard product={product} key={product.id} />)}</div><div className="catalogue-pagination"><p aria-live="polite">Showing {start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length} products</p><nav aria-label="Catalogue pagination"><button aria-label="Previous page" disabled={page === 1} onClick={() => changePage(page - 1)}><ChevronLeft size={17} /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map(pageNumber => <button key={pageNumber} aria-label={`Page ${pageNumber}`} aria-current={pageNumber === page ? "page" : undefined} onClick={() => changePage(pageNumber)}>{pageNumber}</button>)}<button aria-label="Next page" disabled={page === pageCount} onClick={() => changePage(page + 1)}><ChevronRight size={17} /></button></nav></div></> : <div className="empty-state"><Search size={36} strokeWidth={1} /><h2>No matching products.</h2><p>Try a different search or adjust your filters.</p><button className="button button-dark" onClick={reset}>Reset filters <ArrowUpRight size={17} /></button></div>}
        <p className="price-disclaimer catalogue-disclaimer">Reference prices are researched third-party comparisons, not confirmed ElectricalsNG quotations. Exact specifications and availability require confirmation. Prices researched 14 October 2026.</p>
      </div>
    </div>
  </div>;
}
