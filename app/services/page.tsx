import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Boxes, Compass, Headphones, PackageSearch } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { FinalCTA } from "@/components/ui";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Our services", description: "Electrical product procurement, distribution, engineering consultancy, product selection and after-sales support from ElectricalsNG." };

const services = [
  { title: "Product sales & distribution", icon: Boxes, description: "Electrical and electronic products for homes, commercial projects and professional applications. Browse the collection, discuss quantities and confirm specifications and availability with our team.", message: "Hello ElectricalsNG, I would like to enquire about electrical product sales and distribution for my requirements." },
  { title: "Electrical product procurement", icon: PackageSearch, description: "Support for buyers sourcing electrical products and equipment. Share your product list, quantities, specifications and project context so the team can prepare an appropriate quotation.", message: "Hello ElectricalsNG, I have a bulk procurement enquiry. I would like to share my product list, quantities and specifications." },
  { title: "Electrical engineering consultancy", icon: Compass, description: "Discuss your electrical engineering requirements with our team. We can clarify the scope of your enquiry and discuss the relevant consultancy support. Scope, professional requirements and any fees are confirmed separately.", message: "Hello ElectricalsNG, I would like to discuss electrical engineering consultancy for my project. Please advise on your process and scope." },
  { title: "Product guidance & after-sales support", icon: Headphones, description: "Choosing an appropriate product starts with understanding its use. Tell us about your application, or contact us after purchase with the product details and the issue you need help with.", message: "Hello ElectricalsNG, I would like product selection guidance or after-sales support. I can share my product details and requirements." },
];

export default function ServicesPage() {
  return <><PageHeading label="Services" eyebrow="EXPERTISE, CONNECTED" title={<>The right support.<br /><span>At every stage.</span></>} description="From choosing an individual product to sourcing a complete project list, we connect product supply with practical expertise." /><div className="container service-detail-list">{services.map((service, index) => <section className="service-detail" key={service.title}><span className="service-index">0{index + 1}</span><div><service.icon size={30} strokeWidth={1.4} /><h2>{service.title}</h2></div><div><p>{service.description}</p><a className="text-link" href={whatsappLink(service.message)} target="_blank" rel="noopener noreferrer">Discuss your requirements <ArrowUpRight size={17} /></a>{index === 1 && <div><Link className="text-link" href="/procurement">Or submit a quotation request <ArrowUpRight size={17} /></Link></div>}</div></section>)}</div><FinalCTA /></>;
}
