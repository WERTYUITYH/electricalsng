import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/page-heading";
import { OrderForm } from "@/components/order-form";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cart & WhatsApp checkout",
  description: "Choose products, submit your order information and request ElectricalsNG bank details on WhatsApp. Confirm the quotation before making a bank transfer.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  const orderProducts = products.map(({ id, name, slug, image, category, sellingPrice, referencePrice, referencePriceHigh, availability }) => ({ id, name, slug, image, category, sellingPrice, referencePrice, referencePriceHigh, availability }));
  return <>
    <PageHeading label="Your cart" eyebrow="CHOOSE. CONFIRM. CONNECT." title={<>Your cart <span>& checkout.</span></>} description="Review your saved products, share your details and confirm your quotation on WhatsApp. No payment is collected online." />
    <div className="container order-layout">
      <details className="order-guide">
        <summary>How ordering works & payment safety</summary>
        <span className="small-label">HOW YOUR ORDER WORKS</span>
        <h2>Clear details.<br />No guesswork.</h2>
        <ol className="order-steps">
          <li><span>01</span><div><h3>Choose your products</h3><p>Add products and quantities, including items marked Price on request.</p></div></li>
          <li><span>02</span><div><h3>Send your order information</h3><p>Share contact details and your preferred delivery or collection arrangement.</p></div></li>
          <li><span>03</span><div><h3>Confirm & request bank details</h3><p>Continue to WhatsApp. Agree the exact products, final prices and any delivery charges with the team before transferring.</p></div></li>
        </ol>
        <div className="order-safety"><h3>Before you make a transfer</h3><p>Confirm the account name and bank details directly with our team on the published business WhatsApp number. Never enter your PIN, OTP or card details here. Submitting a request does not confirm stock, an accepted order or payment.</p></div>
      </details>
      <Suspense fallback={<div className="order-loading" role="status">Loading your order form…</div>}><OrderForm products={orderProducts} /></Suspense>
    </div>
  </>;
}
