export const site = {
  name: "ElectricalsNG",
  description: "Electrical and electronic products for homes, commercial projects and professional applications. Procurement, product guidance and after-sales support in Nigeria.",
  url: "https://electricalsng.com",
  email: "info@electricalsng.com",
  phone: "08028828834",
  internationalPhone: "+2348028828834",
  whatsapp: "2348028828834",
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
  },
};

export function whatsappLink(message = "Hello ElectricalsNG, I would like some help choosing electrical products for my project.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const faqs = [
  { question: "How do I place an order and request bank details?", answer: "Choose ‘Order request’ on a product or open the Order page. Add products and quantities, provide your contact and delivery or collection preferences, and submit the request. Keep your reference and use the WhatsApp button to ask the business owner for bank details. Confirm the exact products, availability, final selling prices, delivery charges and account name directly with the team before transferring. The website does not take or verify payments." },
  { question: "Is my order confirmed when I submit the form?", answer: "No. A submitted order request records the information you provided; it is not an accepted quotation, stock reservation or payment receipt. The team must confirm your order and payment separately. If a submission times out, contact the team with the displayed reference before retrying repeatedly so they can identify any duplicate request." },
  { question: "Are the prices on this website your selling prices?", answer: "Prices marked ‘indicative reference’ come from third-party market research, not confirmed ElectricalsNG quotations. Comparable designs may have different sizes, finishes or specifications. Contact our team for a current selling price. A price on request means a reliable comparable could not be verified." },
  { question: "How do I confirm product availability?", answer: "Open the product and select ‘Enquire on WhatsApp’. Our team can confirm the exact variant, availability and lead time before you place an order. A catalogue listing is not a stock guarantee." },
  { question: "Can you help me choose the right product?", answer: "Yes. Share your application, installation requirements, preferred product and any existing specifications. ElectricalsNG provides product selection guidance and electrical engineering consultancy. Technical compatibility should be confirmed before purchase." },
  { question: "Do you support bulk and corporate procurement?", answer: "Yes. Contractors, developers, maintenance teams and procurement officers can submit a quotation request with their product list, quantities and project requirements. The team will follow up to clarify specifications and provide a quotation." },
  { question: "Can I negotiate a price on WhatsApp?", answer: "You can discuss current selling prices, quantities and possible negotiation with the team. Product enquiry buttons prepare a message with the product link; you review and send it yourself in WhatsApp." },
  { question: "What after-sales support is available?", answer: "ElectricalsNG offers after-sales product guidance. Contact the team with your product details and the issue you are experiencing. Any warranty, return eligibility, delivery arrangements or installation requirements must be confirmed with the team for your specific order." },
];
