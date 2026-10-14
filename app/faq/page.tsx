import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { FAQList, FinalCTA, WhatsAppButton } from "@/components/ui";

export const metadata: Metadata = { title: "Frequently asked questions", description: "Answers about ElectricalsNG product reference prices, availability, specifications, bulk procurement, after-sales support and WhatsApp enquiries." };

export default function FAQPage() {
  return <><PageHeading label="FAQ" eyebrow="A LITTLE CLARITY" title={<>Good questions.<br /><span>Straight answers.</span></>} description="Here’s what to know about our collection, pricing and the way we help you find the right products." /><div className="container faq-page-layout"><aside className="faq-sidebar"><h2>A specific question<br />about your project?</h2><p>Share the product, application or procurement requirement. Our team can help clarify the details that matter to you.</p><WhatsAppButton>Ask our team</WhatsAppButton></aside><FAQList /></div><FinalCTA /></>;
}
