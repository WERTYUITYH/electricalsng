import { formatPrice, type Product } from "./products";
import { whatsappLink } from "./site";

export type OrderProduct = Pick<Product, "id" | "name" | "slug" | "image" | "category" | "sellingPrice" | "referencePrice" | "referencePriceHigh" | "availability">;
export type OrderLine = { productId: string; quantity: number };
export type OrderReceipt = { reference: string; name: string; city: string; fulfilment: string; items: string; message: string };

export function orderItemSummary(product: OrderProduct, quantity: number) {
  const priceLabel = product.sellingPrice !== undefined ? "listed selling price per unit, subject to confirmation" : product.referencePrice ? "indicative market reference per unit, NOT a selling price" : "quotation required";
  return `${product.id} — ${product.name} | Quantity: ${quantity} | ${formatPrice(product)} (${priceLabel})`;
}

export function orderWhatsAppMessage(receipt: Omit<OrderReceipt, "message">) {
  const products = receipt.items.split("\n").map(item => item.split(" | ").slice(0, 2).join(" | ")).join("\n");
  return `Hello ElectricalsNG, I submitted order request ${receipt.reference} on your website.\n\nName: ${receipt.name}\n${products}\n\nFulfilment: ${receipt.fulfilment}${receipt.city ? ` (${receipt.city})` : ""}.\n\nPlease confirm the exact products, availability, final selling prices, delivery or collection arrangements, and the full amount payable. Please send the business owner's bank details and account name so I can make a bank transfer after we agree the final quotation. I have not made a payment. Please acknowledge my payment separately after it is received.`;
}

export function orderWhatsAppLink(receipt: OrderReceipt) {
  return whatsappLink(receipt.message);
}
