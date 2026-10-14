import { formatPrice, type Product } from "./products";
import { site, whatsappLink } from "./site";

export function productEnquiry(product: Product) {
  const priceText = product.sellingPrice !== undefined ? `I saw your listed selling price of ${formatPrice(product)}.` : product.referencePrice ? `I saw the indicative reference price of ${formatPrice(product)} on your website.` : "The website lists the price as on request.";
  return whatsappLink(`Hello ElectricalsNG, I am interested in ${product.name} (${product.id}). ${priceText} Please confirm your current selling price, availability, exact specifications, and whether there is room for negotiation. Product link: ${site.url}/products/${product.slug}`);
}
