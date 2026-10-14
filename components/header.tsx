"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Search, X, Phone } from "lucide-react";
import { Wordmark } from "./ui";
import { site, whatsappLink } from "@/lib/site";

const navigation = [{ href: "/", label: "Home" }, { href: "/products", label: "Products" }, { href: "/services", label: "Services" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }, { href: "/order", label: "Order" }];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <><div className="topbar"><div className="container topbar-inner"><span><span className="status-dot" /> Your connection to the right electrical solutions.</span><a href={`tel:${site.internationalPhone}`}><Phone size={12} /> {site.phone}<span className="topbar-divider">|</span><span>Product guidance. Human support.</span></a></div></div><header className="header"><div className="container header-inner"><Wordmark /><nav aria-label="Main navigation" className="desktop-nav">{navigation.map(item => <Link className={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "active" : ""} key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><Link className="search-button" href="/products?search=true" aria-label="Search products"><Search size={20} /></Link><a className="header-enquiry" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Let’s talk power <ArrowUpRight size={17} /></a><button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button></div></div>{open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}<ArrowUpRight size={18} /></Link>)}<Link href="/procurement">Request a quotation<ArrowUpRight size={18} /></Link></nav>}</header></>;
}
