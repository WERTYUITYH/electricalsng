import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { EnquiryForm } from "@/components/enquiry-form";
import { Eyebrow, WhatsAppButton } from "@/components/ui";

export const metadata: Metadata = { title: "Procurement & quotations", description: "Request a project quotation for electrical supplies. ElectricalsNG supports contractors, developers, maintenance teams and corporate procurement buyers." };

export default function ProcurementPage() {
  return <><PageHeading label="Procurement" eyebrow="FOR THE PEOPLE WHO BUILD" title={<>A project to deliver.<br /><span>A partner in sourcing.</span></>} description="Tell us what your project needs. Our team supports electrical product procurement for contractors, developers, maintenance teams and corporate buyers." /><div className="container form-layout"><aside className="form-sidebar"><Eyebrow>FROM LIST TO QUOTATION</Eyebrow><h2>Let’s start with<br />your requirements.</h2><p>Give us as much detail as you have. A product code, preferred model or technical specification helps us understand the right options for your project.</p><ol className="form-steps"><li><span>01</span>Share product descriptions, quantities and any required technical specifications.</li><li><span>02</span>The team clarifies your requirements and checks appropriate product options and availability.</li><li><span>03</span>Discuss your quotation, exact variants, current pricing and fulfilment arrangements.</li></ol><p>Submitting an enquiry does not place an order or guarantee stock, pricing or a delivery date.</p><div className="mt-6"><WhatsAppButton message="Hello ElectricalsNG, I have a bulk procurement enquiry. I would like to share my product list, quantities and project requirements.">Discuss bulk procurement</WhatsAppButton></div></aside><EnquiryForm procurement /></div></>;
}
