import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Wordmark } from "./ui";
import { site } from "@/lib/site";

export function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><Wordmark light /><p>The right products.<br />The right guidance.<br />Power for what’s next.</p></div><div><h3>Explore</h3><Link href="/products">All products</Link><Link href="/about">About ElectricalsNG</Link><Link href="/services">Our services</Link><Link href="/procurement">Procurement</Link></div><div><h3>Here to help</h3><Link href="/contact">Contact our team</Link><Link href="/faq">Frequently asked questions</Link><Link href="/policies">Pricing & order information</Link><Link href="/privacy">Privacy policy</Link></div><div className="footer-contact"><h3>Let’s make a connection</h3><a href={`mailto:${site.email}`}><Mail size={15} />{site.email}</a><a href={`tel:${site.internationalPhone}`}><Phone size={15} />{site.phone}</a><span className="social-identity">Find us as Marriot Electrics</span>{Object.entries(site.socials).filter(([, url]) => /^https:\/\//.test(url)).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="social-link">{name}<ArrowUpRight size={14} /></a>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ElectricalsNG. All rights reserved.</span><span>Electrical products. Considered solutions.</span><a href="#top">Back to top ↑</a></div></div></footer>;
}
