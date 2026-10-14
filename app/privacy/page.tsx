import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy notice", description: "How this ElectricalsNG website handles enquiry information and links to third-party services." };

export default function PrivacyPage() {
  return <>
    <PageHeading label="Privacy notice" eyebrow="YOUR ENQUIRY, HANDLED WITH CARE" title={<>A considered approach.<br /><span>Including your details.</span></>} />
    <article className="container policy-content">
      <p>Website notice updated 14 October 2026.</p>
      <h2>Information you choose to share</h2><p>Our contact and procurement forms collect your name, email address, company where provided, optional phone number, optional project location and the requirements you enter. Our order request form collects your name, phone number, selected products, quantities, fulfilment preference and request reference. You can also provide an email address, company and order notes. If you request delivery, the form asks for a delivery address, city and state or region. Please do not include payment card information, banking credentials, passwords or sensitive documents.</p>
      <h2>How enquiry & order information is used</h2><p>Your details are used to respond to your request, clarify product or project requirements, discuss a quotation and arrange an order or support request directly with you. Submitting order information does not initiate a payment. This website does not include a marketing subscription or payment collection feature.</p>
      <h2>Services used by this website</h2><p>The website is hosted on Netlify, and submitted contact, procurement and order request forms are processed through Netlify Forms. Product price information may be stored using Netlify Database. The website’s fonts and supplied product images are hosted with the site, rather than fetched from third-party image or font hosts during a visit. The hosting provider may process technical request information needed to deliver its services.</p>
      <h2>Order drafts & WhatsApp handover</h2><p>Order drafts remain in the current page and are not saved until submitted. Leaving or reloading the page before submission can discard the draft. After submission, the WhatsApp handover message includes your request reference, name, product list, quantities, fulfilment preference and delivery city where provided. It does not include your full delivery address, email or private order notes. Review the prepared message before sending it.</p>
      <h2>WhatsApp & external links</h2><p>Opening a WhatsApp link takes you to an external service. The message is not sent until you choose to send it. WhatsApp and linked retailer websites have their own privacy practices. Third-party price sources are linked for transparency and are not ElectricalsNG checkout pages.</p>
      <h2>Your enquiry details</h2><p>For questions about your enquiry or order request information, or to ask for a correction or deletion, contact <a href={`mailto:${site.email}`}>{site.email}</a>. Include your request reference where available, but do not send sensitive identity documents unless specifically arranged through an appropriate channel.</p>
    </article>
  </>;
}
