"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserPoints } from "@/lib/hooks/useUserPoints";

const CHECK_IN_POINTS = 5;

// Generate 7-day streak display (Mon–today)
function buildWeekStamps(todayCheckedIn: boolean) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  // Shift so week starts Monday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const stamps = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    const isToday = d.toDateString() === today.toDateString();
    const isPast = d < today && !isToday;
    stamps.push({ date: d, isToday, isPast });
  }
  return stamps;
}

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function DailyCheckIn() {
  const { profile } = useUserPoints();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "already">("idle");

  useEffect(() => {
    if (!profile || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    async function checkToday() {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("point_transactions")
        .select("id")
        .eq("user_id", profile!.id)
        .eq("reason", "Täglicher Check-in")
        .gte("created_at", `${today}T00:00:00Z`)
        .limit(1);
      if (data && data.length > 0) setStatus("already");
    }
    checkToday();
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

  return (
    <div
      className="bg-[var(--color-surface)] rounded-2xl p-4"
      style={{ boxShadow: "0 1px 3px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label">Täglicher Check-in</p>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">+{CHECK_IN_POINTS} Punkte täglich</p>
        </div>
        {checkedToday && (
          <span
            className="text-[10px] px-2.5 py-1 rounded-full"
            style={{
              fontFamily: "var(--font-archivo-narrow), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "rgba(22,163,74,0.10)",
              color: "#16A34A",
              border: "1px solid rgba(22,163,74,0.2)",
            }}
          >
            Erledigt
          </span>
        )}
      </div>

      {/* Stamp row */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {stamps.map((s, i) => {
          const done = s.isPast || (s.isToday && checkedToday);
          const todayPending = s.isToday && !checkedToday;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-full aspect-square rounded-xl flex items-center justify-center text-[11px]"
                style={{
                  fontFamily: "var(--font-archivo-narrow), sans-serif",
                  fontWeight: 700,
                  ...(done
                    ? {
                        background: "var(--color-deep-2, #1C2836)",
                        color: "var(--color-gold)",
                        boxShadow: "0 2px 6px -2px rgba(15,24,34,0.35)",
                      }
                    : todayPending
                    ? {
                        background: "var(--color-surface)",
                        color: "var(--color-accent)",
                        border: "2px solid var(--color-accent)",
                      }
                    : {
                        background: "var(--color-paper, #FBF9F4)",
                        color: "var(--color-muted-light)",
                        border: "1.5px dashed rgba(26,24,20,0.18)",
                      }),
                }}
              >
                {done ? "✓" : todayPending ? "!" : "·"}
              </div>
              <span
                className="text-[9px]"
                style={{
                  fontFamily: "var(--font-archivo-narrow), sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: s.isToday ? "var(--color-accent)" : "var(--color-muted-light)",
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action button */}
      {!checkedToday && (
        <button
          onClick={handleCheckIn}
          disabled={status === "loading"}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-archivo), 'Archivo', sans-serif",
            fontWeight: 700,
            background: "linear-gradient(160deg, #243040 0%, #1C2836 100%)",
            boxShadow: "0 4px 12px -4px rgba(15,24,34,0.35)",
          }}
        >
          {status === "loading" ? "Wird eingetragen…" : `Jetzt einchecken · +${CHECK_IN_POINTS} Pkt.`}
        </button>
      )}

      {status === "done" && (
        <div
          className="text-xs text-center py-2 rounded-xl"
          style={{
            fontFamily: "var(--font-archivo-narrow), sans-serif",
            fontWeight: 700,
            letterSpacing: "0.1em",
            background: "rgba(22,163,74,0.08)",
            color: "#16A34A",
          }}
        >
          +{CHECK_IN_POINTS} Punkte gutgeschrieben
        </div>
      )}
    </div>
  );
}
