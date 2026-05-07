"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserPoints } from "@/lib/hooks/useUserPoints";

const CHECK_IN_POINTS = 5;

const DAY_LABELS = ["M", "D", "M", "D", "F", "S", "S"];

function buildWeekStamps(todayCheckedIn: boolean) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    const isToday = d.toDateString() === today.toDateString();
    const isPast = d < today && !isToday;
    return { isToday, isPast };
  });
}

export function DailyCheckIn() {
  const { profile } = useUserPoints();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "already">("idle");

  useEffect(() => {
    if (!profile || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    (async () => {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("point_transactions")
        .select("id")
        .eq("user_id", profile.id)
        .eq("reason", "Täglicher Check-in")
        .gte("created_at", `${today}T00:00:00Z`)
        .limit(1);
      if (data && data.length > 0) setStatus("already");
    })();
  }, [profile]);

  if (!profile) return null;

  async function handleCheckIn() {
    if (!profile || status !== "idle") return;
    setStatus("loading");
    try {
      const supabase = createClient();
      await supabase.from("point_transactions").insert({
        user_id: profile.id,
        amount: CHECK_IN_POINTS,
        reason: "Täglicher Check-in",
      });
      await supabase
        .from("profiles")
        .update({ points: profile.points + CHECK_IN_POINTS })
        .eq("id", profile.id);
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  const checkedToday = status === "already" || status === "done";
  const stamps = buildWeekStamps(checkedToday);

  // Count consecutive days done (streak)
  const streak = stamps.filter((s, i) => i < 5 && (s.isPast || (s.isToday && checkedToday))).length
    + (checkedToday ? 1 : 0);
  const streakCount = Math.min(streak, 7);

  const MILESTONES = [
    { count: 7,   label: "Wochen-Streak",         sub: `Noch ${Math.max(7 - streakCount, 0)} Tage · +25 Bonuspunkte`, current: streakCount, max: 7 },
    { count: 30,  label: "Monats-Stammtisch",      sub: "+200 Pkt. + Bockbier-Probe",                                  current: streakCount, max: 30 },
    { count: 100, label: "100 Tage Stammgast",     sub: "Eingravierter Masskrug auf Lebenszeit",                       current: streakCount, max: 100 },
  ];

  return (
    <div className="flex flex-col gap-3">

      {/* ── Streak hero card ── */}
      <div
        style={{
          background: "linear-gradient(150deg, #FBF9F4 0%, #F0E6CC 100%)",
          borderRadius: 22,
          padding: 22,
          border: "1px solid rgba(200,146,10,0.20)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top row: streak count + flame circle */}
        <div className="flex items-flex-end justify-between mb-5">
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-narrow), 'Archivo Narrow', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--gold-2)",
              }}
            >
              Aktuelle Serie
            </p>
            <p className="num-display" style={{ fontSize: 56, color: "var(--navy)", marginTop: 4 }}>
              {streakCount}
              <span style={{ fontSize: 18, color: "var(--ink-2)", fontWeight: 700, marginLeft: 6 }}>
                Tage
              </span>
            </p>
          </div>
          <div
            style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: "var(--navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--gold)">
              <path d="M12 2c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9zm-3 13a3 3 0 1 0 6 0c0 2.5-1.5 4-3 4s-3-1.5-3-4z"/>
            </svg>
          </div>
        </div>

        {/* Week label */}
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: "var(--font-narrow), 'Archivo Narrow', sans-serif",
            fontWeight: 700, fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Diese Woche
        </p>

        {/* Stamp grid */}
        <div className="stamps">
          {stamps.map((s, i) => {
            const done = s.isPast || (s.isToday && checkedToday);
            const todayPending = s.isToday && !checkedToday;
            return (
              <div
                key={i}
                className={`stamp${done ? " done" : todayPending ? " today" : ""}`}
              >
                <span>{DAY_LABELS[i]}</span>
                {done && <span style={{ fontSize: 13, marginTop: 2 }}>✓</span>}
                {todayPending && (
                  <span style={{ fontSize: 10, marginTop: 2, fontWeight: 800 }}>+5</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Today's reward card ── */}
      <div
        className="bg-white rounded-[18px] flex items-center gap-4 card-shadow"
        style={{ padding: 18 }}
      >
        <div
          style={{
            width: 56, height: 56,
            borderRadius: 16,
            background: "var(--crimson)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, color: "#fff",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l2.4 7H21l-5.8 4.2 2.2 6.8L12 16l-5.4 4 2.2-6.8L3 9h6.6z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="eyebrow" style={{ margin: "0 0 2px" }}>
            Heute · Tag {streakCount || 1}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display), 'Archivo', sans-serif",
              fontWeight: 800, fontSize: 17,
              color: "var(--ink)", letterSpacing: "-0.01em",
            }}
          >
            {checkedToday ? `+${CHECK_IN_POINTS} Punkte gesichert` : `+${CHECK_IN_POINTS} Punkte verfügbar`}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--muted)" }}>
            {checkedToday
              ? "Morgen verdoppelt sich der Bonus auf +10."
              : "Check-in jetzt und sichere deine Punkte."}
          </p>
        </div>
      </div>

      {/* ── Check-in button ── */}
      {!checkedToday && (
        <button
          onClick={handleCheckIn}
          disabled={status === "loading"}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-display), 'Archivo', sans-serif",
            fontWeight: 700,
            background: "linear-gradient(160deg, #243040 0%, #1C2836 100%)",
            boxShadow: "0 4px 12px -4px rgba(15,24,34,0.35)",
            border: "none", cursor: "pointer",
          }}
        >
          {status === "loading" ? "Wird eingetragen…" : `Jetzt einchecken · +${CHECK_IN_POINTS} Pkt.`}
        </button>
      )}

      {/* ── Milestones ── */}
      <div>
        <p className="section-label" style={{ padding: "4px 0 8px" }}>Meilensteine</p>
        <div className="ios-card">
          {MILESTONES.map((m, i) => (
            <div key={i} className="ios-row">
              <div
                className="icon-badge gold"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  fontFamily: "var(--font-narrow), sans-serif",
                  fontWeight: 800, fontSize: 13,
                  color: "var(--gold-2)",
                }}
              >
                {m.count}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "var(--ink)", margin: 0 }}>{m.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)", margin: 0 }}>{m.sub}</p>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 800, fontSize: 13,
                  color: m.current >= m.max ? "var(--gold-2)" : "var(--ios-tertiary)",
                  flexShrink: 0,
                }}
              >
                {m.current} / {m.max}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
