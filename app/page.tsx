import { isOpenNow, getTodayOpeningHours } from "@/lib/utils/time";
import { Clock, Calendar, UtensilsCrossed, Beer, MapPin, Phone, PartyPopper, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import { HomeLoyaltyWidget } from "@/components/loyalty/HomeLoyaltyWidget";
import { DailyCheckIn } from "@/components/loyalty/DailyCheckIn";
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
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="flex-1 app-scroll">

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

          {/* Daily check-in */}
          <DailyCheckIn />

          {/* Loyalty widget – shows card for logged-in users, teaser for guests */}
          <HomeLoyaltyWidget />

          <div className="border-t border-[var(--color-border)]" />

          {/* Upcoming events preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--color-text)]">Nächste Events</h2>
              <Link href="/events" className="text-sm text-[var(--color-accent)] font-medium hover:underline flex items-center gap-1">
                Alle anzeigen <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: "🍻", title: "Frühschoppen", sub: "Jeden Sonntag ab 10 Uhr · Live-Musik am 1. Sonntag", href: "/events" },
                { icon: "🏆", title: "Maibock-Anstich", sub: "Sa, 17. Mai 2026 · 15:00 Uhr · Reservierung empfohlen", href: "/events" },
                { icon: "🏟️", title: "Brauereiführung", sub: "Sa, 24. Mai 2026 · 10:00 Uhr · +30 Treuepunkte", href: "/events" },
              ].map((e) => (
                <Link key={e.title} href={e.href}>
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[var(--color-accent)] transition-colors card-shadow">
                    <span className="text-xl">{e.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-text)] text-sm">{e.title}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate">{e.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="border-t border-[var(--color-border)]" />

          {/* News */}
          <section>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-5">Aktuelles & Neuigkeiten</h2>
            <NewsFeed posts={posts} />
          </section>

          <div className="border-t border-[var(--color-border)]" />

          {/* Kontakt & Info */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Besuche uns</h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4 card-shadow">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">SCHWIND Bräu</p>
                  <p className="text-sm text-[var(--color-muted)]">Am Streitberg 28 · 63906 Erlenbach am Main</p>
                  <a
                    href="https://maps.google.com/?q=Am+Streitberg+28,+63906+Erlenbach+am+Main"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-accent)] hover:underline mt-0.5 inline-block"
                  >
                    In Google Maps öffnen →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <div className="text-sm text-[var(--color-muted)]">
                  <span className="font-medium text-[var(--color-text)]">Öffnungszeiten:</span>{" "}
                  {hours}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <a href="tel:+4916095757167" className="text-sm text-[var(--color-accent)] hover:underline">
                  0160 95757167
                </a>
              </div>
            </div>
          </section>
        </div>
        <div className="h-24 md:h-0" />
      </main>
      <BottomNav />
    </div>
  );
}
