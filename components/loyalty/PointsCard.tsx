"use client";

import { PointsDisplay } from "@/components/ui/PointsDisplay";
import { LevelBadge } from "./LevelBadge";
import { progressToNextLevel, LEVELS } from "@/lib/utils/points";
import type { Level } from "@/lib/utils/points";

const nextLevelNames: Record<string, string> = {
  silver: "Bierkenner",
  gold:   "Braumeister",
};

export function PointsCard({ points, level, name }: { points: number; level: Level; name: string }) {
  const progress = progressToNextLevel(points);

  return (
    <div className={["bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4 card-shadow", level === "gold" ? "gold-glow" : ""].join(" ")}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[var(--color-muted)] text-xs uppercase tracking-wider mb-1">Willkommen zurück</p>
          <p className="text-[var(--color-text)] font-semibold">{name}</p>
        </div>
        <LevelBadge level={level} />
      </div>

      <PointsDisplay points={points} size="lg" />

      {progress.nextLevel && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
            <span>{progress.current} / {progress.max} Pkt. bis {nextLevelNames[progress.nextLevel]}</span>
            <span>{Math.round(progress.percentage)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-700 rounded-full"
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Nächstes Level: <strong className="text-[var(--color-text)]">{LEVELS[progress.nextLevel].label}</strong>
          </p>
        </div>
      )}

      {!progress.nextLevel && (
        <p className="text-xs text-amber-600 font-medium">Höchstes Level – du bist echter Braumeister!</p>
      )}
    </div>
  );
}
