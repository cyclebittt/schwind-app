export const dynamic = "force-dynamic";

import { isOpenNow, getTodayOpeningHours } from "@/lib/utils/time";
import { ChevronRight, MapPin, Phone, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { DailyCheckIn } from "@/components/loyalty/DailyCheckIn";
import type { NewsPost } from "@/components/news/NewsCard";

const FREE_BEER_THRESHOLD = 50;

const DEMO_POSTS: NewsPost[] = [
  {
    id: "1",
    title: "Frühschoppen jeden Sonntag ab 10 Uhr",
    content: "Starte den Sonntag mit einem frischen Schwindbräu Helles. Live-Musik am ersten Sonntag des Monats. Stammgäste sammeln doppelte Treuepunkte.",
    image_url: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80",
    type: "event",
    pinned: true,
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Saisonbier Maibock ist da",
    content: "Unser Maibock 2026 ist fertig gebraut. Würzig, malzig, 6,5% – typisch Schwindbräu. Begrenztes Kontingent.",
    image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80",
    type: "special",
    pinned: false,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Champions League live auf der großen Leinwand",
    content: "Alle UEFA Champions League Spiele live bei uns. Freie Plätze können nicht reserviert werden.",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    type: "sport",
    pinned: false,
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const RECENT_ACTIVITY = [
  { label: "Schwindbräu Helles · 0,5l", sub: "Heute · 19:42", points: "+15", iconClass: "icon-badge gold" },
  { label: "Tisch reserviert · 14. März",  sub: "Gestern · 11:08", points: "+8",  iconClass: "icon-badge crimson" },
  { label: "Daily Check-in · Tag 5",       sub: "Mo · 08:14",      points: "+5",  iconClass: "icon-badge cream" },
];

const UPCOMING_EVENTS = [
  { title: "Frühschoppen",       sub: "Jeden Sonntag · ab 10 Uhr",          href: "/events" },
  { title: "Maibock-Anstich",    sub: "Sa, 17. Mai 2026 · 15:00 Uhr",       href: "/events" },
  { title: "Brauereiführung",    sub: "Sa, 24. Mai 2026 · 10:00 Uhr · +30 Pkt.", href: "/events" },
];

async function fetchData() {
  const open = isOpenNow();
  const hours = getTodayOpeningHours();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { posts: DEMO_POSTS, open, hours, profile: null };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const [{ data: { user } }, postsRes] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("news_posts").select("*")
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
    return { posts, open, hours, profile };
  } catch {
    return { posts: DEMO_POSTS, open, hours: getTodayOpeningHours(), profile: null };
  }
}

export default async function HomePage() {
  const { posts, open, hours, profile } = await fetchData();

  const firstName = profile?.name?.split(" ")[0] ?? null;
  const pts = profile?.points ?? 0;
  const nextThreshold = Math.ceil((pts + 1) / FREE_BEER_THRESHOLD) * FREE_BEER_THRESHOLD;
  const ptsToNextBeer = nextThreshold - pts;
  const progressPct = ((pts % FREE_BEER_THRESHOLD) / FREE_BEER_THRESHOLD) * 100;

  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="flex-1 app-scroll">

        {/* ── Greeting ── */}
        <div className="section" style={{ paddingTop: 16 }}>
          <div className="flex items-center justify-between mb-1">
            <p className="eyebrow">
              {open ? "Geöffnet · " + hours : "Geschlossen"}
            </p>
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase"
              style={{
                fontFamily: "var(--font-narrow), 'Archivo Narrow', sans-serif",
                letterSpacing: "0.14em",
                background: open ? "rgba(22,163,74,0.10)" : "rgba(26,24,20,0.06)",
                color: open ? "#16A34A" : "var(--ios-tertiary)",
                border: `1px solid ${open ? "rgba(22,163,74,0.2)" : "rgba(26,24,20,0.10)"}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: open ? "#16A34A" : "var(--ios-tertiary)" }}
              />
              {open ? "Jetzt geöffnet" : "Geschlossen"}
            </span>
          </div>

          <h1 className="large-title" style={{ marginTop: 6 }}>
            {firstName ? (
              <>Hallo, <span style={{ color: "var(--crimson)" }}>{firstName}</span></>
            ) : (
              "Stammtisch."
            )}
          </h1>
          <p className="subtitle">
            {firstName ? "Schön dass du wieder da bist." : "Willkommen bei Schwind am Dalberg."}
          </p>
        </div>

        {/* ── Member card ── */}
        {profile ? (
          <div className="section" style={{ paddingTop: 4 }}>
            <Link href="/loyalty" className="block">
              <div
                className="relative overflow-hidden rounded-[22px] text-white select-none member-card-bg"
                style={{ padding: "22px 22px 24px" }}
              >
                <div className="noise-overlay" aria-hidden />

                {/* Header */}
                <div className="relative flex items-start justify-between mb-5">
                  <div style={{ fontFamily: "var(--font-narrow), 'Archivo Narrow', sans-serif", lineHeight: 1 }}>
                    <div className="text-[13px] font-extrabold tracking-[0.12em] uppercase text-white">SCHWIND</div>
                    <div className="text-[9px] font-bold tracking-[0.22em] uppercase mt-0.5" style={{ color: "var(--gold)" }}>Am Dalberg</div>
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: "var(--font-narrow), sans-serif",
                      background: "rgba(200,146,10,0.20)",
                      border: "1px solid rgba(200,146,10,0.35)",
                      color: "var(--gold-soft)",
                    }}
                  >
                    {profile.level === "gold" ? "Braumeister" : profile.level === "silver" ? "Bierkenner" : "Stammgast"}
                  </span>
                </div>

                {/* Points + last tap */}
                <div className="relative flex items-flex-end gap-3 mb-5">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-white/50" style={{ fontFamily: "var(--font-narrow), sans-serif", margin: 0 }}>Treuepunkte</p>
                    <p className="num-display text-white" style={{ fontSize: 64, marginTop: 4 }}>
                      {pts.toLocaleString("de-DE")}
                    </p>
                  </div>
                  <p className="text-xs text-white/50 text-right leading-snug ml-auto self-end mb-2">
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>Noch {ptsToNextBeer} Pkt.</span><br />
                    bis Freibier
                  </p>
                </div>

                {/* Progress */}
                <div className="relative">
                  <div className="progress"><div className="fill" style={{ width: `${progressPct}%` }} /></div>
                  <div
                    className="flex justify-between mt-2 text-white/40 text-[11px]"
                    style={{ fontFamily: "var(--font-narrow), sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}
                  >
                    <span>{pts} / {nextThreshold} Pkt.</span>
                    <span>→ Nächste Prämie</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          /* ── Unauthenticated CTA ── */
          <div className="section" style={{ paddingTop: 4 }}>
            <div
              className="relative overflow-hidden rounded-[22px] text-white member-card-bg"
              style={{ padding: "22px 22px 24px" }}
            >
              <div className="noise-overlay" aria-hidden />
              <div className="relative">
                <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-white/50 mb-3" style={{ fontFamily: "var(--font-narrow), sans-serif" }}>
                  Schwind Loyalty
                </p>
                <h2 className="text-2xl font-extrabold text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
                  Punkte sammeln,<br />Prämien genießen.
                </h2>
                <p className="text-sm text-white/55 mb-5">Kostenlos anmelden und sofort 30 Willkommenspunkte erhalten.</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-white text-[var(--navy)] text-sm font-bold px-5 py-2.5 rounded-xl"
                >
                  Jetzt anmelden
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Quick actions ── */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/reserve">
              <div className="bg-white rounded-[18px] p-4 flex flex-col gap-3 card-shadow active:scale-[0.98] transition-transform">
                <div className="icon-badge crimson w-10 h-10 rounded-xl">
                  <svg className="i" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2"/>
                    <path d="M3 10h18M8 3v4M16 3v4"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>Tisch reservieren</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>+8 Pkt. pro Buchung</p>
                </div>
              </div>
            </Link>
            <Link href="/loyalty">
              <div className="bg-white rounded-[18px] p-4 flex flex-col gap-3 card-shadow active:scale-[0.98] transition-transform">
                <div className="icon-badge gold w-10 h-10 rounded-xl">
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--ink)" }}>Prämien einlösen</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>4 verfügbar</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Daily check-in ── */}
        <div className="section" style={{ paddingTop: 0 }}>
          <DailyCheckIn />
        </div>

        {/* ── Nächste Events ── */}
        <div>
          <span className="section-label">Nächste Events</span>
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="ios-card">
              {UPCOMING_EVENTS.map((e, i) => (
                <Link key={i} href={e.href} className="block">
                  <div className="ios-row">
                    <div className="icon-badge crimson" style={{ width: 36, height: 36, borderRadius: 10 }}>
                      <svg className="i sm" viewBox="0 0 24 24">
                        <rect x="3" y="5" width="18" height="16" rx="2"/>
                        <path d="M3 10h18M8 3v4M16 3v4"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: "var(--ink)", margin: 0 }}>{e.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)", margin: 0 }}>{e.sub}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--ios-tertiary)", flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Letzte Aktivität ── */}
        <div>
          <span className="section-label">Letzte Aktivität</span>
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="ios-card">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="ios-row">
                  <div className={`${a.iconClass} w-9 h-9 rounded-[10px]`}>
                    <svg className="i sm" viewBox="0 0 24 24">
                      {i === 0 && <path d="M6 4h12v6a6 6 0 0 1-12 0z M6 7H3v2a3 3 0 0 0 3 3M18 7h3v2a3 3 0 0 1-3 3M9 22h6"/>}
                      {i === 1 && <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/></>}
                      {i === 2 && <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--ink)", margin: 0 }}>{a.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)", margin: 0 }}>{a.sub}</p>
                  </div>
                  <span className="font-extrabold text-sm" style={{ fontFamily: "var(--font-display), sans-serif", color: "#16A34A" }}>{a.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Neuigkeiten ── */}
        <div>
          <span className="section-label">Neuigkeiten</span>
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="flex flex-col gap-3">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="tile-card card-shadow overflow-hidden">
                  {post.image_url && (
                    <div className="relative h-32 w-full">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="eyebrow mb-1">{post.type}</p>
                    <h3 className="font-extrabold text-[15px] leading-snug" style={{ fontFamily: "var(--font-display), sans-serif", color: "var(--ink)", letterSpacing: "-0.015em" }}>{post.title}</h3>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--ios-secondary)" }}>{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kontakt ── */}
        <div>
          <span className="section-label">Besuche uns</span>
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="ios-card">
              <div className="ios-row">
                <div className="icon-badge cream" style={{ width: 36, height: 36, borderRadius: 10 }}>
                  <MapPin size={16} style={{ color: "var(--navy)" }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--ink)", margin: 0 }}>Am Streitberg 28 · 63906 Erlenbach am Main</p>
                  <a href="https://maps.google.com/?q=Am+Streitberg+28,+63906+Erlenbach+am+Main" target="_blank" rel="noopener noreferrer" className="text-[11px]" style={{ color: "var(--crimson)" }}>In Google Maps öffnen</a>
                </div>
              </div>
              <div className="ios-row">
                <div className="icon-badge cream" style={{ width: 36, height: 36, borderRadius: 10 }}>
                  <Clock size={16} style={{ color: "var(--navy)" }} />
                </div>
                <p className="text-sm flex-1" style={{ color: "var(--ios-secondary)", margin: 0 }}>{hours}</p>
              </div>
              <div className="ios-row">
                <div className="icon-badge cream" style={{ width: 36, height: 36, borderRadius: 10 }}>
                  <Phone size={16} style={{ color: "var(--navy)" }} />
                </div>
                <a href="tel:+4916095757167" className="text-sm font-semibold" style={{ color: "var(--ink)" }}>0160 95757167</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 32 }} />
      </main>
      <BottomNav />
    </div>
  );
}
