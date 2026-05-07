// ─────────────────────────────────────────────
//  SCHWIND AM DALBERG – Digitale Speise- & Getränkekarte
//  Server Component – inline data, no Supabase needed
// ─────────────────────────────────────────────

export const revalidate = 3600;

// ── Types ────────────────────────────────────

interface SizePrice {
  size: string;
  price: string;
}

interface MenuItem {
  name: string;
  description?: string;
  origin?: string;
  abv?: string;        // e.g. "40% vol"
  badge?: string;      // e.g. "Saisonal"
  sizes?: SizePrice[]; // multiple size options
  price?: string;      // single price
  featured?: boolean;
}

interface MenuSection {
  id: string;
  number: string; // "01", "02", etc.
  title: string;
  emoji: string;
  items: MenuItem[];
  subSections?: { title: string; items: MenuItem[] }[];
}

// ── Menu Data ────────────────────────────────

const SECTIONS: MenuSection[] = [
  // ── 01 SCHWIND VOM FASS ─────────────────────
  {
    id: "fass",
    number: "05",
    title: "Schwind vom Fass",
    emoji: "🍺",
    items: [
      {
        name: "Helles",
        description: "klar, Münchner Art, am Wochenend frisch vom Holzfass",
        sizes: [
          { size: "0,3l", price: "3,50 €" },
          { size: "0,5l", price: "4,50 €" },
        ],
      },
      {
        name: "Helles naturtrüb",
        description: "ungefiltert, naturbelassen, vom Holzfass",
        sizes: [
          { size: "0,3l", price: "3,50 €" },
          { size: "0,5l", price: "4,50 €" },
        ],
      },
      {
        name: "Export",
        description: "vollmundig",
        sizes: [
          { size: "0,3l", price: "3,50 €" },
          { size: "0,5l", price: "4,50 €" },
        ],
      },
      {
        name: "Pilsner",
        description: "hopfenbetont, frisch & herb",
        sizes: [
          { size: "0,3l", price: "3,50 €" },
          { size: "0,4l", price: "4,10 €" },
        ],
      },
      {
        name: "Dunkel",
        description: "röstmalzig, weich & aromatisch",
        sizes: [
          { size: "0,3l", price: "3,50 €" },
          { size: "0,5l", price: "4,50 €" },
        ],
      },
      {
        name: "Jubiläumsbier 1761",
        description: "Brauerei-Jubiläum, vollmundig & ausgewogen",
        sizes: [
          { size: "0,3l", price: "3,50 €" },
          { size: "0,5l", price: "4,50 €" },
        ],
      },
      {
        name: "Sommerhalbe SAISON",
        description: "leicht, erfrischend, saisonal",
        badge: "Saisonal",
        sizes: [
          { size: "0,3l", price: "3,80 €" },
          { size: "0,5l", price: "4,90 €" },
        ],
      },
      {
        name: "Hefeweizen",
        description: "hefetrüb, fruchtig & würzig",
        sizes: [
          { size: "0,5l", price: "4,90 €" },
        ],
      },
    ],
  },

  // ── 02 AUS DER FLASCHE + BIERFLIGHT ─────────
  {
    id: "flasche",
    number: "06",
    title: "Aus der Flasche",
    emoji: "🍾",
    items: [
      {
        name: "Schwind Bierflight",
        description: "4 verschiedene Schwind-Biere nach Wahl, je 0,1l – ideal zum Kennenlernen der Brauerei",
        price: "7,20 €",
        featured: true,
      },
      {
        name: "Rotgold",
        description: "kupferfarben, vollmundig",
        sizes: [{ size: "0,5l", price: "4,50 €" }],
      },
      {
        name: "MAIN Radler",
        description: "Bier & Zitronenlimonade, erfrischend",
        sizes: [{ size: "0,33l", price: "3,50 €" }],
      },
      {
        name: "ZERO,33 alkoholfrei",
        description: "alkoholfrei, vollmundig",
        sizes: [{ size: "0,33l", price: "3,50 €" }],
      },
      {
        name: "Hefeweizen alkoholfrei",
        description: "fruchtig & frisch, ohne Alkohol",
        sizes: [{ size: "0,5l", price: "4,90 €" }],
      },
      {
        name: "Helles alkoholfrei",
        description: "mild & erfrischend, ohne Alkohol",
        sizes: [{ size: "0,5l", price: "4,50 €" }],
      },
    ],
  },

  // ── 03 APERITIF & SPRITZ ─────────────────────
  {
    id: "aperitif",
    number: "01",
    title: "Aperitif & Spritz",
    emoji: "🥂",
    items: [
      {
        name: "Aperol Spritz",
        description: "Aperol, Sekt, Soda, Orange",
        sizes: [{ size: "0,2l", price: "7,20 €" }],
      },
      {
        name: "Sarti Spritz",
        description: "Sarti Rosa, Sekt, Soda, Orange",
        sizes: [{ size: "0,2l", price: "7,20 €" }],
      },
      {
        name: "Limoncello Spritz",
        description: "Limoncello, Sekt, Soda, Zitrone",
        sizes: [{ size: "0,2l", price: "7,20 €" }],
      },
      {
        name: "Lillet Blanc Spritz",
        description: "Lillet Blanc, Tonic, Limette, Gurke",
        sizes: [{ size: "0,2l", price: "7,60 €" }],
      },
      {
        name: "Lillet Blanc Spritz alkoholfrei",
        description: "Lillet Blanc 0%, Tonic, Limette, Gurke",
        sizes: [{ size: "0,2l", price: "7,60 €" }],
      },
      {
        name: "Mionetto Spritz alkoholfrei",
        description: "Mionetto Aperitivo 0%, Prosecco 0%, Soda",
        sizes: [{ size: "0,2l", price: "7,20 €" }],
      },
    ],
  },

  // ── 04 WEISSWEIN ─────────────────────────────
  {
    id: "weisswein",
    number: "02",
    title: "Weißwein, Franken",
    emoji: "🍷",
    items: [
      {
        name: "Hausschoppen Silvaner",
        description: "trocken, frisch & würzig",
        sizes: [{ size: "0,2l", price: "5,50 €" }],
      },
      {
        name: "Hausschoppen Silvaner gespritzt",
        description: "mit Sodenthaler Mineralwasser",
        sizes: [{ size: "0,2l", price: "4,50 €" }],
      },
      {
        name: "Silvaner trocken",
        origin: "Weingut Höflich, Franken",
        sizes: [{ size: "0,2l", price: "6,40 €" }],
      },
      {
        name: "Müller-Thurgau trocken",
        origin: "Weingut Giegerich, Franken",
        sizes: [{ size: "0,2l", price: "6,40 €" }],
      },
      {
        name: "Bacchus halbtrocken",
        origin: "Weingut Kapraun, Franken",
        sizes: [{ size: "0,2l", price: "6,40 €" }],
      },
    ],
  },

  // ── 05 ROTWEIN ───────────────────────────────
  {
    id: "rotwein",
    number: "03",
    title: "Rotwein, Franken",
    emoji: "🍷",
    items: [
      {
        name: "Hausschoppen Rotwein",
        description: "Domina trocken",
        sizes: [{ size: "0,2l", price: "5,50 €" }],
      },
      {
        name: "Spätburgunder trocken",
        origin: "Weingut Kilian",
        sizes: [{ size: "0,2l", price: "6,40 €" }],
      },
      {
        name: "Spitalschoppen rot",
        origin: "Bürgerspital Würzburg, trocken",
        sizes: [{ size: "0,2l", price: "6,40 €" }],
      },
      {
        name: "Regent trocken PIWI",
        description: "nachhaltig angebaut",
        origin: "Weingut Kapraun",
        sizes: [{ size: "0,2l", price: "6,40 €" }],
      },
    ],
  },

  // ── 06 SCHAUMWEIN & APFELWEIN ────────────────
  {
    id: "schaumwein",
    number: "04",
    title: "Schaumwein & Apfelwein",
    emoji: "🥂",
    items: [
      {
        name: "Aschaffenburgs Chardonnay brut",
        description: "Pfalz – feine Perlage, frisch & mineralisch",
        sizes: [{ size: "0,75l", price: "29,50 €" }],
      },
      {
        name: "Crémant de Loire brut",
        description: "Monmousseau, Loire, Frankreich – elegant & cremig",
        sizes: [{ size: "0,75l", price: "39,50 €" }],
      },
      {
        name: "StengerS Apfelwein",
        description: "naturtrüb, traditionell vergoren · Kelterei Stenger Hösbach",
        sizes: [
          { size: "0,25l", price: "3,20 €" },
          { size: "0,5l",  price: "4,70 €" },
        ],
      },
      {
        name: "StengerS Apfelwein gespritzt",
        description: "mit Sodenthaler Mineralwasser, leicht & erfrischend",
        sizes: [
          { size: "0,25l", price: "3,20 €" },
          { size: "0,5l",  price: "4,70 €" },
        ],
      },
    ],
  },

  // ── 07 SCHNÄPSE & LIKÖRE ─────────────────────
  {
    id: "schnaepse",
    number: "07",
    title: "Schnäpse & Liköre",
    emoji: "🥃",
    items: [
      { name: "Dirker Haselnuss regional",     abv: "40% vol",   description: "Destillerie Dirker",                       sizes: [{ size: "2cl", price: "4,20 €" }] },
      { name: "Fernet Branca",                 abv: "35% vol",   description: "Mailand, Kräuterlikör",                    sizes: [{ size: "2cl", price: "3,20 €" }] },
      { name: "Linie Aquavit",                 abv: "41,5% vol", description: "Norwegen, auf Seereise gereift",           sizes: [{ size: "2cl", price: "3,50 €" }] },
      { name: "Hirschkuss Kräuter",            abv: "38% vol",   description: "Bayern",                                   sizes: [{ size: "2cl", price: "3,50 €" }] },
      { name: "Grassl Blutwurz",               abv: "48% vol",   description: "Bayern, Kräuterschnaps",                  sizes: [{ size: "2cl", price: "3,20 €" }] },
      { name: "Wildsautropfen",                abv: "36% vol",   description: "Kräuterschnaps",                          sizes: [{ size: "2cl", price: "3,20 €" }] },
      { name: "Weis Obstler vom alten Lager",  abv: "38% vol",   description: "Weis Destillerie, fränkisch",             sizes: [{ size: "2cl", price: "3,20 €" }] },
      { name: "Weis Williams Christ",          abv: "40% vol",   description: "Weis Destillerie, Williamsbirne",         sizes: [{ size: "2cl", price: "3,20 €" }] },
      { name: "Prinz Alte Marille",            abv: "41% vol",   description: "Vorarlberg, Aprikosengeist",              sizes: [{ size: "2cl", price: "3,80 €" }] },
      { name: "Prinz Alte Hauszwetschke",      abv: "41% vol",   description: "Vorarlberg, Zwetschgenbrand",             sizes: [{ size: "2cl", price: "3,80 €" }] },
      { name: "637 Bierbrand Natur",           abv: undefined,   description: "Schwind Bräu, Aschaffenburg – klassisch & rein",        sizes: [{ size: "2cl", price: "4,20 €" }] },
      { name: "637 Bierbrand Holzfassgelagert",abv: undefined,   description: "Schwind Bräu, Aschaffenburg – im Eichenfass gereift",   sizes: [{ size: "2cl", price: "4,70 €" }] },
      { name: "St. Kilian Classic Odenwald",   abv: "46% vol",   description: "Single Malt, St. Kilian Distillers, Rüdenau – lokal",  sizes: [{ size: "2cl", price: "6,50 €" }] },
    ],
  },

  // ── 08 LONGDRINKS ────────────────────────────
  {
    id: "longdrinks",
    number: "09",
    title: "Longdrinks",
    emoji: "🍸",
    items: [
      { name: "Asbach Cola",   abv: "36%",   description: "Asbach 36%, 4cl, Sinalco Cola",                     price: "7,70 €" },
      { name: "Gin Tonic",     abv: "37,5%", description: "Gordon's Dry Gin 37,5%, 4cl, Schweppes Tonic",      price: "7,70 €" },
      { name: "Moscow Mule",   abv: "40%",   description: "Absolut Vodka 40%, 4cl, Ginger Beer, Limette",      price: "7,70 €" },
    ],
  },

  // ── 09 WASSER & SCHORLEN ─────────────────────
  {
    id: "wasser",
    number: "10",
    title: "Wasser & Schorlen",
    emoji: "💧",
    items: [
      {
        name: "Mineralwasser still",
        description: "Sodenthaler, Glasflasche",
        sizes: [
          { size: "0,25l", price: "2,30 €" },
          { size: "0,75l", price: "6,50 €" },
        ],
      },
      {
        name: "Mineralwasser Sprudel",
        description: "Sodenthaler, Glasflasche",
        sizes: [
          { size: "0,25l", price: "2,30 €" },
          { size: "0,75l", price: "6,50 €" },
        ],
      },
      {
        name: "Apfelschorle naturtrüb",
        description: "Kelterei Stenger Hösbach",
        sizes: [
          { size: "0,2l", price: "2,90 €" },
          { size: "0,4l", price: "4,10 €" },
        ],
      },
      {
        name: "Rhabarberschorle",
        description: "Kelterei Stenger Hösbach",
        sizes: [
          { size: "0,2l", price: "2,90 €" },
          { size: "0,4l", price: "4,10 €" },
        ],
      },
      {
        name: "Johannisbeerschorle",
        description: "Kelterei Stenger Hösbach",
        sizes: [
          { size: "0,2l", price: "2,90 €" },
          { size: "0,4l", price: "4,10 €" },
        ],
      },
      {
        name: "Maracujaschorle",
        description: "Kelterei Stenger Hösbach",
        sizes: [
          { size: "0,2l", price: "2,90 €" },
          { size: "0,4l", price: "4,10 €" },
        ],
      },
    ],
  },

  // ── 10 LIMONADEN ─────────────────────────────
  {
    id: "limo",
    number: "11",
    title: "Sinalco Limonaden",
    emoji: "🥤",
    items: [
      { name: "Cola",               sizes: [{ size: "0,2l", price: "3,00 €" }, { size: "0,4l", price: "4,00 €" }] },
      { name: "Cola Mix Spezi",     sizes: [{ size: "0,2l", price: "3,00 €" }, { size: "0,4l", price: "4,00 €" }] },
      { name: "Cola ohne Zucker",   sizes: [{ size: "0,2l", price: "3,00 €" }, { size: "0,4l", price: "4,00 €" }] },
      { name: "Limo gelb Zitrone",  sizes: [{ size: "0,2l", price: "3,00 €" }, { size: "0,4l", price: "4,00 €" }] },
      { name: "Limo weiß Citres",   sizes: [{ size: "0,2l", price: "3,00 €" }, { size: "0,4l", price: "4,00 €" }] },
    ],
  },

  // ── 11 SPEISEKARTE ────────────────────────────
  {
    id: "speise",
    number: "–",
    title: "Speisekarte",
    emoji: "🍽️",
    items: [
      { name: "Dreierlei Dips mit Brot",         description: "Kochkäse, Obazda, Grüne Soße, Sauerteigbrot",                      price: "8,90 €" },
      { name: "Flammkuchen Elsässer Art",         description: "mit Speck und Zwiebeln",                                            price: "10,90 €" },
      { name: "Flammkuchen Nordische Art",        description: "mit Lachs und Spinat",                                              price: "11,90 €" },
      { name: "Kleiner Vorspeisensalat",          description: undefined,                                                            price: "4,90 €" },
      { name: "Brezelknödeltaler",                description: "in Butter gebraten mit Pilzrahmsoße",                               price: "14,90 €" },
      { name: "1 Paar Wildbratwürste",            description: "mit Dunkelbiersoße, Sauerkraut und Kartoffelstampf",                price: "17,90 €" },
      { name: "Leberkäseburger",                  description: "mit gepickeltem Radi und süßem Senf",                               price: "14,90 €" },
      { name: "Brauhauspommes",                   description: undefined,                                                            price: "5,90 €" },
      { name: "Laugenbrezel",                     description: undefined,                                                            price: "2,20 €" },
      { name: "Affogato",                         description: undefined,                                                            price: "4,90 €" },
    ],
  },
];

