"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Copy, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { useSellingPrices } from "./featured-products";
import { formatPrice } from "@/lib/products";
import { orderItemSummary, orderWhatsAppLink, orderWhatsAppMessage, type OrderProduct, type OrderReceipt } from "@/lib/order";
import { useCart } from "@/lib/cart-store";
import { site } from "@/lib/site";

export function OrderForm({ products }: { products: OrderProduct[] }) {
  const params = useSearchParams();
  const requestedProduct = params.get("product");
  const catalogue = useSellingPrices(products);
  const lines = useCart(state => state.items);
  const ready = useCart(state => state.ready);
  const saving = useCart(state => state.saving);
  const loading = useCart(state => state.loading);
  const cartError = useCart(state => state.error);
  const changeCart = useCart(state => state.change);
  const [step, setStep] = useState<"cart" | "details">("cart");
  const requestedHandled = useRef("");
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
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const availableProducts = useMemo(() => catalogue.filter(product => !lines.some(line => line.productId === product.id) && `${product.name} ${product.id} ${product.category}`.toLowerCase().includes(search.trim().toLowerCase())), [catalogue, lines, search]);
  const itemSummary = lines.map(line => {
    const product = catalogue.find(item => item.id === line.productId);
    return product ? orderItemSummary(product, line.quantity) : "";
  }).filter(Boolean).join("\n");

  useEffect(() => {
    if (status === "success") receiptHeading.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!ready || !requestedProduct || requestedHandled.current === requestedProduct || !products.some(product => product.id === requestedProduct)) return;
    requestedHandled.current = requestedProduct;
    const consume = async () => {
      const added = lines.some(line => line.productId === requestedProduct) || await changeCart({ action: "add", productId: requestedProduct });
      if (added) {
        const next = new URLSearchParams(window.location.search);
        next.delete("product");
        window.history.replaceState(null, "", `${window.location.pathname}${next.size ? `?${next}` : ""}`);
      } else requestedHandled.current = "";
    };
    void consume();
  }, [ready, requestedProduct, products, lines, changeCart]);

  useEffect(() => { stepHeading.current?.focus({ preventScroll: true }); }, [step]);

  async function addProduct() {
    if (!availableProducts.some(product => product.id === selectedProduct) || lines.length >= 20) return;
    if (!await changeCart({ action: "add", productId: selectedProduct })) return;
    setSelectedProduct("");
    setSearch("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInFlight.current) return;
    const form = event.currentTarget;
    if (step !== "details" || !ready || saving || loading || cartError) return;
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
    <a className="button button-dark" href={orderWhatsAppLink(receipt)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19} />Request bank details on WhatsApp<ArrowUpRight size={17} /></a>
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
      <p className="form-intro">Your products and quantities are saved for 30 days on this browser. Contact and delivery details are sent only when you submit. No payment is taken here.</p>
      <nav className="checkout-steps" aria-label="Checkout steps"><button type="button" aria-current={step === "cart" ? "step" : undefined} onClick={() => setStep("cart")}>1. Your cart ({lines.length})</button><button type="button" aria-current={step === "details" ? "step" : undefined} disabled={!ready || !lines.length || saving || loading || Boolean(cartError)} onClick={() => setStep("details")}>2. Details & WhatsApp</button></nav>
      <h2 ref={stepHeading} tabIndex={-1} className="sr-only">{step === "cart" ? "Your cart" : "Your contact and delivery details"}</h2>
      <div hidden={step !== "cart"}>
      <h2 className="order-section-title"><ShoppingBag size={19} />1. Products & quantities</h2>
      <details className="order-product-picker" open={!lines.length}>
        <summary>Add another product</summary>
        <label className="form-field"><span>Find a product</span><input type="search" value={search} onChange={event => { setSearch(event.target.value); setSelectedProduct(""); }} placeholder="Search product name, collection or code" /></label>
        <label className="form-field"><span>Choose a product to add</span><select value={selectedProduct} onChange={event => setSelectedProduct(event.target.value)}><option value="">{availableProducts.length ? "Select a product" : "No matching products"}</option>{availableProducts.map(product => <option key={product.id} value={product.id}>{product.id} — {product.name}</option>)}</select></label>
        <button className="button button-dark" type="button" onClick={addProduct} disabled={!ready || saving || loading || !selectedProduct || lines.length >= 20}><Plus size={17} />Add to cart</button>
      </details>
      {(!ready || loading) && <p role="status">{loading ? "Restoring your saved cart…" : "Use Refresh cart above to restore your products."}</p>}
      <p className="order-item-count" aria-live="polite">{lines.length ? `${lines.length} of 20 product lines selected` : "No products selected yet. Add your first product above."}</p>
      <div className="order-lines">{lines.map(line => {
        const product = catalogue.find(item => item.id === line.productId);
        if (!product) return null;
        return <div className="order-line" key={line.productId}>
          <Image src={product.image} alt={product.name} width={72} height={84} />
          <div className="order-line-description"><Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">{product.name}<span className="sr-only"> (opens in a new tab)</span></Link><span>{product.id}</span><strong>{formatPrice(product)}</strong><span>{product.sellingPrice !== undefined ? "Listed selling price / unit; confirm with team" : product.referencePrice ? "Indicative reference / unit — not a selling price" : "Final selling price to be quoted"}</span></div>
          <label className="order-quantity"><span>Quantity *</span><input aria-label={`Quantity for ${product.name}`} type="number" required min={1} max={999} step={1} inputMode="numeric" defaultValue={line.quantity} key={`${line.productId}-${line.quantity}`} disabled={saving || loading} onBlur={event => { const quantity = event.currentTarget.valueAsNumber; if (Number.isInteger(quantity) && quantity >= 1 && quantity <= 999) { if (quantity !== line.quantity) void changeCart({ action: "quantity", productId: line.productId, quantity }); } else { event.currentTarget.value = String(line.quantity); setError("Quantity must be a whole number from 1 to 999."); } }} /></label>
          <button className="order-remove" type="button" disabled={saving || loading} aria-label={`Remove ${product.name} from order`} onClick={() => void changeCart({ action: "remove", productId: line.productId })}><Trash2 size={18} /></button>
        </div>;
      })}</div>
      <p className="order-price-note">No payable total is calculated from reference prices. The team will confirm selling prices, availability, taxes where applicable and delivery charges before you pay. For more than 20 products, <Link href="/procurement">request a procurement quotation</Link>.</p>
      <div className="cart-step-actions"><Link href="/products" className="text-link">Continue shopping<ArrowUpRight size={16} /></Link><button type="button" className="button button-dark" disabled={!ready || !lines.length || saving || loading || Boolean(cartError)} onClick={() => { setStep("details"); setError(""); }}>Continue to checkout<ArrowUpRight size={17} /></button></div>
      {lines.length > 0 && <button type="button" className="text-link clear-cart" disabled={saving || loading} onClick={() => void changeCart({ action: "clear" })}><Trash2 size={14} />Empty cart</button>}
      </div>
      <fieldset className="checkout-details" hidden={step !== "details"} disabled={step !== "details"}>
      <legend className="sr-only">Contact and fulfilment details</legend>
      <p className="checkout-summary">{lines.length} product {lines.length === 1 ? "line" : "lines"} in your cart. <button type="button" className="text-link" onClick={() => setStep("cart")}>Review items</button></p>
      <h2 className="order-section-title">2. Your contact information</h2>
      <div className="form-field-grid"><label className="form-field"><span>Full name *</span><input name="name" autoComplete="name" required maxLength={120} /></label><label className="form-field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} /></label></div>
      <div className="form-field-grid"><label className="form-field"><span>Email address (optional)</span><input name="email" type="email" autoComplete="email" maxLength={200} /></label><label className="form-field"><span>Company (optional)</span><input name="company" autoComplete="organization" maxLength={200} /></label></div>
      <h2 className="order-section-title">3. Delivery or collection</h2>
      <label className="form-field"><span>Preferred arrangement *</span><select name="fulfilment" value={fulfilment} onChange={event => setFulfilment(event.target.value)}><option>Delivery</option><option>Collection — arrange with the team</option></select></label>
      {fulfilment === "Delivery" && <><label className="form-field"><span>Delivery address *</span><textarea name="address" autoComplete="street-address" rows={2} required maxLength={500} /></label><div className="form-field-grid"><label className="form-field"><span>City / town *</span><input name="city" autoComplete="address-level2" required maxLength={120} /></label><label className="form-field"><span>State / region *</span><input name="state" autoComplete="address-level1" required maxLength={120} /></label></div></>}
      <p className="form-intro">Delivery coverage, charges, timing and any collection location must be agreed directly with the team. No free delivery or collection availability is implied.</p>
      <label className="form-field"><span>Order notes & preferred variants (optional)</span><textarea name="notes" rows={2} maxLength={3000} placeholder="Finish, specifications or other requirements. Do not include payment credentials." /></label>
      <label className="form-consent"><input type="checkbox" name="consent" required value="agreed" /><span>I agree that ElectricalsNG may use my order and contact details to respond to this request as explained in the <Link href="/privacy">privacy notice</Link>. I understand that this is not a confirmed order or payment. *</span></label>
      <div className="checkout-method"><WhatsAppIcon size={22} /><div><strong>WhatsApp checkout</strong><p>Submit your request, then review and send the prepared WhatsApp message.</p></div></div>
      <button className="button button-dark" type="submit" disabled={status === "sending" || !ready || !lines.length || saving || loading || Boolean(cartError)}><WhatsAppIcon size={18} />{status === "sending" ? "Submitting your order request…" : "Submit & continue to WhatsApp"}</button>
      <button className="gateway-coming-soon" type="button" disabled>Online payment · Coming soon</button><p className="form-intro">Paystack or another gateway is not connected. No online payment is available.</p>
      </fieldset>
    </fieldset>
    <div aria-live="polite" role="status">{status === "sending" && <p>Sending your request. Please keep this page open.</p>}</div>
    {error && <div className="form-status error" role="alert">{error}<p>If you need help, <a href={`mailto:${site.email}`}>email {site.email}</a> or call <a href={`tel:${site.internationalPhone}`}>{site.phone}</a>.</p></div>}
  </form>;
}
