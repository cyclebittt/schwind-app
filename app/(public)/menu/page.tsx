import { formatPrice } from "@/lib/utils/formatters";
import { ALLERGEN_LABELS } from "@/lib/utils/formatters";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  allergens: string[];
  available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  sort: number;
  items: MenuItem[];
}

const DEMO_MENU: MenuCategory[] = [
  {
    id: "c1", name: "Bier vom Fass", sort: 1,
    items: [
      { id: "1", name: "Schwindbräu Helles 0,5l",   description: "Unser Klassiker – hell, mild, erfrischend",   price: 3.80, allergens: ["gluten"], available: true },
      { id: "2", name: "Schwindbräu Helles 0,3l",   description: "Die kleine Variante",                         price: 2.50, allergens: ["gluten"], available: true },
      { id: "3", name: "Schwindbräu Weißbier 0,5l", description: "Traditionell gebraut, würzig und fruchtig",   price: 4.10, allergens: ["gluten"], available: true },
      { id: "4", name: "Radler 0,5l",               description: "Helles mit Zitronenlimonade",                price: 3.60, allergens: ["gluten"], available: true },
      { id: "5", name: "Alkoholfrei 0,5l",           description: "Voller Geschmack ohne Alkohol",              price: 3.50, allergens: ["gluten"], available: true },
    ],
  },
  {
    id: "c2", name: "Saisonbier & Spezialitäten", sort: 2,
    items: [
      { id: "6", name: "Maibock 0,5l",           description: "Unser Frühlingsbock – malzig, vollmundig, 6,5%", price: 4.50, allergens: ["gluten"], available: true },
      { id: "7", name: "Schwindbräu Spezial 0,5l", description: "Dunkles Lagerbier nach alter Hausrezeptur",   price: 4.20, allergens: ["gluten"], available: true },
    ],
  },
  {
    id: "c3", name: "Flaschen & Flaschenbier", sort: 3,
    items: [
      { id: "8",  name: "Schwindbräu Helles 0,5l Flasche",   description: "Zum Mitnehmen",    price: 3.00, allergens: ["gluten"], available: true },
      { id: "9",  name: "Schwindbräu Weißbier 0,5l Flasche", description: "Zum Mitnehmen",    price: 3.20, allergens: ["gluten"], available: true },
    ],
  },
  {
    id: "c4", name: "Brotzeiten & Snacks", sort: 4,
    items: [
      { id: "10", name: "Brezn",                  description: "Frische Laugenbrezn",                         price: 2.20, allergens: ["gluten"], available: true },
      { id: "11", name: "Obazda mit Brot",         description: "Hausgemachter Obazda mit Bauernbrot",        price: 5.80, allergens: ["gluten", "lactose", "eggs"], available: true },
      { id: "12", name: "Wurstteller",             description: "Aufschnitt mit Essiggurken und Brot",        price: 7.90, allergens: ["gluten"], available: true },
      { id: "13", name: "Schweinsbraten mit Knödel", description: "Klassischer Sonntagsbraten",               price: 13.50, allergens: ["gluten", "eggs"], available: true },
      { id: "14", name: "Leberknödelsuppe",         description: "Hausgemacht in klarer Rinderbrühe",         price: 5.50, allergens: ["gluten", "eggs"], available: true },
    ],
  },
  {
    id: "c5", name: "Alkoholfreie Getränke", sort: 5,
    items: [
      { id: "15", name: "Wasser still/sprudelnd 0,5l", description: null, price: 2.80, allergens: [], available: true },
      { id: "16", name: "Apfelsaft 0,3l",              description: "Regional",         price: 2.90, allergens: [], available: true },
      { id: "17", name: "Cola / Fanta / Sprite 0,3l",  description: null,               price: 2.90, allergens: [], available: true },
      { id: "18", name: "Kaffee",                      description: "Frisch gebrüht",  price: 2.80, allergens: [], available: true },
    ],
  },
];

export const revalidate = 300;

async function fetchMenu(): Promise<MenuCategory[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return DEMO_MENU;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: cats } = await supabase.from("menu_categories").select("*").order("sort");
    const { data: items } = await supabase.from("menu_items").select("*").order("sort");
    if (!cats?.length) return DEMO_MENU;
    return cats.map((cat) => ({
      ...cat,
      items: (items ?? []).filter((i) => i.category_id === cat.id),
    }));
  } catch { return DEMO_MENU; }
}

export default async function MenuPage() {
  const menu = await fetchMenu();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Speisekarte</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">SCHWIND Bräu – Gaststätte & Ausschank</p>
          </div>

          {/* Category nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {menu.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="whitespace-nowrap text-sm px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>

          {menu.map((cat) => (
            <section key={cat.id} id={`cat-${cat.id}`}>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 border-b border-[var(--color-border)] pb-2">
                {cat.name}
              </h2>
              <div className="space-y-3">
                {cat.items.filter((i) => i.available).map((item) => (
                  <div key={item.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-start justify-between gap-4 card-shadow">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-[var(--color-text)]">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-[var(--color-muted)]">{item.description}</p>
                      )}
                      {item.allergens.length > 0 && (
                        <p className="text-xs text-[var(--color-muted)] opacity-70">
                          {item.allergens.map((a) => ALLERGEN_LABELS[a] ?? a).join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-[var(--color-text)] whitespace-nowrap">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <p className="text-xs text-[var(--color-muted)] text-center pt-4">
            Alle Preise inkl. MwSt. · Änderungen vorbehalten · Schwindbräu seit 1761
          </p>
    </div>
  );
}