// ── Nav pills config (ordered for display) ───

const NAV_ORDER = [
  { id: "fass",       emoji: "🍺", label: "Schwind vom Fass" },
  { id: "flasche",    emoji: "🍾", label: "Aus der Flasche" },
  { id: "aperitif",   emoji: "🥂", label: "Aperitif & Spritz" },
  { id: "weisswein",  emoji: "🍷", label: "Weißwein" },
  { id: "rotwein",    emoji: "🍷", label: "Rotwein" },
  { id: "schaumwein", emoji: "🥂", label: "Schaumwein & Apfelwein" },
  { id: "schnaepse",  emoji: "🥃", label: "Schnäpse" },
  { id: "longdrinks", emoji: "🍸", label: "Longdrinks" },
  { id: "wasser",     emoji: "💧", label: "Wasser & Schorlen" },
  { id: "limo",       emoji: "🥤", label: "Limonaden" },
  { id: "speise",     emoji: "🍽️", label: "Speisekarte" },
];

// ── Sub-components ────────────────────────────

function SizeChip({ size, price }: SizePrice) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text)] whitespace-nowrap">
      <span className="text-[var(--color-muted)] font-normal">{size}</span>
      <span>{price}</span>
    </span>
  );
}

function BeerCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 card-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[var(--color-brand-red)]">{item.name}</span>
          {item.badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-[var(--color-muted)] mt-0.5">{item.description}</p>
        )}
      </div>
      {item.sizes && item.sizes.length > 0 && (
        <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
          {item.sizes.map((s) => (
            <SizeChip key={s.size} {...s} />
          ))}
        </div>
      )}
      {item.price && (
        <span className="font-bold text-[var(--color-text)] whitespace-nowrap shrink-0">{item.price}</span>
      )}
    </div>
  );
}

