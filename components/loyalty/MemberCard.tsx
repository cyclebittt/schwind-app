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
      className="relative overflow-hidden rounded-[22px] text-white select-none member-card-bg"
      style={{ padding: compact ? 16 : "22px 22px 24px" }}
    >
      {/* Noise texture */}
      <div className="noise-overlay" aria-hidden />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-5">
        <div style={{ fontFamily: "var(--font-narrow), 'Archivo Narrow', sans-serif", lineHeight: 1 }}>
          <div className="text-[13px] font-extrabold tracking-[0.12em] uppercase text-white">SCHWIND</div>
          <div className="text-[9px] font-bold tracking-[0.22em] uppercase mt-0.5" style={{ color: "var(--gold)" }}>
            Am Dalberg
          </div>
        </div>

        <span
          className="text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "var(--font-narrow), 'Archivo Narrow', sans-serif",
            background: "rgba(200,146,10,0.20)",
            border: "1px solid rgba(200,146,10,0.35)",
            color: "var(--gold-soft)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Points block */}
      {compact ? (
        <div className="relative mb-4 flex items-baseline gap-2">
          <p className="num-display text-white" style={{ fontSize: 36 }}>
            {points.toLocaleString("de-DE")}
          </p>
          <p
            className="text-white/50 uppercase"
            style={{ fontFamily: "var(--font-narrow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em" }}
          >
            Pkt.
          </p>
        </div>
      ) : (
        <div className="relative mb-5">
          <p
            className="text-white/50 uppercase mb-1"
            style={{ fontFamily: "var(--font-narrow), sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.24em", margin: 0 }}
          >
            Treuepunkte
          </p>
          <p className="num-display text-white" style={{ fontSize: 64, marginTop: 4 }}>
            {points.toLocaleString("de-DE")}
          </p>
        </div>
      )}

      {/* Name */}
      <p
        className="relative font-semibold text-white/75 mb-4"
        style={{ fontSize: compact ? 13 : 14, letterSpacing: "0.01em" }}
      >
        {name || "—"}
      </p>

      {/* Level progress */}
      {progress.nextLevel ? (
        <div className="relative space-y-2">
          <div className="progress">
            <div className="fill" style={{ width: `${Math.min(progress.percentage, 100)}%` }} />
          </div>
          <div
            className="flex justify-between text-white/40 text-[10px]"
            style={{ fontFamily: "var(--font-narrow), sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}
          >
            <span>{progress.current} / {progress.max} Pkt.</span>
            <span>→ {nextLevelLabel[progress.nextLevel]}</span>
          </div>
        </div>
      ) : (
        <p
          className="relative text-white/45 text-[11px] font-bold uppercase tracking-widest"
          style={{ fontFamily: "var(--font-narrow), sans-serif" }}
        >
          Höchstes Level erreicht
        </p>
      )}

      {/* QR trigger */}
      {!compact && userId && (
        <QRDrawer userId={userId} name={name} points={points} />
      )}
    </div>
  );
}
