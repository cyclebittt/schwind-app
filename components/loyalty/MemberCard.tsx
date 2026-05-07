"use client";

import { progressToNextLevel, LEVELS } from "@/lib/utils/points";
import { QRDrawer } from "@/components/loyalty/QRDrawer";
import type { Level } from "@/lib/utils/points";

const levelConfig: Record<Level, {
  bg: string;
  shimmer: string;
  badge: string;
  badgeText: string;
  bar: string;
  label: string;
}> = {
  bronze: {
    bg:        "from-[#1C2836] via-[#243040] to-[#141E2B]",
    shimmer:   "from-white/10 to-white/5",
    badge:     "bg-white/10 border-white/20 text-white/70",
    badgeText: "Stammgast",
    bar:       "from-[#8B1A2A] to-[#B52236]",
    label:     "STAMMGAST",
  },
  silver: {
    bg:        "from-[#2A3244] via-[#313B50] to-[#1E2838]",
    shimmer:   "from-white/15 to-white/5",
    badge:     "bg-white/10 border-white/25 text-white/80",
    badgeText: "Bierkenner",
    bar:       "from-slate-300 to-slate-100",
    label:     "BIERKENNER",
  },
  gold: {
    bg:        "from-[#1C2836] via-[#2C3E56] to-[#141E2B]",
    shimmer:   "from-white/20 to-white/8",
    badge:     "bg-white/15 border-white/30 text-white/90",
    badgeText: "Braumeister",
    bar:       "from-white to-white/70",
    label:     "BRAUMEISTER",
  },
};

const nextLevelLabel: Partial<Record<Level, string>> = {
  silver: "Bierkenner",
  gold:   "Braumeister",
};

interface MemberCardProps {
  points: number;
  level: Level;
  name: string;
  compact?: boolean;
  userId?: string;
}

export function MemberCard({ points, level, name, compact = false, userId }: MemberCardProps) {
  const cfg = levelConfig[level];
  const progress = progressToNextLevel(points);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl bg-gradient-to-br text-white select-none",
        cfg.bg,
        compact ? "p-4" : "p-6",
      ].join(" ")}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      {/* Shimmer stripe */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${cfg.shimmer} opacity-60`} />

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-5">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
          SCHWIND Bräu
        </span>
        <span className={[
          "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border tracking-wider",
          cfg.badge,
        ].join(" ")}>
          {cfg.label}
        </span>
      </div>

      {/* Points */}
      {!compact && (
        <div className="relative mb-5 text-center">
          <p className="text-[56px] font-black leading-none tracking-tight text-white drop-shadow-lg">
            {points.toLocaleString("de-DE")}
          </p>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Treuepunkte</p>
        </div>
      )}

      {compact && (
        <div className="relative mb-3 flex items-baseline gap-2">
          <p className="text-3xl font-black text-white">{points.toLocaleString("de-DE")}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider">Pkt.</p>
        </div>
      )}

      {/* Name */}
      <p className="relative text-sm font-semibold text-white/80 tracking-wide mb-4">
        {name || "—"}
      </p>

      {/* Progress to next level */}
      {progress.nextLevel ? (
        <div className="relative space-y-1.5">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${cfg.bar} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/40">
            <span>{progress.current} / {progress.max} Pkt.</span>
            <span>→ {nextLevelLabel[progress.nextLevel]}</span>
          </div>
        </div>
      ) : (
        <p className="relative text-[11px] text-white/50 font-medium tracking-wide">
          Höchstes Level erreicht
        </p>
      )}

      {/* QR trigger — only on full card with userId */}
      {!compact && userId && (
        <QRDrawer userId={userId} name={name} points={points} />
      )}
    </div>
  );
}
