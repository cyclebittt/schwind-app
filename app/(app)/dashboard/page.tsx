import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MemberCard } from "@/components/loyalty/MemberCard";
import { formatDateTime } from "@/lib/utils/time";
import type { Level } from "@/lib/utils/points";

const statusLabels: Record<string, string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  cancelled: "Storniert",
};

const statusStyle: Record<string, { background: string; color: string }> = {
  pending:   { background: "rgba(217,119,6,0.10)",  color: "#D97706" },
  confirmed: { background: "rgba(22,163,74,0.10)",  color: "#16A34A" },
  cancelled: { background: "rgba(220,38,38,0.10)",  color: "#DC2626" },
};

// Reason → icon badge variant
function txIconStyle(reason: string): { bg: string; color: string } {
  if (reason.toLowerCase().includes("reservi"))
    return { bg: "rgba(139,26,42,0.10)", color: "var(--color-accent)" };
  if (reason.toLowerCase().includes("check"))
    return { bg: "var(--color-cream, #F2EEE5)", color: "var(--color-deep)" };
  return { bg: "rgba(200,146,10,0.14)", color: "var(--color-gold-2)" };
}

// Inline SVG icons (no lucide dep in server component needed)
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 10h18M8 3v4M16 3v4"/>
    </svg>
  );
}
function IconBeer() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="3" height="18" rx="0.5"/>
      <rect x="11" y="3" width="3" height="18" rx="0.5"/>
      <path d="M9 3h5v6a3 3 0 0 1-5 0z"/>
      <path d="M14 7h3v3a2 2 0 0 1-3 0"/>
    </svg>
  );
}
function IconBeerMug() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v6a6 6 0 0 1-12 0z"/>
      <path d="M6 7H3v2a3 3 0 0 0 3 3M18 7h3v2a3 3 0 0 1-3 3M9 22h6"/>
    </svg>
  );
}
function IconCalSm() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 10h18"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, reservationsRes, txRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("table_reservations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const profile = profileRes.data;
  const reservations = reservationsRes.data ?? [];
  const transactions = txRes.data ?? [];
  const nextReservation = reservations[0] ?? null;
  const firstName = profile?.name?.split(" ")[0] ?? "Gast";

  return (
    <div className="max-w-lg mx-auto px-4 space-y-0 pb-6">

      {/* ── Greeting ── */}
      <div className="pt-6 pb-4 px-0">
        <div className="flex items-center justify-between mb-1">
          <p className="eyebrow">Moin, {firstName}</p>
        </div>
        <h1
          className="text-[34px] leading-none mb-1"
          style={{
            fontFamily: "var(--font-archivo, 'Archivo', sans-serif)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--color-text)",
          }}
        >
          {profile?.name ? (
            <>
              {profile.name.split(" ")[0]}{" "}
              <span style={{ color: "var(--color-accent)" }}>
                {profile.name.split(" ").slice(1).join(" ") || ""}
              </span>
            </>
          ) : (
            <span style={{ color: "var(--color-accent)" }}>Stammgast</span>
          )}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Schön dass du wieder da bist.
        </p>
      </div>

      {/* ── Member card (compact peek) ── */}
      <div className="pb-4">
        <Link href="/loyalty">
          <MemberCard
            points={profile?.points ?? 0}
            level={(profile?.level ?? "bronze") as Level}
            name={profile?.name ?? ""}
            compact
            userId={user.id}
          />
        </Link>
      </div>

      {/* ── Quick actions ── */}
      <div className="pb-4 grid grid-cols-2 gap-2.5">
        <Link href="/reserve">
          <div
            className="bg-[var(--color-surface)] rounded-[18px] p-4 flex flex-col gap-3.5 active:scale-[0.97] transition-transform"
            style={{ boxShadow: "0 1px 3px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.05)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(139,26,42,0.10)", color: "var(--color-accent)" }}
            >
              <IconCalendar />
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--color-text)]">Tisch reservieren</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>+8 Pkt. pro Buchung</p>
            </div>
          </div>
        </Link>
        <Link href="/loyalty">
          <div
            className="bg-[var(--color-surface)] rounded-[18px] p-4 flex flex-col gap-3.5 active:scale-[0.97] transition-transform"
            style={{ boxShadow: "0 1px 3px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.05)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(200,146,10,0.14)", color: "var(--color-gold-2)" }}
            >
              <IconBeer />
            </div>
            <div>
              <p className="font-bold text-sm text-[var(--color-text)]">Prämien einlösen</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                {profile?.points ?? 0} Punkte verfügbar
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Next reservation ── */}
      {nextReservation && (
        <div className="pb-4">
          <p className="section-label mb-2">Deine nächste Reservierung</p>
          <Link href="/reserve">
            <div
              className="bg-[var(--color-surface)] rounded-[18px] p-3.5 flex items-center gap-3.5 active:scale-[0.98] transition-transform"
              style={{ boxShadow: "0 1px 3px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.05)" }}
            >
              {/* Date pill */}
              <div
                className="w-[54px] shrink-0 text-center py-2 rounded-xl"
                style={{ background: "var(--color-cream, #F2EEE5)" }}
              >
                <p
                  className="text-[9px] font-bold tracking-[0.18em] uppercase"
                  style={{ fontFamily: "var(--font-archivo-narrow, sans-serif)", color: "var(--color-accent)" }}
                >
                  {nextReservation.date
                    ? new Date(nextReservation.date).toLocaleDateString("de-DE", { weekday: "short" })
                    : "—"}
                </p>
                <p
                  className="text-[22px] font-black leading-none"
                  style={{ fontFamily: "var(--font-archivo, sans-serif)", color: "var(--color-text)" }}
                >
                  {nextReservation.date ? new Date(nextReservation.date).getDate() : "—"}
                </p>
                <p
                  className="text-[9px] font-semibold tracking-[0.16em] uppercase"
                  style={{ fontFamily: "var(--font-archivo-narrow, sans-serif)", color: "var(--color-muted)" }}
                >
                  {nextReservation.date
                    ? new Date(nextReservation.date).toLocaleDateString("de-DE", { month: "short" })
                    : ""}
                </p>
              </div>
              {/* Info */}
              <div className="flex-1">
                <p className="font-bold text-sm text-[var(--color-text)]">
                  {nextReservation.party_size} Personen
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {nextReservation.time} Uhr
                </p>
              </div>
              {/* Status badge */}
              <span
                className="text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  fontFamily: "var(--font-archivo-narrow, sans-serif)",
                  ...(statusStyle[nextReservation.status] ?? { background: "var(--color-cream)", color: "var(--color-muted)" }),
                }}
              >
                {statusLabels[nextReservation.status] ?? nextReservation.status}
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* ── Recent activity ── */}
      {transactions.length > 0 && (
        <div className="pb-4">
          <p className="section-label mb-2">Letzte Aktivität</p>
          <div
            className="bg-[var(--color-surface)] rounded-[18px] overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.05)" }}
          >
            {transactions.map((tx, i) => {
              const icon = txIconStyle(tx.reason ?? "");
              const isLast = i === transactions.length - 1;
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{
                    borderTop: i === 0 ? "none" : "0.5px solid rgba(60,60,67,0.12)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: icon.bg, color: icon.color }}
                  >
                    {(tx.reason ?? "").toLowerCase().includes("reservi") ? (
                      <IconCalSm />
                    ) : (tx.reason ?? "").toLowerCase().includes("check") ? (
                      <IconClock />
                    ) : (
                      <IconBeerMug />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {tx.reason ?? "Punkte"}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {formatDateTime(tx.created_at)}
                    </p>
                  </div>
                  <span
                    className="text-sm font-extrabold tabular-nums"
                    style={{
                      fontFamily: "var(--font-archivo, sans-serif)",
                      color: tx.amount >= 0 ? "#16A34A" : "var(--color-danger)",
                    }}
                  >
                    {tx.amount >= 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {transactions.length === 0 && reservations.length === 0 && (
        <div className="text-center py-10 space-y-2">
          <p className="text-3xl">🍺</p>
          <p className="text-sm font-semibold text-[var(--color-text)]">Noch keine Aktivität</p>
          <p className="text-xs text-[var(--color-muted)]">
            Reserviere einen Tisch oder sammle beim nächsten Besuch Punkte.
          </p>
        </div>
      )}
    </div>
  );
}
