import Link from "next/link";
import { ArrowUpRight, MessageCircle, Zap } from "lucide-react";
import { faqs, whatsappLink } from "@/lib/site";

export function Wordmark({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`wordmark ${light ? "wordmark-light" : ""}`} aria-label="ElectricalsNG home"><span className="brand-symbol"><Zap size={24} fill="currentColor" strokeWidth={1.4} /></span><span>electricals<span className="brand-ng">NG</span><span className="brand-dot">.</span></span></Link>;
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span />{children}</div>;
}

export function WhatsAppButton({ children = "Talk to our team", message, className = "button button-dark" }: { children?: React.ReactNode; message?: string; className?: string }) {
  return <a href={whatsappLink(message)} className={className} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />{children}<ArrowUpRight size={17} /></a>;
}

export function FinalCTA() {
  return <section className="final-cta"><div className="container final-cta-inner"><div><Eyebrow light>LET’S MAKE THE RIGHT CONNECTION</Eyebrow><h2>Your next project.<br /><span>Our full attention.</span></h2></div><div className="final-cta-actions"><WhatsAppButton className="button button-amber">Talk to our team</WhatsAppButton><Link href="/products" className="text-link light-link">Explore the catalogue <ArrowUpRight size={17} /></Link><p>Real people. Practical guidance. The right products.</p></div></div></section>;
}

export function FAQList({ limit }: { limit?: number }) {
  return <div className="faq-list">{faqs.slice(0, limit).map((faq, index) => <details key={faq.question}><summary><span className="faq-number">0{index + 1}</span>{faq.question}<span className="faq-plus">+</span></summary><p>{faq.answer}</p></details>)}</div>;
}
