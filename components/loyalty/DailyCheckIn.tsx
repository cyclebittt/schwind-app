"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserPoints } from "@/lib/hooks/useUserPoints";
import { Zap, CheckCircle2 } from "lucide-react";

const CHECK_IN_POINTS = 5;

export function DailyCheckIn() {
  const { profile } = useUserPoints();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "already">("idle");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!profile || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    async function checkToday() {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("point_transactions")
        .select("id, created_at")
        .eq("user_id", profile!.id)
        .eq("reason", "Täglicher Check-in")
        .gte("created_at", `${today}T00:00:00Z`)
        .limit(1);

      if (data && data.length > 0) {
        setStatus("already");
      }
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

  if (status === "already") {
    return (
      <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-5 py-4 card-shadow">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-sm text-[var(--color-text)]">Heute eingecheckt ✓</p>
          <p className="text-xs text-[var(--color-muted)]">Morgen wieder +{CHECK_IN_POINTS} Punkte sichern</p>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 bg-[var(--color-accent-light)] border border-amber-200 rounded-2xl px-5 py-4 animate-scale-in">
        <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-[var(--color-text)]">+{CHECK_IN_POINTS} Punkte gutgeschrieben! 🎉</p>
          <p className="text-xs text-[var(--color-muted)]">Morgen wieder einloggen für mehr Punkte</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={status === "loading"}
      className="w-full flex items-center gap-3 bg-[var(--color-deep)] hover:bg-[var(--color-deep-2)] active:scale-[0.98] text-white rounded-2xl px-5 py-4 card-shadow transition-all duration-150 group"
    >
      <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-bold text-sm">Jetzt einchecken</p>
        <p className="text-xs text-white/60">Täglich +{CHECK_IN_POINTS} Treuepunkte sichern</p>
      </div>
      <span className="font-black text-lg text-[var(--color-accent)]">+{CHECK_IN_POINTS}</span>
    </button>
  );
}