function BierflightCard({ item }: { item: MenuItem }) {
  return (
    <div
      className="rounded-2xl p-5 text-white mb-4"
      style={{ background: "linear-gradient(135deg, #243040 0%, #1a2434 100%)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🍺</span>
            <span className="font-bold text-lg tracking-tight">Schwind Bierflight</span>
          </div>
          <p className="text-sm text-white/70 leading-snug">{item.description}</p>
          <p className="text-xs text-white/50 mt-1.5">4 × 0,1l</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-3xl font-bold text-amber-400">7,20 €</span>
        </div>
      </div>
    </div>
  );
}

function StandardCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 card-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[var(--color-brand-red)]">{item.name}</span>
          {item.abv && (
            <span className="text-[10px] font-medium text-[var(--color-muted)] bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded-full border border-[var(--color-border)]">
              {item.abv}
            </span>
          )}
          {item.badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-[var(--color-muted)] mt-0.5 leading-snug">{item.description}</p>
        )}
        {item.origin && (
          <span className="inline-block mt-1 text-[10px] font-medium text-[var(--color-brand)] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
            {item.origin}
          </span>
        )}
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        {item.sizes && item.sizes.length > 0 && (
          <div className="flex gap-1.5 flex-wrap justify-end">
            {item.sizes.map((s) => (
              <SizeChip key={s.size} {...s} />
            ))}
          </div>
        )}
        {item.price && (
          <span className="font-bold text-[var(--color-text)] whitespace-nowrap">{item.price}</span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ section }: { section: MenuSection }) {
  const isFass = section.id === "fass";
  if (isFass) {
    return (
      <div
        className="rounded-2xl px-5 py-4 mb-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #243040 0%, #1e2c3c 100%)" }}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5">
            Schwindbräu
          </p>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {section.emoji} {section.title}
          </h2>
        </div>
        <span className="text-4xl font-black text-white/10 select-none leading-none">{section.number}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-2">
      <h2 className="text-base font-bold text-[var(--color-brand)]">
        {section.emoji} {section.title}
      </h2>
      <span className="text-sm font-bold text-[var(--color-muted-light)]">{section.number}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────

export default function MenuPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-12" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>

      {/* ── Page header ── */}
      <div className="pt-8 pb-5 text-center">
        <h1
          className="text-3xl font-black tracking-tight leading-none"
          style={{ color: "var(--color-brand)" }}
        >
          SCHWIND
        </h1>
        <p
          className="text-base font-semibold tracking-[0.25em] uppercase mt-0.5"
          style={{ color: "var(--color-brand-red)" }}
        >
          AM DALBERG
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-2">Getränke- und Speisekarte</p>
      </div>

      {/* ── Sticky category nav ── */}
      <div
        className="sticky top-0 z-10 -mx-4 px-4 pb-3 pt-2"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {NAV_ORDER.map((n) => (
            <a
              key={n.id}
              href={`#section-${n.id}`}
              className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors flex-shrink-0"
            >
              {n.emoji} {n.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.id} id={`section-${section.id}`} className="scroll-mt-20">
            <SectionHeader section={section} />

            <div className="space-y-2">
              {section.items.map((item) => {
                if (item.featured) {
                  return <BierflightCard key={item.name} item={item} />;
                }
                if (section.id === "fass") {
                  return <BeerCard key={item.name} item={item} />;
                }
                return <StandardCard key={item.name} item={item} />;
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-12 text-center space-y-1 border-t border-[var(--color-border)] pt-6">
        <p className="text-xs text-[var(--color-muted)]">
          Alle Preise inkl. MwSt. · Änderungen vorbehalten
        </p>
        <p className="text-xs font-semibold" style={{ color: "var(--color-brand)" }}>
          SCHWIND AM DALBERG · Erlenbach am Main
        </p>
        <p className="text-[10px] text-[var(--color-muted)] opacity-70 mt-2">
          Allergene auf Anfrage beim Personal · Irrtümer vorbehalten
        </p>
      </footer>
    </div>
  );
}
