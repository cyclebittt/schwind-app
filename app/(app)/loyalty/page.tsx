import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MemberCard } from "@/components/loyalty/MemberCard";
import { RewardsList } from "@/components/loyalty/RewardsList";
import { TransactionHistory } from "@/components/loyalty/TransactionHistory";
import { InviteFriend } from "@/components/loyalty/InviteFriend";
import { BEER_TYPES } from "@/lib/utils/points";
import type { Level } from "@/lib/utils/points";
import type { Reward } from "@/components/loyalty/RewardsList";

const DEMO_REWARDS: Reward[] = [
  { id: "r1", name: "1 Schwindbräu Helles gratis",    description: "0,5l Helles nach Wahl beim nächsten Besuch", points_required: 50,  type: "drink", available: true },
  { id: "r2", name: "Brauerei-Tour für 2",             description: "Führung durch unsere Brauerei mit Verkostung", points_required: 200, type: "tour",  available: true },
  { id: "r3", name: "Schwindbräu-Bierkrug (Masskrug)", description: "Exklusiver 1-Liter Keramikmasskrug",         points_required: 150, type: "merch", available: true },
  { id: "r4", name: "Frühschoppen-Ticket",             description: "Eintritt inkl. 2 Bier beim Frühschoppen-Event", points_required: 100, type: "event", available: true },
];

export default async function LoyaltyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, rewardsRes, txRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("rewards").select("*").order("points_required"),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const profile = profileRes.data;
  const rewards = (rewardsRes.data?.length ? rewardsRes.data : DEMO_REWARDS) as Reward[];
  const transactions = txRes.data ?? [];

  const levelBenefits: Record<string, string[]> = {
    silver: [
      "Priorität bei Tischreservierungen",
      "Exklusive Bierkenner-Events",
      "10 % Rabatt auf Schwindbräu-Merchandise",
    ],
    gold: [
      "Höchste Priorität bei Reservierungen",
      "1× Freibier pro Monat",
      "Kostenlose Brauerei-Führung pro Jahr",
      "Braumeister-Lounge Zugang",
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: "var(--color-brand-red)" }}>SCHWIND AM DALBERG</p>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Treuepunkte</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Sammle Punkte bei jedem Bierkauf</p>
      </div>

      <MemberCard
        points={profile?.points ?? 0}
        level={(profile?.level ?? "bronze") as Level}
        name={profile?.name ?? ""}
        userId={user.id}
      />

      {/* Level benefits */}
      {levelBenefits[profile?.level ?? ""] && (
        <section>
          <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Deine Vorteile</h2>
          <ul className="space-y-2">
            {levelBenefits[profile!.level].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <span className="text-[var(--color-accent)]">✓</span> {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to earn points */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 card-shadow">
        <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-4">So sammelst du Punkte</h2>
        <div className="space-y-2">
          {BEER_TYPES.map((beer) => (
            <div key={beer.id} className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text)]">🍺 {beer.name}</span>
              <span className="font-mono font-semibold text-[var(--color-accent)]">+{beer.points} Pkt.</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--color-border)]">
            <span className="text-[var(--color-text)]">📅 Tischreservierung</span>
            <span className="font-mono font-semibold text-[var(--color-accent)]">+8 Pkt.</span>
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-3">
          Punkte werden vom Personal beim Kauf eingetragen. Einfach App zeigen!
        </p>
      </section>

      {/* Rewards */}
      <section>
        <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-4">Prämien einlösen</h2>
        <RewardsList
          rewards={rewards}
          userPoints={profile?.points ?? 0}
          userId={user.id}
          onRedeem={() => {}}
        />
      </section>

      {/* Invite friend */}
      <InviteFriend userId={user.id} />

      {/* History */}
      <section>
        <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Punkte-Historie</h2>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 card-shadow">
          <TransactionHistory transactions={transactions} />
        </div>
      </section>
    </div>
  );
}
