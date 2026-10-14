"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Copy, MessageCircle, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useSellingPrices } from "./featured-products";
import { formatPrice } from "@/lib/products";
import { orderItemSummary, orderWhatsAppLink, orderWhatsAppMessage, type OrderLine, type OrderProduct, type OrderReceipt } from "@/lib/order";
import { site } from "@/lib/site";

export function OrderForm({ products }: { products: OrderProduct[] }) {
  const params = useSearchParams();
  const requestedProduct = params.get("product");
  const catalogue = useSellingPrices(products);
  const [lines, setLines] = useState<OrderLine[]>(() => requestedProduct && products.some(product => product.id === requestedProduct) ? [{ productId: requestedProduct, quantity: 1 }] : []);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [search, setSearch] = useState("");
  const [fulfilment, setFulfilment] = useState("Delivery");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const reference = useRef("");
  const submissionInFlight = useRef(false);
  const receiptHeading = useRef<HTMLHeadingElement>(null);
  const availableProducts = useMemo(() => catalogue.filter(product => !lines.some(line => line.productId === product.id) && `${product.name} ${product.id} ${product.category}`.toLowerCase().includes(search.trim().toLowerCase())), [catalogue, lines, search]);
  const itemSummary = lines.map(line => {
    const product = catalogue.find(item => item.id === line.productId);
    return product ? orderItemSummary(product, line.quantity) : "";
  }).filter(Boolean).join("\n");

  useEffect(() => {
    if (status === "success") receiptHeading.current?.focus();
  }, [status]);

  function addProduct() {
    if (!availableProducts.some(product => product.id === selectedProduct) || lines.length >= 20) return;
    setLines(current => [...current, { productId: selectedProduct, quantity: 1 }]);
    setSelectedProduct("");
    setSearch("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("bot-field")) return;
    if (!lines.length || lines.length > 20 || lines.some(line => !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 999)) {
      setError("Add at least one product, with a whole-number quantity between 1 and 999. You can include up to 20 different products.");
      return;
    }
    if (!String(formData.get("name") || "").trim() || !String(formData.get("phone") || "").trim() || (fulfilment === "Delivery" && (!String(formData.get("address") || "").trim() || !String(formData.get("city") || "").trim() || !String(formData.get("state") || "").trim()))) {
      setError("Please complete your name, phone number and required delivery details using more than spaces.");
      return;
    }
    if (!reference.current) reference.current = `ENG-${crypto.randomUUID().toUpperCase()}`;
    const details = { reference: reference.current, name: String(formData.get("name")).trim(), city: fulfilment === "Delivery" ? String(formData.get("city") || "").trim() : "", fulfilment, items: itemSummary };
    const submittedReceipt = { ...details, message: orderWhatsAppMessage(details) };
    const body = new URLSearchParams();
    formData.forEach((value, key) => { if (typeof value === "string") body.append(key, value); });
    body.set("order-reference", details.reference);
    body.set("items", itemSummary);
    body.set("payment-method", "Bank transfer — request owner bank details on WhatsApp; no payment collected online");
    body.set("order-status", "Order request only — awaiting business quotation and confirmation; unpaid");
    submissionInFlight.current = true;
    setStatus("sending");
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString(), signal: controller.signal });
      if (!response.ok) throw new Error("Submission failed");
      setReceipt(submittedReceipt);
      setStatus("success");
    } catch {
      setError(`We couldn’t confirm your submission. Your details are still here. Please retry or contact ${site.phone}; if a request was received, ask the team to use reference ${details.reference} to avoid a duplicate. No payment has been taken.`);
      setStatus("error");
    } finally {
      clearTimeout(timeout);
      submissionInFlight.current = false;
    }
  }

  async function copyMessage() {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  if (receipt && status === "success") return <section className="order-receipt" aria-labelledby="order-receipt-title">
    <CheckCircle2 size={34} strokeWidth={1.5} />
    <span className="small-label">NEXT: CONFIRM ON WHATSAPP</span>
    <h2 id="order-receipt-title" tabIndex={-1} ref={receiptHeading}>Your order request<br />has been submitted.</h2>
    <p>Thank you, {receipt.name}. Keep your reference so our team can match your WhatsApp conversation to the information you shared.</p>
    <div className="order-reference"><span>YOUR REQUEST REFERENCE</span><strong>{receipt.reference}</strong></div>
    <p className="order-receipt-items">{receipt.items}</p>
    <a className="button button-dark" href={orderWhatsAppLink(receipt)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />Request bank details on WhatsApp<ArrowUpRight size={17} /></a>
    <p>WhatsApp opens a prepared message with your reference and product list. Review and send it yourself. Ask the owner for the account name, bank details and final amount before paying.</p>
    <button type="button" className="text-link" onClick={copyMessage}><Copy size={16} />{copied ? "Message copied" : "Copy WhatsApp message"}</button>
    <div role="status" aria-live="polite">{copied && <p>Message copied. You can send it to {site.phone}.</p>}{copyError && <p>Copy is unavailable. Use the message below or contact <a href={`tel:${site.internationalPhone}`}>{site.phone}</a>.</p>}</div>
    <details className="order-message"><summary>View your prepared message</summary><pre>{receipt.message}</pre></details>
    <div className="order-safety"><strong>This is not a payment receipt.</strong><p>Your request still needs confirmation of products, availability, selling prices and delivery charges. Bank transfers and payment acknowledgements are handled directly by the business, not automatically by this website.</p></div>
    <Link className="text-link" href="/products">Continue browsing<ArrowUpRight size={16} /></Link>
  </section>;

  return <form className="enquiry-form order-form" name="order-request" method="POST" action="/__forms.html" data-netlify="true" netlify-honeypot="bot-field" aria-busy={status === "sending"} onSubmit={submit}>
    <input type="hidden" name="form-name" value="order-request" />
    <input type="hidden" name="order-reference" value={reference.current} />
    <input type="hidden" name="items" value={itemSummary} />
    <input type="hidden" name="payment-method" value="Bank transfer — request owner bank details on WhatsApp; no payment collected online" />
    <input type="hidden" name="order-status" value="Order request only — awaiting business quotation and confirmation; unpaid" />
    <p className="honeypot"><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    <fieldset className="order-fieldset" disabled={status === "sending"}>
      <legend className="order-form-title">Put your order together.</legend>
      <p className="form-intro">Fields marked * are required. This form saves an order request; no payment is taken. Your draft is not saved until you submit it.</p>
      <h2 className="order-section-title"><ShoppingBag size={19} />1. Products & quantities</h2>
      <div className="order-product-picker">
        <label className="form-field"><span>Find a product</span><input type="search" value={search} onChange={event => { setSearch(event.target.value); setSelectedProduct(""); }} placeholder="Search product name, collection or code" /></label>
        <label className="form-field"><span>Choose a product to add</span><select value={selectedProduct} onChange={event => setSelectedProduct(event.target.value)}><option value="">{availableProducts.length ? "Select a product" : "No matching products"}</option>{availableProducts.map(product => <option key={product.id} value={product.id}>{product.id} — {product.name}</option>)}</select></label>
        <button className="button button-dark" type="button" onClick={addProduct} disabled={!selectedProduct || lines.length >= 20}><Plus size={17} />Add to this order</button>
      </div>
      <p className="order-item-count" aria-live="polite">{lines.length ? `${lines.length} of 20 product lines selected` : "No products selected yet. Add your first product above."}</p>
      <div className="order-lines">{lines.map(line => {
        const product = catalogue.find(item => item.id === line.productId);
        if (!product) return null;
        return <div className="order-line" key={line.productId}>
          <Image src={product.image} alt={product.name} width={72} height={84} />
          <div className="order-line-description"><Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">{product.name}<span className="sr-only"> (opens in a new tab)</span></Link><span>{product.id}</span><strong>{formatPrice(product)}</strong><span>{product.sellingPrice !== undefined ? "Listed selling price / unit; confirm with team" : product.referencePrice ? "Indicative reference / unit — not a selling price" : "Final selling price to be quoted"}</span></div>
          <label className="order-quantity"><span>Quantity *</span><input aria-label={`Quantity for ${product.name}`} type="number" required min={1} max={999} step={1} inputMode="numeric" value={Number.isNaN(line.quantity) ? "" : line.quantity} onChange={event => { const quantity = event.currentTarget.valueAsNumber; setLines(current => current.map(item => item.productId === line.productId ? { ...item, quantity } : item)); }} /></label>
          <button className="order-remove" type="button" aria-label={`Remove ${product.name} from order`} onClick={() => setLines(current => current.filter(item => item.productId !== line.productId))}><Trash2 size={18} /></button>
        </div>;
      })}</div>
      <p className="order-price-note">No payable total is calculated from reference prices. The team will confirm selling prices, availability, taxes where applicable and delivery charges before you pay. For more than 20 products, <Link href="/procurement">request a procurement quotation</Link>.</p>
      <h2 className="order-section-title">2. Your contact information</h2>
      <div className="form-field-grid"><label className="form-field"><span>Full name *</span><input name="name" autoComplete="name" required maxLength={120} /></label><label className="form-field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} /></label></div>
      <div className="form-field-grid"><label className="form-field"><span>Email address (optional)</span><input name="email" type="email" autoComplete="email" maxLength={200} /></label><label className="form-field"><span>Company (optional)</span><input name="company" autoComplete="organization" maxLength={200} /></label></div>
      <h2 className="order-section-title">3. Delivery or collection</h2>
      <label className="form-field"><span>Preferred arrangement *</span><select name="fulfilment" value={fulfilment} onChange={event => setFulfilment(event.target.value)}><option>Delivery</option><option>Collection — arrange with the team</option></select></label>
      {fulfilment === "Delivery" && <><label className="form-field"><span>Delivery address *</span><textarea name="address" autoComplete="street-address" rows={2} required maxLength={500} /></label><div className="form-field-grid"><label className="form-field"><span>City / town *</span><input name="city" autoComplete="address-level2" required maxLength={120} /></label><label className="form-field"><span>State / region *</span><input name="state" autoComplete="address-level1" required maxLength={120} /></label></div></>}
      <p className="form-intro">Delivery coverage, charges, timing and any collection location must be agreed directly with the team. No free delivery or collection availability is implied.</p>
      <label className="form-field"><span>Order notes & preferred variants (optional)</span><textarea name="notes" rows={4} maxLength={3000} placeholder="Finish, size, specifications to confirm, or other requirements. Do not include banking credentials or payment information." /></label>
      <label className="form-consent"><input type="checkbox" name="consent" required value="agreed" /><span>I agree that ElectricalsNG may use my order and contact details to respond to this request as explained in the <Link href="/privacy">privacy notice</Link>. I understand that this is not a confirmed order or payment. *</span></label>
      <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting your order request…" : "Submit order & continue to WhatsApp"}<ArrowUpRight size={17} /></button>
    </fieldset>
    <div aria-live="polite" role="status">{status === "sending" && <p>Sending your request. Please keep this page open.</p>}</div>
    {error && <div className="form-status error" role="alert">{error}<p>If you need help, <a href={`mailto:${site.email}`}>email {site.email}</a> or call <a href={`tel:${site.internationalPhone}`}>{site.phone}</a>.</p></div>}
  </form>;
}
