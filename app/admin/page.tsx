import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils/time";
import { Badge } from "@/components/ui/Badge";

export default async function AdminPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [reservationsRes, pendingRedemptionsRes, recentTxRes] = await Promise.all([
    supabase
      .from("table_reservations")
      .select("*")
      .eq("date", today)
      .order("time"),
    supabase
      .from("reward_redemptions")
      .select("*, profiles(name), rewards(name, points_required)")
      .eq("confirmed", false)
      .order("redeemed_at", { ascending: false })
      .limit(10),
    supabase
      .from("point_transactions")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  const reservations = reservationsRes.data ?? [];
  const pendingRedemptions = pendingRedemptionsRes.data ?? [];
  const recentTx = recentTxRes.data ?? [];

  async function confirmRedemption(id: string) {
    "use server";
    const { createClient: createServerClient } = await import("@/lib/supabase/server");
    const sb = await createServerClient();
    await sb.from("reward_redemptions").update({ confirmed: true }).eq("id", id);
  }

  const statusLabels: Record<string, string> = { pending: "Ausstehend", confirmed: "Bestätigt", cancelled: "Storniert" };
  const statusVariant: Record<string, "warning" | "success" | "danger"> = { pending: "warning", confirmed: "success", cancelled: "danger" };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">SCHWIND Bräu · {today}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 card-shadow">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Reservierungen heute</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mt-1">{reservations.length}</p>
        </div>
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 card-shadow">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Offene Prämien</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mt-1">{pendingRedemptions.length}</p>
        </div>
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 card-shadow">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Punkte heute vergeben</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mt-1">
            {recentTx
              .filter((tx) => tx.created_at?.startsWith(today) && tx.amount > 0)
              .reduce((sum: number, tx: { amount: number }) => sum + tx.amount, 0)}
          </p>
        </div>
      </div>

      {/* Pending redemptions */}
      {pendingRedemptions.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Ausstehende Prämieneinlösungen</h2>
          <div className="space-y-2">
            {pendingRedemptions.map((r: {
              id: string;
              redeemed_at: string;
              profiles: { name: string } | null;
              rewards: { name: string; points_required: number } | null;
            }) => (
              <div key={r.id} className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between card-shadow">
                <div>
                  <p className="font-medium text-sm text-[var(--color-text)]">{r.profiles?.name} → {r.rewards?.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{formatDateTime(r.redeemed_at)} · {r.rewards?.points_required} Pkt.</p>
                </div>
                <form action={async () => { "use server"; await confirmRedemption(r.id); }}>
                  <button type="submit" className="text-xs bg-[var(--color-accent)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors">
                    Bestätigen
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Today's reservations */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Reservierungen heute</h2>
        {reservations.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Keine Reservierungen für heute.</p>
        ) : (
          <div className="space-y-2">
            {reservations.map((r: { id: string; time: string; guest_name: string; party_size: number; status: string; notes?: string }) => (
              <div key={r.id} className="bg-white border border-[var(--color-border)] rounded-xl p-4 flex items-center justify-between card-shadow">
                <div>
                  <p className="font-medium text-sm text-[var(--color-text)]">{r.time} · {r.guest_name} · {r.party_size} Pers.</p>
                  {r.notes && <p className="text-xs text-[var(--color-muted)]">{r.notes}</p>}
                </div>
                <Badge variant={statusVariant[r.status] ?? "default"} size="sm">{statusLabels[r.status] ?? r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent point transactions */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Letzte Punkte-Aktivität</h2>
        <div className="bg-white border border-[var(--color-border)] rounded-xl px-4 divide-y divide-[var(--color-border)] card-shadow">
          {recentTx.map((tx: { id: string; profiles: { name: string } | null; reason: string; amount: number; created_at: string }) => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text)]">{tx.profiles?.name} – {tx.reason}</p>
                <p className="text-xs text-[var(--color-muted)]">{formatDateTime(tx.created_at)}</p>
              </div>
              <span className={["font-mono text-sm font-semibold", tx.amount >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"].join(" ")}>
                {tx.amount >= 0 ? "+" : ""}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
