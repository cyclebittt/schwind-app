"use client";

import { progressToNextLevel, LEVELS } from "@/lib/utils/points";
import { QRDrawer } from "@/components/loyalty/QRDrawer";
import type { Level } from "@/lib/utils/points";

const levelLabels: Record<Level, string> = {
  bronze: "STAMMGAST",
  silver: "BIERKENNER",
  gold:   "BRAUMEISTER",
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
  const progress = progressToNextLevel(points);
  const label = levelLabels[level];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[22px] text-white select-none member-card-bg",
        compact ? "p-4" : "p-[22px_22px_24px]",
      ].join(" ")}
    >
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden />

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-5">
        {/* Wordmark */}
        <div style={{ fontFamily: "var(--font-archivo-narrow), 'Archivo Narrow', sans-serif", lineHeight: 1 }}>
          <div className="text-[13px] font-extrabold tracking-[0.12em] uppercase text-white">
            SCHWIND
          </div>
          <div
            className="text-[9px] font-bold tracking-[0.22em] uppercase mt-0.5"
            style={{ color: "var(--color-gold)" }}
          >
            AM DALBERG
          </div>
        </div>

        {/* Level badge */}
        <span
          className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "var(--font-archivo-narrow), 'Archivo Narrow', sans-serif",
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.20)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Points display */}
      {compact ? (
        <div className="relative mb-3 flex items-baseline gap-2">
          <p
            className="text-3xl leading-none tracking-tight text-white"
            style={{ fontFamily: "var(--font-archivo), 'Archivo', sans-serif", fontWeight: 900 }}
          >
            {points.toLocaleString("de-DE")}
          </p>
          <p className="text-xs text-white/50 uppercase tracking-wider" style={{ fontFamily: "var(--font-archivo-narrow), sans-serif", fontWeight: 700 }}>
            Pkt.
          </p>
        </div>
      ) : (
        <div className="relative mb-5 text-center">
          <p
            className="text-[56px] leading-none tracking-tight text-white drop-shadow"
            style={{ fontFamily: "var(--font-archivo), 'Archivo', sans-serif", fontWeight: 900, letterSpacing: "-0.04em" }}
          >
            {points.toLocaleString("de-DE")}
          </p>
          <p
            className="text-[10px] text-white/50 uppercase tracking-widest mt-1.5"
            style={{ fontFamily: "var(--font-archivo-narrow), sans-serif", fontWeight: 700, letterSpacing: "0.22em" }}
          >
            Treuepunkte
          </p>
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
              className="h-full rounded-full transition-all duration-700 progress-gold"
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <div
            className="flex justify-between text-[10px] text-white/40"
            style={{ fontFamily: "var(--font-archivo-narrow), sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}
          >
            <span>{progress.current} / {progress.max} Pkt.</span>
            <span>→ {nextLevelLabel[progress.nextLevel]}</span>
          </div>
        </div>
      ) : (
        <p
          className="relative text-[11px] text-white/50 font-medium tracking-wide"
          style={{ fontFamily: "var(--font-archivo-narrow), sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}
        >
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
