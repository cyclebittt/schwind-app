import { isOpenNow, getTodayOpeningHours } from "@/lib/utils/time";
import { Clock, Calendar, UtensilsCrossed, Beer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import type { NewsPost } from "@/components/news/NewsCard";

const DEMO_POSTS: NewsPost[] = [
  {
    id: "1",
    title: "Frühschoppen jeden Sonntag ab 10 Uhr",
    content:
      "Starte den Sonntag mit einem frischen Schwindbräu Helles beim gemütlichen Frühschoppen. Live-Musik am ersten Sonntag des Monats. Stammgäste sammeln doppelte Treuepunkte!",
    image_url: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80",
    type: "event",
    pinned: true,
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Neu: Saisonbier Maibock ist da!",
    content:
      "Unser Maibock 2026 ist fertig gebraut und bereit zum Zapfen. Würzig, malzig, 6,5% – typisch Schwindbräu. Begrenztes Kontingent – komm vorbei solange der Vorrat reicht.",
    image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
    type: "special",
    pinned: false,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Champions League live auf der großen Leinwand",
    content:
      "Alle UEFA Champions League Spiele live bei uns. Freie Plätze können nicht reserviert werden – einfach vorbeikommen und Platz nehmen. Natürlich mit Schwindbräu vom Fass.",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    type: "sport",
    pinned: false,
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Treuepunkte-App jetzt online!",
    content:
      "Sammle bei jedem Bierkauf Treuepunkte und steige zum Stammgast, Bierkenner oder sogar Braumeister auf! Registriere dich jetzt und starte direkt mit 30 Willkommenspunkten.",
    image_url: null,
    type: "general",
    pinned: false,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function fetchPosts(): Promise<NewsPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return DEMO_POSTS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(20);
    return data?.length ? (data as NewsPost[]) : DEMO_POSTS;
  } catch { return DEMO_POSTS; }
}

export default async function HomePage() {
  const posts = await fetchPosts();
  const open = isOpenNow();
  const hours = getTodayOpeningHours();

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">

        {/* Hero */}
        <div className="relative bg-[#1A0E00] overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&q=80"
              alt="Brauerei Atmosphäre"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="relative max-w-2xl mx-auto px-6 py-12 flex flex-col items-center text-center gap-5">
            <Image
              src="/logo.svg"
              alt="SCHWIND Bräu"
              width={180}
              height={111}
              className="drop-shadow-2xl"
              priority
            />
            <p className="text-white/80 text-sm tracking-wide uppercase">Brauerei & Gaststätte</p>
            <div
              className={[
                "inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full",
                open
                  ? "bg-green-500/20 text-green-300 border border-green-500/40"
                  : "bg-white/10 text-white/60 border border-white/20",
              ].join(" ")}
            >
              <span className={`w-2 h-2 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-white/40"}`} />
              {open ? "Heute geöffnet" : "Aktuell geschlossen"}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

          {/* Info + Quick Actions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] bg-white border border-[var(--color-border)] rounded-xl px-4 py-3 w-fit card-shadow">
              <Clock className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Heute: <strong className="text-[var(--color-text)]">{hours}</strong></span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/loyalty">
                <Button size="md" className="gap-2">
                  <Beer className="w-4 h-4" />
                  Treuepunkte
                </Button>
              </Link>
              <Link href="/reserve">
                <Button size="md" variant="secondary" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Tisch reservieren
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="md" variant="secondary" className="gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  Speisekarte
                </Button>
              </Link>
            </div>
          </section>

          {/* Treuepunkte-Teaser */}
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🍺</div>
              <div className="space-y-1">
                <h2 className="font-bold text-[var(--color-text)]">Sammle Punkte mit jedem Bier</h2>
                <p className="text-sm text-[var(--color-muted)]">
                  Vom Stammgast zum Braumeister: Jeder Bierkauf bringt dir Treuepunkte. Löse sie gegen Freigetränke, Brauerei-Touren und mehr ein.
                </p>
                <Link href="/login" className="inline-block mt-2 text-sm font-semibold text-[var(--color-accent)] hover:underline">
                  Jetzt registrieren →
                </Link>
              </div>
            </div>
          </section>

          <div className="border-t border-[var(--color-border)]" />

          {/* News */}
          <section>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-5">Aktuelles & Neuigkeiten</h2>
            <NewsFeed posts={posts} />
          </section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
