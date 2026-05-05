import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/time";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const supabase = await createClient();
  const { data: reservations } = await supabase
    .from("table_reservations")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true })
    .limit(100);

  const all = reservations ?? [];

  async function confirm(id: string) {
    "use server";
    const { createClient: cs } = await import("@/lib/supabase/server");
    const sb = await cs();
    await sb.from("table_reservations").update({ status: "confirmed" }).eq("id", id);
  }

  async function cancel(id: string) {
    "use server";
    const { createClient: cs } = await import("@/lib/supabase/server");
    const sb = await cs();
    await sb.from("table_reservations").update({ status: "cancelled" }).eq("id", id);
  }

  const statusLabels: Record<string, string> = { pending: "Ausstehend", confirmed: "Bestätigt", cancelled: "Storniert" };
  const statusVariant: Record<string, "warning" | "success" | "danger"> = { pending: "warning", confirmed: "success", cancelled: "danger" };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Reservierungen</h1>

      {all.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">Keine Reservierungen vorhanden.</p>
      ) : (
        <div className="space-y-3">
          {all.map((r: { id: string; date: string; time: string; guest_name: string; guest_phone: string; party_size: number; status: string; notes?: string }) => (
            <div key={r.id} className="bg-white border border-[var(--color-border)] rounded-xl p-4 card-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-[var(--color-text)]">
                    {formatDate(r.date)} · {r.time} · {r.party_size} Personen
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">{r.guest_name} · {r.guest_phone}</p>
                  {r.notes && <p className="text-xs text-[var(--color-muted)] italic">{r.notes}</p>}
                </div>
                <Badge variant={statusVariant[r.status] ?? "default"} size="sm">
                  {statusLabels[r.status] ?? r.status}
                </Badge>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <form action={async () => { "use server"; await confirm(r.id); }}>
                    <button type="submit" className="text-xs bg-[var(--color-success)] text-white px-3 py-1.5 rounded-lg hover:opacity-90">
                      Bestätigen
                    </button>
                  </form>
                  <form action={async () => { "use server"; await cancel(r.id); }}>
                    <button type="submit" className="text-xs bg-[var(--color-danger)] text-white px-3 py-1.5 rounded-lg hover:opacity-90">
                      Stornieren
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
