import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MemberCard } from "@/components/loyalty/MemberCard";
import { RewardsSection } from "@/components/loyalty/RewardsSection";
import { TransactionHistory } from "@/components/loyalty/TransactionHistory";
import { InviteFriend } from "@/components/loyalty/InviteFriend";
import { BEER_TYPES } from "@/lib/utils/points";
import type { Level } from "@/lib/utils/points";
import type { Reward } from "@/components/loyalty/RewardsList";

const DEMO_REWARDS: Reward[] = [
  { id: "r1", name: "Schwindbräu Helles gratis",    description: "Frisch gezapft, 0,5l, ein Glas auf's Haus.", points_required: 50,  type: "drink", available: true },
  { id: "r2", name: "Frühschoppen-Eintritt",         description: "Inkl. 2 Bier + Brez'n beim Frühschoppen.", points_required: 100, type: "event", available: true },
  { id: "r3", name: "Schwindbräu Masskrug",          description: "1-Liter Keramik · graviert · streng limitiert.", points_required: 150, type: "merch", available: true },
  { id: "r4", name: "Brauerei-Tour für 2",           description: "90 min Führung mit Verkostung & Braumeister.", points_required: 200, type: "tour",  available: true },
];

const levelBenefits: Record<string, { active: string[]; locked: string[] }> = {
  bronze: {
    active: ["Treuepunkte bei jedem Kauf", "Täglicher Check-in Bonus"],
    locked: ["Priorität bei Tischreservierungen (Bierkenner)", "Exklusive Events (Bierkenner)", "Braumeister-Lounge (Braumeister)"],
  },
  silver: {
    active: ["Priorität bei Tischreservierungen", "Exklusive Bierkenner-Events", "10 % auf Schwindbräu-Merch"],
    locked: ["Braumeister-Lounge Zugang (Braumeister)"],
  },
  gold: {
    active: ["Höchste Priorität bei Reservierungen", "1× Freibier pro Monat", "Kostenlose Brauerei-Führung/Jahr", "Braumeister-Lounge Zugang"],
    locked: [],
  },
};

const levelLabel: Record<string, string> = { bronze: "Stammgast", silver: "Bierkenner", gold: "Braumeister" };

export default async function LoyaltyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, rewardsRes, txRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("rewards").select("*").order("points_required"),
    supabase.from("point_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);

  const profile    = profileRes.data;
  const rewards    = (rewardsRes.data?.length ? rewardsRes.data : DEMO_REWARDS) as Reward[];
  const txs        = txRes.data ?? [];
  const level      = (profile?.level ?? "bronze") as Level;
  const points     = profile?.points ?? 0;
  const benefits   = levelBenefits[level] ?? levelBenefits.bronze;

  return (
    <div style={{ minHeight: "100%" }}>

      {/* ── Dark hero: member card ── */}
      <div style={{ background: "linear-gradient(180deg, #1C2836 0%, #0F1822 100%)", position: "relative", overflow: "hidden" }}>
        <div className="hero-grain" />

        {/* Nav row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 4px", position: "relative" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-narrow, 'Archivo Narrow', sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)" }}>
            Mitgliedsausweis
          </p>
          <span style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            {levelLabel[level]}
          </span>
        </div>

        {/* Full member card */}
        <div style={{ padding: "16px 20px 0", position: "relative" }}>
          <MemberCard points={points} level={level} name={profile?.name ?? ""} userId={user.id} />
        </div>

        {/* Points earn guide */}
        <div style={{ padding: "20px 20px 0", position: "relative" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ margin: "0 0 10px", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              So sammelst du Punkte
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {BEER_TYPES.map((beer) => (
                <div key={beer.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{beer.name}</span>
                  <span style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--gold)" }}>+{beer.points} Pkt.</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6, borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Tischreservierung</span>
                <span style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--gold)" }}>+8 Pkt.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom curve spacer */}
        <div style={{ height: 32 }} />
      </div>

      {/* ── White slide-up panel ── */}
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", marginTop: -24, position: "relative", zIndex: 1 }}>

        {/* Benefits */}
        <div style={{ padding: "28px 22px 24px" }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Deine Vorteile · {levelLabel[level]}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {benefits.active.map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(200,146,10,0.14)", color: "var(--gold-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 14 }}>✓</div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--ink)", flex: 1 }}>{b}</p>
              </div>
            ))}
            {benefits.locked.map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--cream)", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>○</div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--ink)", flex: 1 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 8, background: "var(--ios-bg)" }} />

        {/* Rewards catalog */}
        <div style={{ padding: "24px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <p className="eyebrow">Prämien</p>
          </div>
          <h2 className="large-title" style={{ marginBottom: 16 }}>Was darf's<br />heute sein?</h2>

          {/* Balance ribbon */}
          <div style={{ background: "var(--navy)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", marginBottom: 20 }}>
            <div>
              <p style={{ margin: 0, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Dein Guthaben</p>
              <p style={{ margin: "2px 0 0", fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: 24, letterSpacing: "-0.02em" }}>
                {points.toLocaleString("de-DE")}
                <span style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 11, color: "var(--gold)", marginLeft: 6, letterSpacing: "0.16em" }}>PKT.</span>
              </p>
            </div>
            <span style={{ background: "rgba(200,146,10,0.2)", border: "1px solid rgba(200,146,10,0.35)", color: "var(--gold-soft)", borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "5px 12px" }}>
              {levelLabel[level]}
            </span>
          </div>
        </div>

        {/* Rewards grid (client component for interactivity) */}
        <RewardsSection rewards={rewards} userPoints={points} userId={user.id} />

        {/* Locked tier */}
        <div style={{ padding: "0 20px 20px" }}>
          <p className="section-label" style={{ padding: "0 0 12px" }}>Bald verfügbar · ab Braumeister</p>
          <div style={{ background: "#fff", borderRadius: 18, padding: 16, display: "flex", gap: 14, alignItems: "center", border: "1px dashed rgba(26,24,20,0.14)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Braumeister-Stammtisch</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>Reservierter Platz am Stammtisch · 1× monatlich</p>
            </div>
            <span style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: 18, color: "var(--muted)" }}>500</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 8, background: "var(--ios-bg)" }} />

        {/* Invite */}
        <div style={{ padding: "20px 20px 0" }}>
          <InviteFriend userId={user.id} />
        </div>

        {/* Divider */}
        <div style={{ height: 8, background: "var(--ios-bg)", marginTop: 20 }} />

        {/* History */}
        <div style={{ padding: "20px 20px 0" }}>
          <p className="section-label" style={{ padding: "0 0 12px" }}>Punkte-Historie</p>
          <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "0.5px solid rgba(26,24,20,0.08)", marginBottom: 8 }}>
            <TransactionHistory transactions={txs} />
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
