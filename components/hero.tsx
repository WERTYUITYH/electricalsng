"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Pause, Play } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/products";

export function Hero({ slides }: { slides: Product[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => setActive(value => (value + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [paused, reduceMotion]);
  return <section className="hero" aria-label="ElectricalsNG product showcase"><div className="hero-photo"><AnimatePresence initial={false} mode="sync"><motion.div className="hero-photo-slide" key={active} initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.045 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 1.3 }}><Image src={slides[active].image} alt={slides[active].name} fill sizes="(max-width: 700px) 100vw, 60vw" priority={active === 0} className="hero-product-photo" /></motion.div></AnimatePresence></div><div className="hero-shade" /><div className="hero-grid-lines" aria-hidden="true" /><div className="container hero-inner"><motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}><div className="hero-eyebrow"><span />THE RIGHT CONNECTION STARTS HERE</div><h1>Powering projects<br />with the <span>right<br className="desktop-break" /> electrical</span> solutions<span className="hero-period">.</span></h1><p>Discover electrical and electronic products for homes, commercial projects, and professional applications, backed by procurement support and after-sales guidance.</p><div className="hero-actions"><Link className="button button-amber" href="/products">Explore products <ArrowUpRight size={19} /></Link><a className="button button-outline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Talk to our team <ArrowUpRight size={18} /></a></div><div className="hero-reassurance"><span><Check size={14} />Product selection guidance</span><span><Check size={14} />After-sales support</span></div></motion.div><div className="showcase-caption"><span className="showcase-index">0{active + 1}<span> / 03</span></span><div><span className="showcase-label">FROM THE ELECTRICALSNG COLLECTION</span><Link href={`/products/${slides[active].slug}`}>{slides[active].name}<ArrowUpRight size={16} /></Link></div><button className="showcase-pause" onClick={() => setPaused(!paused)} aria-label={paused ? "Play product slideshow" : "Pause product slideshow"}>{paused || reduceMotion ? <Play size={15} /> : <Pause size={15} />}</button></div><div className="hero-pagination" aria-label="Choose featured product">{slides.map((slide, index) => <button key={slide.id} onClick={() => setActive(index)} className={active === index ? "selected" : ""} aria-label={`Show ${slide.name}`} aria-pressed={active === index} />)}</div></div><div className="hero-bottom"><div className="container hero-bottom-inner"><span className="hero-bottom-title">POWER FOR EVERY POSSIBILITY</span><Link href="/products?category=Chandeliers">Thoughtful lighting <ArrowRight size={15} /></Link><Link href="/products?category=Solar+%26+energy">Smarter energy <ArrowRight size={15} /></Link><Link href="/procurement">Professional procurement <ArrowRight size={15} /></Link></div></div></section>;
}
