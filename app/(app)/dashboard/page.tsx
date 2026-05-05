import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PointsDisplay } from "@/components/ui/PointsDisplay";
import { LevelBadge } from "@/components/loyalty/LevelBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trophy, Calendar, Beer } from "lucide-react";
import { formatDateTime } from "@/lib/utils/time";
import type { Level } from "@/lib/utils/points";

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

  const statusLabels: Record<string, string> = {
    pending: "Ausstehend", confirmed: "Bestätigt", cancelled: "Storniert",
  };
  const statusVariant: Record<string, "warning" | "success" | "danger"> = {
    pending: "warning", confirmed: "success", cancelled: "danger",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Moin, {profile?.name?.split(" ")[0] ?? "Gast"} 🍺
          </h1>
          <p className="text-sm text-[var(--color-muted)]">Dein SCHWIND Bräu Dashboard</p>
        </div>
        <LevelBadge level={(profile?.level ?? "bronze") as Level} />
      </div>

      {/* Points card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 card-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-[var(--color-accent)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">Deine Treuepunkte</span>
        </div>
        <PointsDisplay points={profile?.points ?? 0} size="lg" />
        <Link href="/loyalty">
          <Button size="sm" variant="secondary" className="mt-4">
            Punkte & Prämien anzeigen →
          </Button>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/reserve">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-2 hover:border-[var(--color-accent)] transition-colors card-shadow">
            <Calendar className="w-6 h-6 text-[var(--color-accent)]" />
            <span className="text-sm font-semibold text-[var(--color-text)]">Tisch reservieren</span>
          </div>
        </Link>
        <Link href="/loyalty">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-2 hover:border-[var(--color-accent)] transition-colors card-shadow">
            <Beer className="w-6 h-6 text-[var(--color-accent)]" />
            <span className="text-sm font-semibold text-[var(--color-text)]">Prämien einlösen</span>
          </div>
        </Link>
      </div>

      {/* Recent reservations */}
      {reservations.length > 0 && (
        <section>
          <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Letzte Reservierungen</h2>
          <div className="space-y-2">
            {reservations.map((r) => (
              <div key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-center justify-between card-shadow">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {r.party_size} Personen · {r.date} · {r.time}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">{formatDateTime(r.created_at)}</p>
                </div>
                <Badge variant={statusVariant[r.status] ?? "default"} size="sm">
                  {statusLabels[r.status] ?? r.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent point transactions */}
      {transactions.length > 0 && (
        <section>
          <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Letzte Punkte-Aktivität</h2>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 divide-y divide-[var(--color-border)] card-shadow">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <p className="text-sm text-[var(--color-text)]">{tx.reason}</p>
                <span className={["font-mono text-sm font-semibold", tx.amount >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"].join(" ")}>
                  {tx.amount >= 0 ? "+" : ""}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
