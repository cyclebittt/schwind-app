"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const TIME_SLOTS = ["17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"];
const BUSY_SLOTS = new Set(["18:30", "21:30"]);
const DOW = ["M","D","M","D","F","S","S"];
const MONTHS_DE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const WEEKDAYS_SHORT = ["Mo","Di","Mi","Do","Fr","Sa","So"];

function buildCalendar(year: number, month: number) {
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMon  = new Date(year, month + 1, 0).getDate();
  const prevDays   = new Date(year, month, 0).getDate();
  const startOff   = firstDay === 0 ? 6 : firstDay - 1;
  const cells: Array<{ day: number; dim: boolean; date: Date }> = [];
  for (let i = startOff - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, dim: true, date: new Date(year, month - 1, prevDays - i) });
  for (let d = 1; d <= daysInMon; d++)
    cells.push({ day: d, dim: false, date: new Date(year, month, d) });
  let nd = 1;
  while (cells.length % 7 !== 0)
    cells.push({ day: nd++, dim: true, date: new Date(year, month + 1, nd - 1) });
  return cells;
}

function toDateStr(d: Date) { return d.toISOString().slice(0, 10); }

export default function ReservePage() {
  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate,  setSelDate]  = useState<string>("");
  const [selTime,  setSelTime]  = useState("");
  const [partySize, setPartySize] = useState(2);
  const [guestName,  setGuestName]  = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const cells   = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth]);
  const todayStr = toDateStr(today);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelDate(""); setSelTime("");
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelDate(""); setSelTime("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selDate || !selTime) { setError("Bitte Datum und Uhrzeit wählen."); return; }
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { error: err } = await supabase.from("table_reservations").insert({
        user_id: user?.id ?? null, guest_name: guestName, guest_phone: guestPhone,
        party_size: partySize, date: selDate, time: selTime, notes: notes || null, status: "pending",
      });
      if (err) throw err;
      if (user) {
        await supabase.from("point_transactions").insert({ user_id: user.id, amount: 8, reason: "Tischreservierung" });
        const { data: p } = await supabase.from("profiles").select("points").eq("id", user.id).single();
        await supabase.from("profiles").update({ points: (p?.points ?? 0) + 8 }).eq("id", user.id);
      }
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fehler beim Absenden.");
    } finally { setLoading(false); }
  }

  if (success) return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(22,163,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
      <h2 className="large-title" style={{ marginBottom: 12 }}>Reservierung eingegangen!</h2>
      <p style={{ fontSize: 14, color: "var(--ios-secondary)", marginBottom: 28 }}>Wir melden uns kurzfristig zur Bestätigung. Du hast +8 Treuepunkte erhalten!</p>
      <button onClick={() => setSuccess(false)} style={{ height: 52, borderRadius: 14, border: "none", cursor: "pointer", background: "var(--navy)", color: "#fff", fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: 15, padding: "0 28px" }}>
        Neue Reservierung
      </button>
    </div>
  );

  const selDateObj = selDate ? new Date(selDate + "T12:00:00") : null;

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 0 32px" }}>
      <form onSubmit={handleSubmit}>

        {/* ── Header ── */}
        <div style={{ padding: "8px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <p className="eyebrow">Reservieren</p>
            <span style={{ background: "rgba(200,146,10,0.14)", color: "var(--gold-2)", borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "5px 12px" }}>+8 Pkt.</span>
          </div>
          <h1 className="large-title">Tisch im<br />Wirtshaus.</h1>
          <p className="subtitle">Bierkenner-Mitglieder werden bevorzugt bestätigt.</p>
        </div>

        {/* ── Calendar ── */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                {MONTHS_DE[calMonth]} {calYear}
              </p>
              <div style={{ display: "flex", gap: 14 }}>
                <button type="button" onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
                </button>
                <button type="button" onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink)", padding: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
                </button>
              </div>
            </div>

            {/* Day-of-week header */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
              {WEEKDAYS_SHORT.map(d => (
                <span key={d} style={{ textAlign: "center", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", padding: "6px 0" }}>{d}</span>
              ))}
            </div>

            {/* Calendar cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {cells.map((cell, i) => {
                const ds  = toDateStr(cell.date);
                const isToday    = ds === todayStr;
                const isSelected = ds === selDate;
                const isPast     = cell.date < today && !isToday;
                const disabled   = cell.dim || isPast;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => { setSelDate(ds); setSelTime(""); }}
                    style={{
                      aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display, sans-serif)", fontWeight: 600, fontSize: 14,
                      borderRadius: 999, border: "none", cursor: disabled ? "default" : "pointer",
                      color: isSelected ? "#fff" : isToday ? "var(--crimson)" : cell.dim ? "var(--ios-tertiary)" : "var(--ink)",
                      background: isSelected ? "var(--crimson)" : isToday ? "rgba(139,26,42,0.10)" : "transparent",
                      opacity: isPast ? 0.35 : 1,
                    }}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Time chips ── */}
        {selDate && (
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p className="section-label" style={{ padding: 0 }}>
                Verfügbare Zeit · {selDateObj?.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <span style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", color: "var(--crimson)" }}>
                {TIME_SLOTS.length - BUSY_SLOTS.size} frei
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {TIME_SLOTS.map(slot => {
                const busy = BUSY_SLOTS.has(slot);
                const sel  = selTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={busy}
                    onClick={() => setSelTime(slot)}
                    style={{
                      padding: "12px 0", textAlign: "center", borderRadius: 12,
                      fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: 14,
                      fontVariantNumeric: "tabular-nums", border: "1px solid",
                      cursor: busy ? "default" : "pointer",
                      background: sel ? "var(--navy)" : "#fff",
                      color: sel ? "#fff" : busy ? "var(--ios-tertiary)" : "var(--ink)",
                      borderColor: sel ? "var(--navy)" : "rgba(26,24,20,0.10)",
                      textDecoration: busy ? "line-through" : "none",
                      opacity: busy ? 0.4 : 1,
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Party size ── */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.05)" }}>
            <div>
              <p style={{ margin: 0, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>Personen</p>
              <p style={{ margin: "4px 0 0", fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>Wie viele anstoßen?</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(26,24,20,0.10)", borderRadius: 12, overflow: "hidden" }}>
              <button type="button" onClick={() => setPartySize(s => Math.max(1, s - 1))} style={{ width: 44, height: 44, background: "transparent", border: "none", fontSize: 22, color: "var(--navy)", cursor: "pointer", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700 }}>−</button>
              <span style={{ width: 56, textAlign: "center", fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 18, color: "var(--ink)", borderLeft: "1px solid rgba(26,24,20,0.10)", borderRight: "1px solid rgba(26,24,20,0.10)", padding: "12px 0", background: "var(--paper)" }}>{partySize}</span>
              <button type="button" onClick={() => setPartySize(s => Math.min(20, s + 1))} style={{ width: 44, height: 44, background: "transparent", border: "none", fontSize: 22, color: "var(--navy)", cursor: "pointer", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700 }}>+</button>
            </div>
          </div>
        </div>

        {/* ── Name + Phone ── */}
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Name", value: guestName,  set: setGuestName,  type: "text", placeholder: "Vor- und Nachname" },
            { label: "Telefon", value: guestPhone, set: setGuestPhone, type: "tel",  placeholder: "+49 …" },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ios-secondary)" }}>{label}</label>
              <div style={{ background: "#fff", border: "1px solid rgba(26,24,20,0.10)", borderRadius: 12, padding: "14px", fontSize: 16, color: "var(--ink)", display: "flex", alignItems: "center", minHeight: 50 }}>
                <input required type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                  style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: 16, color: "var(--ink)", fontFamily: "inherit" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Notes ── */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ios-secondary)" }}>Anmerkungen</label>
            <div style={{ background: "#fff", border: "1px solid rgba(26,24,20,0.10)", borderRadius: 12, padding: "14px", minHeight: 74 }}>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergien, Hochstuhl, besondere Wünsche…"
                style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: 16, color: "var(--ink)", fontFamily: "inherit", resize: "none", lineHeight: 1.5, minHeight: 44 }} />
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && <p style={{ margin: "0 20px 16px", fontSize: 13, color: "#DC2626", background: "rgba(220,38,38,0.08)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(220,38,38,0.15)" }}>{error}</p>}

        {/* ── Submit ── */}
        <div style={{ padding: "0 20px" }}>
          <button type="submit" disabled={loading} style={{ width: "100%", height: 56, borderRadius: 16, border: "none", cursor: "pointer", background: "var(--crimson)", color: "#fff", fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Wird übermittelt…" : "Reservierung anfragen"}
            {!loading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", margin: "12px 0 0" }}>Du erhältst eine SMS-Bestätigung innerhalb von 30 min.</p>
        </div>

      </form>
    </div>
  );
}
