export const productCategories = [
  { slug: "chandeliers", label: "Chandeliers" },
  { slug: "pendant-lights", label: "Pendant lights" },
  { slug: "wall-lights", label: "Wall lights" },
  { slug: "ceiling-lights", label: "Ceiling lights" },
  { slug: "floor-table-lamps", label: "Floor & table lamps" },
  { slug: "solar-energy", label: "Solar & energy" },
] as const;

export function categorySlug(label: string) {
  return productCategories.find(category => category.label === label)?.slug ?? "";
}
