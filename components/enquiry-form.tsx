"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { site } from "@/lib/site";

export function EnquiryForm({ procurement = false }: { procurement?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const formName = procurement ? "procurement" : "contact";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("bot-field")) return;
    setStatus("sending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const body = new URLSearchParams();
      formData.forEach((value, key) => { if (typeof value === "string") body.append(key, value); });
      const response = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString(), signal: controller.signal });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally { clearTimeout(timeout); }
  }
  return <form className="enquiry-form" name={formName} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}><input type="hidden" name="form-name" value={formName} /><p className="honeypot"><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p><h2>{procurement ? "Tell us what you’re sourcing." : "Make a connection."}</h2><p className="form-intro">{procurement ? "Share your requirements. We’ll take it from there." : "Send a product or service enquiry to our team."} Fields marked * are required.</p><div className="form-field-grid"><label className="form-field"><span>Your name *</span><input name="name" autoComplete="name" required maxLength={120} placeholder="Full name" /></label><label className="form-field"><span>Email address *</span><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@company.com" /></label></div><div className="form-field-grid"><label className="form-field"><span>Company {procurement ? "*" : "(optional)"}</span><input name="company" autoComplete="organization" required={procurement} maxLength={200} placeholder="Business or organization" /></label><label className="form-field"><span>Phone / WhatsApp (optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Your preferred contact number" /></label></div><label className="form-field"><span>Project location (optional)</span><input name="location" maxLength={200} placeholder="City / state" /></label><label className="form-field"><span>{procurement ? "Products, quantities & specifications *" : "How can we help? *"}</span><textarea name="requirements" rows={5} required minLength={10} maxLength={6000} placeholder={procurement ? "Include product names or codes, quantities, required specifications and any project timeline. Please don’t include sensitive documents." : "Tell us about the product or service you need. Include a product code if you have one."} /></label><label className="form-consent"><input type="checkbox" name="consent" required value="agreed" /><span>I agree that ElectricalsNG may use these details to respond to my enquiry, as explained in the <Link href="/privacy">privacy notice</Link>. *</span></label><button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting your enquiry…" : procurement ? "Request a quotation" : "Send your enquiry"}<ArrowUpRight size={17} /></button><div aria-live="polite" role="status">{status === "success" && <div className="form-status success"><CheckCircle2 size={19} /><strong> Thank you. Your enquiry has been submitted.</strong><p>Our team can follow up using the contact details you provided. This is an enquiry, not a confirmed order or quotation.</p></div>}{status === "error" && <div className="form-status error">Your enquiry could not be submitted. Please try again or email <a href={`mailto:${site.email}`}>{site.email}</a>. Nothing has been confirmed.</div>}</div></form>;
}
