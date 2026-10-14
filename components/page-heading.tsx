import Link from "next/link";
import { Eyebrow } from "./ui";

export function PageHeading({ label, eyebrow, title, description }: { label: string; eyebrow: string; title: React.ReactNode; description?: string }) {
  return <section className="editorial-intro"><div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{label}</span></nav><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{description && <p>{description}</p>}</div></section>;
}
