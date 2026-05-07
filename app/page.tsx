import { isOpenNow, getTodayOpeningHours } from "@/lib/utils/time";
import { Clock, MapPin, Phone, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { NewsFeed } from "@/components/news/NewsFeed";
import { DailyCheckIn } from "@/components/loyalty/DailyCheckIn";
import type { NewsPost } from "@/components/news/NewsCard";

const DEMO_POSTS: NewsPost[] = [
  {
    id: "1",
    title: "Frühschoppen jeden Sonntag ab 10 Uhr",
    content:
      "Starte den Sonntag mit einem frischen Schwindbräu Helles beim gemütlichen Frühschoppen. Live-Musik am ersten Sonntag des Monats. Stammgäste sammeln doppelte Treuepunkte.",
    image_url: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80",
    type: "event",
    pinned: true,
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Saisonbier Maibock ist da",
    content:
      "Unser Maibock 2026 ist fertig gebraut und bereit zum Zapfen. Würzig, malzig, 6,5% – typisch Schwindbräu. Begrenztes Kontingent.",
    image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
    type: "special",
    pinned: false,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Champions League live auf der großen Leinwand",
    content:
      "Alle UEFA Champions League Spiele live bei uns. Freie Plätze können nicht reserviert werden – einfach vorbeikommen.",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    type: "sport",
    pinned: false,
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Treuepunkte-App jetzt online",
    content:
      "Sammle bei jedem Bierkauf Treuepunkte und steige zum Stammgast, Bierkenner oder sogar Braumeister auf. Registriere dich jetzt und starte mit 30 Willkommenspunkten.",
    image_url: null,
    type: "general",
    pinned: false,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function fetchData() {
  const open = isOpenNow();
  const hours = getTodayOpeningHours();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { posts: DEMO_POSTS, open, hours, user: null, profile: null };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const [{ data: { user } }, postsRes] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("news_posts")
        .select("*")
        .order("pinned", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(20),
    ]);

    let profile = null;
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("name, points, level")
        .eq("id", user.id)
        .single();
      profile = data;
    }

    const posts = postsRes.data?.length ? (postsRes.data as NewsPost[]) : DEMO_POSTS;
    return { posts, open, hours, user, profile };
  } catch {
    return { posts: DEMO_POSTS, open, hours, user: null, profile: null };
  }
}

const UPCOMING_EVENTS = [
  { title: "Frühschoppen", sub: "Jeden Sonntag · ab 10 Uhr", date: "So", href: "/events" },
  { title: "Maibock-Anstich", sub: "Sa, 17. Mai 2026 · 15:00 Uhr", date: "17.5", href: "/events" },
  { title: "Brauereiführung", sub: "Sa, 24. Mai 2026 · 10:00 Uhr", date: "24.5", href: "/events" },
];

export default async function HomePage() {
  const { posts, open, hours, profile } = await fetchData();

  const firstName = profile?.name?.split(" ")[0] ?? null;
  const greeting = firstName ? `Hallo, ${firstName}` : "Hallo, lieber Gast";

  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="flex-1 app-scroll">

        {/* ── Hero / Greeting ── */}
        <div className="relative bg-[var(--color-deep)] overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&q=80"
              alt="Brauerei Atmosphäre"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="relative max-w-2xl mx-auto px-5 pt-8 pb-7 flex flex-col gap-5">
            {/* Logo + Brand */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.svg"
                alt="SCHWIND AM DALBERG"
                width={52}
                height={32}
                className="drop-shadow-lg opacity-90"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/90">SCHWIND</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-white/50">AM DALBERG</span>
              </div>
              <div className="ml-auto">
                <span
                  className={[
                    "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full",
                    open
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-white/8 text-white/50 border border-white/15",
                  ].join(" ")}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
                  {open ? "Geöffnet" : "Geschlossen"}
                </span>
              </div>
            </div>

            {/* Greeting + Points */}
            <div className="space-y-1">
              <p className="text-white/50 text-sm">{greeting}</p>
              {profile ? (
                <Link href="/loyalty" className="flex items-baseline gap-2 group">
                  <span className="text-4xl font-black text-white tracking-tight leading-none group-hover:opacity-90 transition-opacity">
                    {profile.points.toLocaleString("de-DE")}
                  </span>
                  <span className="text-sm text-white/50 font-medium">Treuepunkte</span>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </Link>
              ) : (
                <div className="flex items-baseline gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-white/70 underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Anmelden für Treuepunkte
                  </Link>
                </div>
              )}
            </div>

            {/* Opening hours strip */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Heute: <span className="text-white/65">{hours}</span></span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-7">

          {/* Daily check-in */}
          <DailyCheckIn />

          {/* ── Aktuelle Angebote ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--color-text)]">Aktuelle Angebote</h2>
            </div>
            <div className="space-y-2.5">
              {posts
                .filter((p) => p.type === "special" || p.pinned)
                .slice(0, 3)
                .map((post) => (
                  <div
                    key={post.id}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden card-shadow"
                  >
                    {post.image_url && (
                      <div className="relative h-36 w-full">
                        <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="px-4 py-3 space-y-1">
                      <p className="font-semibold text-sm text-[var(--color-text)]">{post.title}</p>
                      <p className="text-xs text-[var(--color-muted)] line-clamp-2">{post.content}</p>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* ── Nächste Events ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--color-text)]">Nächste Events</h2>
              <Link href="/events" className="text-xs text-[var(--color-muted)] font-medium flex items-center gap-0.5 hover:text-[var(--color-text)] transition-colors">
                Alle <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {UPCOMING_EVENTS.map((e) => (
                <Link key={e.title} href={e.href}>
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-[var(--color-deep)]/30 transition-colors card-shadow">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-deep)] flex items-center justify-center shrink-0">
                      <Calendar className="w-4.5 h-4.5 text-white/70" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[var(--color-text)]">{e.title}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate">{e.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-border)] shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="h-px bg-[var(--color-border)]" />

          {/* ── Neuigkeiten ── */}
          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-3">Neuigkeiten</h2>
            <NewsFeed posts={posts} />
          </section>

          <div className="h-px bg-[var(--color-border)]" />

          {/* ── Kontakt ── */}
          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-3">Besuche uns</h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4 card-shadow">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--color-muted)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    <span style={{ color: "var(--color-brand)" }}>SCHWIND</span>{" "}
                    <span style={{ color: "var(--color-brand-red)" }}>AM DALBERG</span>
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">Am Streitberg 28 · 63906 Erlenbach am Main</p>
                  <a
                    href="https://maps.google.com/?q=Am+Streitberg+28,+63906+Erlenbach+am+Main"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-accent)] hover:underline mt-0.5 inline-block"
                  >
                    In Google Maps öffnen
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
                <p className="text-sm text-[var(--color-muted)]">{hours}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--color-muted)] shrink-0" />
                <a href="tel:+4916095757167" className="text-sm text-[var(--color-text)] hover:underline">
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
