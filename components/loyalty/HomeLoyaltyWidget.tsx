"use client";

import { useUserPoints } from "@/lib/hooks/useUserPoints";
import { MemberCard } from "@/components/loyalty/MemberCard";
import { progressToNextLevel } from "@/lib/utils/points";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function HomeLoyaltyWidget() {
  const { profile, loading } = useUserPoints();

  // Not logged in → generic teaser
  if (!loading && !profile) {
    return (
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🍺</div>
          <div className="space-y-1">
            <h2 className="font-bold text-[var(--color-text)]">Sammle Punkte mit jedem Bier</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Vom Stammgast zum Braumeister: Jeder Bierkauf bringt Treuepunkte. Löse sie gegen Freigetränke, Brauerei-Touren und mehr ein.
            </p>
            <Link href="/login" className="inline-block mt-2 text-sm font-semibold text-[var(--color-accent)] hover:underline">
              Jetzt registrieren →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="h-44 rounded-2xl bg-[var(--color-surface-2)] animate-pulse" />
    );
  }

  // Logged in → real card + next action
  const progress = progressToNextLevel(profile!.points);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text)]">Meine Mitgliedskarte</h2>
        <Link href="/loyalty" className="text-sm text-[var(--color-accent)] font-medium hover:underline flex items-center gap-1">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <Link href="/loyalty">
        <MemberCard
          points={profile!.points}
          level={profile!.level}
          name={profile!.name}
          compact={false}
        />
      </Link>

      {progress.nextLevel && (
        <p className="text-xs text-[var(--color-muted)] text-center">
          Noch <strong className="text-[var(--color-text)]">{progress.max - progress.current} Punkte</strong> bis zum nächsten Level – einfach App zeigen!
        </p>
      )}
    </section>
  );
}
