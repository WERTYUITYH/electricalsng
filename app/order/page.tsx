import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/page-heading";
import { OrderForm } from "@/components/order-form";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Order & bank transfer request",
  description: "Choose products, submit your order information and request ElectricalsNG bank details on WhatsApp. Confirm the quotation before making a bank transfer.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  const orderProducts = products.map(({ id, name, slug, image, category, sellingPrice, referencePrice, referencePriceHigh, availability }) => ({ id, name, slug, image, category, sellingPrice, referencePrice, referencePriceHigh, availability }));
  return <>
    <PageHeading label="Start an order" eyebrow="CHOOSE. CONFIRM. CONNECT." title={<>Your products.<br /><span>A personal handover.</span></>} description="Put your product list together and share your order information here. Then reach us on WhatsApp to confirm your quotation and request the business owner’s bank details." />
    <div className="container order-layout">
      <aside className="order-guide">
        <span className="small-label">HOW YOUR ORDER WORKS</span>
        <h2>Clear details.<br />No guesswork.</h2>
        <ol className="order-steps">
          <li><span>01</span><div><h3>Choose your products</h3><p>Add products and quantities, including items marked Price on request.</p></div></li>
          <li><span>02</span><div><h3>Send your order information</h3><p>Share contact details and your preferred delivery or collection arrangement.</p></div></li>
          <li><span>03</span><div><h3>Confirm & request bank details</h3><p>Continue to WhatsApp. Agree the exact products, final prices and any delivery charges with the team before transferring.</p></div></li>
        </ol>
        <div className="order-safety"><h3>Before you make a transfer</h3><p>Confirm the account name and bank details directly with our team on the published business WhatsApp number. Never enter your PIN, OTP or card details here. Submitting a request does not confirm stock, an accepted order or payment.</p></div>
      </aside>
      <Suspense fallback={<div className="order-loading" role="status">Loading your order form…</div>}><OrderForm products={orderProducts} /></Suspense>
    </div>
  </>;
}
