export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString("de-DE")} Pkt.`;
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + "…" : text;
}

export const ALLERGEN_LABELS: Record<string, string> = {
  gluten:   "Gluten",
  lactose:  "Laktose",
  nuts:     "Nüsse",
  eggs:     "Eier",
  fish:     "Fisch",
  soy:      "Soja",
  celery:   "Sellerie",
  mustard:  "Senf",
  sesame:   "Sesam",
  sulphites:"Sulfite",
};
