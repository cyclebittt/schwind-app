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
      <section className="bg-[var(--color-deep)] rounded-2xl p-5">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/40">SCHWIND AM DALBERG</p>
          <h2 className="font-bold text-white">Treuepunkte sammeln</h2>
          <p className="text-sm text-white/60">
            Vom Stammgast zum Braumeister – jeder Kauf bringt Punkte. Löse sie gegen Freigetränke, Führungen und mehr ein.
          </p>
          <Link href="/login" className="inline-block mt-2 text-sm font-semibold text-white/90 underline underline-offset-2">
            Jetzt registrieren
          </Link>
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
        <Link href="/loyalty" className="text-sm text-[var(--color-muted)] font-medium hover:text-[var(--color-text)] flex items-center gap-1">
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
