import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Pricing & order information", description: "How to interpret reference prices and confirm product specifications, stock, order terms and after-sales arrangements with ElectricalsNG." };

export default function PoliciesPage() {
  return <>
    <PageHeading label="Pricing & order information" eyebrow="CLEAR BEFORE YOU COMMIT" title={<>A little detail.<br /><span>A clearer decision.</span></>} />
    <article className="container policy-content">
      <h2>Reference prices, not quotations</h2><p>Prices labelled “indicative reference” were researched from third-party retailer listings. They provide context, not confirmed ElectricalsNG selling prices. Some references are visually comparable designs, not verified identical manufacturer models. Sizes, finishes, technical specifications and commercial terms can differ. Each researched product lists its source and research date on its detail page.</p>
      <h2>Price on request</h2><p>Where a sufficiently reliable comparable has not been verified, we show “Price on request”. No selling price, rating or availability should be inferred. Contact the team to confirm the exact product, specifications and a quotation.</p>
      <h2>Submit your order information</h2><p>Use the <Link href="/order">order request form</Link> to choose products, enter quantities and share your contact and delivery or collection preferences. After submission, keep your reference and continue to WhatsApp to request the business owner’s bank details. Submitting the form is not an accepted order, a stock reservation or a payment.</p>
      <h2>Confirm your quotation before paying</h2><p>Please confirm the precise product and variant, electrical compatibility, quantities, selling price, taxes or other charges where applicable, availability, delivery or collection arrangements and agreed payment terms directly with ElectricalsNG. Reference prices are not used to calculate a payable total. Delivery coverage, charges and timing must be agreed with the team.</p>
      <h2>Bank transfer & payment acknowledgement</h2><p>The website does not collect payments, publish bank details or automatically verify transfers. Request the business owner’s bank details and account name through our published business WhatsApp contact. Verify those details and the agreed final amount directly with the team before transferring. Ask the business to acknowledge receipt of your transfer; a website submission reference is not a payment receipt. Never share your banking password, PIN or OTP in a form or WhatsApp conversation.</p>
      <h2>Warranty, returns & after-sales support</h2><p>Ask the team to confirm the warranty, return eligibility, installation requirements and after-sales arrangements that apply to your specific product and order before purchase. No general warranty duration, return window or delivery guarantee is stated on this website.</p>
      <h2>Quotation requests & WhatsApp</h2><p>A form submission is an enquiry, not an accepted quotation or order. WhatsApp links prepare a message; you review and send it yourself. If you do not use WhatsApp, contact the team by phone or email with your request reference. To discuss any details, <Link href="/contact">contact our team</Link>.</p>
    </article>
  </>;
}
