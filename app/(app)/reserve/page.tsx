"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { generateTimeSlots } from "@/lib/utils/time";

export default function ReservePage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const timeSlots = date ? generateTimeSlots(new Date(date)) : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase.from("table_reservations").insert({
        user_id: user?.id ?? null,
        guest_name: guestName,
        guest_phone: guestPhone,
        party_size: partySize,
        date,
        time,
        notes: notes || null,
        status: "pending",
      });

      if (insertError) throw insertError;

      if (user) {
        await supabase.from("point_transactions").insert({
          user_id: user.id,
          amount: 8,
          reason: "Tischreservierung",
        });
        const { data: profile } = await supabase.from("profiles").select("points").eq("id", user.id).single();
        await supabase.from("profiles").update({ points: (profile?.points ?? 0) + 8 }).eq("id", user.id);
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fehler beim Absenden.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Reservierung eingegangen!</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Wir melden uns kurzfristig zur Bestätigung. Du hast +8 Treuepunkte erhalten!
        </p>
        <Button onClick={() => setSuccess(false)} variant="secondary">
          Neue Reservierung
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: "var(--color-brand-red)" }}>SCHWIND AM DALBERG</p>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Tisch reservieren</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          +8 Treuepunkte bei jeder Reservierung
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Datum *</label>
            <input
              type="date"
              required
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => { setDate(e.target.value); setTime(""); }}
              className="w-full border border-[var(--color-border)] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Uhrzeit *</label>
            <select
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date}
              className="w-full border border-[var(--color-border)] rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
            >
              <option value="">Wählen</option>
              {timeSlots.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Personen *</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setPartySize(Math.max(1, partySize - 1))}
              className="w-10 h-10 rounded-lg border border-[var(--color-border)] text-lg font-bold hover:border-[var(--color-accent)] transition-colors">−</button>
            <span className="text-lg font-semibold w-8 text-center">{partySize}</span>
            <button type="button" onClick={() => setPartySize(Math.min(20, partySize + 1))}
              className="w-10 h-10 rounded-lg border border-[var(--color-border)] text-lg font-bold hover:border-[var(--color-accent)] transition-colors">+</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Name *</label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Vor- und Nachname"
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Telefon *</label>
          <input
            type="tel"
            required
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="+49 ..."
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Anmerkungen</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergien, besondere Wünsche, ..."
            rows={3}
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)] resize-none"
          />
        </div>

        {error && <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Reservierung anfragen
        </Button>
      </form>
    </div>
  );
}
