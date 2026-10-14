import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui";

export default function NotFound() {
  return <section className="container error-page"><Eyebrow>404 / A MISSED CONNECTION</Eyebrow><h1>Let’s get you<br /><span>back on track.</span></h1><p>This page isn’t in our collection. Find the product you need or contact our team for help.</p><Link href="/products" className="button button-dark">Explore the collection<ArrowUpRight size={18} /></Link></section>;
}
