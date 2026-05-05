"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { BEER_TYPES } from "@/lib/utils/points";
import { calculateLevel } from "@/lib/utils/points";
import { formatDateTime } from "@/lib/utils/time";

interface UserProfile { id: string; name: string; email?: string; points: number; }

export default function AdminPurchasesPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [beerType, setBeerType] = useState<string>(BEER_TYPES[0].id);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [recentPurchases, setRecentPurchases] = useState<{
    id: string; profiles: { name: string } | null; reason: string; amount: number; created_at: string;
  }[]>([]);

  useEffect(() => {
    loadRecentPurchases();
  }, []);

  async function loadRecentPurchases() {
    const supabase = createClient();
    const { data } = await supabase
      .from("point_transactions")
      .select("*, profiles(name)")
      .like("reason", "Bierkauf:%")
      .order("created_at", { ascending: false })
      .limit(20);
    setRecentPurchases(data ?? []);
  }

  async function searchUsers(q: string) {
    setSearchQuery(q);
    if (q.length < 2) { setUsers([]); return; }
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, name, points")
      .ilike("name", `%${q}%`)
      .limit(8);
    setUsers(data ?? []);
  }

  async function handleLogPurchase() {
    if (!selectedUser) return;
    setLoading(true);
    setSuccess("");
    try {
      const supabase = createClient();
      const beer = BEER_TYPES.find((b) => b.id === beerType)!;
      const totalPoints = beer.points * quantity;

      await supabase.from("point_transactions").insert({
        user_id: selectedUser.id,
        amount: totalPoints,
        reason: `Bierkauf: ${quantity}× ${beer.name}`,
      });

      const newPoints = selectedUser.points + totalPoints;
      const newLevel = calculateLevel(newPoints);

      await supabase.from("profiles")
        .update({ points: newPoints, level: newLevel })
        .eq("id", selectedUser.id);

      setSuccess(`✓ ${totalPoints} Punkte für ${selectedUser.name} eingetragen (${quantity}× ${beer.name})`);
      setSelectedUser({ ...selectedUser, points: newPoints });
      setQuantity(1);
      loadRecentPurchases();
    } finally { setLoading(false); }
  }

  const selectedBeer = BEER_TYPES.find((b) => b.id === beerType)!;
  const previewPoints = selectedBeer.points * quantity;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Bierkauf erfassen</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Treuepunkte für Gäste eintragen</p>
      </div>

      {/* User search */}
      <section className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-4 card-shadow">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">1. Gast suchen</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => searchUsers(e.target.value)}
          placeholder="Name eingeben..."
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
        />
        {users.length > 0 && !selectedUser && (
          <ul className="border border-[var(--color-border)] rounded-lg overflow-hidden divide-y divide-[var(--color-border)]">
            {users.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => { setSelectedUser(u); setUsers([]); setSearchQuery(u.name); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-surface-2)] flex items-center justify-between"
                >
                  <span className="font-medium">{u.name}</span>
                  <span className="text-[var(--color-muted)] text-xs">{u.points} Pkt.</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectedUser && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <div>
              <p className="font-medium text-sm text-[var(--color-text)]">{selectedUser.name}</p>
              <p className="text-xs text-[var(--color-muted)]">Aktuell: {selectedUser.points} Punkte</p>
            </div>
            <button onClick={() => { setSelectedUser(null); setSearchQuery(""); }} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)]">
              Ändern
            </button>
          </div>
        )}
      </section>

      {/* Beer type */}
      <section className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-4 card-shadow">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">2. Biersorte wählen</h2>
        <div className="grid grid-cols-2 gap-2">
          {BEER_TYPES.map((beer) => (
            <button
              key={beer.id}
              onClick={() => setBeerType(beer.id)}
              className={[
                "text-left px-4 py-3 rounded-lg border text-sm transition-colors",
                beerType === beer.id
                  ? "border-[var(--color-accent)] bg-amber-50 text-[var(--color-text)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50",
              ].join(" ")}
            >
              <span className="font-medium block">{beer.name}</span>
              <span className="text-[var(--color-accent)] text-xs">+{beer.points} Pkt.</span>
            </button>
          ))}
        </div>
      </section>

      {/* Quantity */}
      <section className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-4 card-shadow">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">3. Anzahl</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-11 rounded-lg border border-[var(--color-border)] text-xl font-bold hover:border-[var(--color-accent)] transition-colors">−</button>
          <span className="text-2xl font-bold w-10 text-center">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(20, quantity + 1))}
            className="w-11 h-11 rounded-lg border border-[var(--color-border)] text-xl font-bold hover:border-[var(--color-accent)] transition-colors">+</button>
          <span className="text-sm text-[var(--color-muted)]">= <strong className="text-[var(--color-accent)]">+{previewPoints} Punkte</strong></span>
        </div>
      </section>

      {/* Confirm */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-[var(--color-success)]">
          {success}
        </div>
      )}

      <Button
        onClick={handleLogPurchase}
        loading={loading}
        disabled={!selectedUser}
        className="w-full"
        size="lg"
      >
        🍺 {previewPoints} Punkte eintragen
      </Button>

      {/* Recent purchases */}
      {recentPurchases.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Letzte Käufe</h2>
          <div className="bg-white border border-[var(--color-border)] rounded-xl px-4 divide-y divide-[var(--color-border)] card-shadow">
            {recentPurchases.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text)]">{tx.profiles?.name} – {tx.reason.replace("Bierkauf: ", "")}</p>
                  <p className="text-xs text-[var(--color-muted)]">{formatDateTime(tx.created_at)}</p>
                </div>
                <span className="font-mono text-sm font-semibold text-[var(--color-success)]">+{tx.amount}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
