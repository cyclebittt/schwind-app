"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  type: string;
  available: boolean;
}

interface RewardsListProps {
  rewards: Reward[];
  userPoints: number;
  userId: string;
  onRedeem: () => void;
}

export function RewardsList({ rewards, userPoints, userId, onRedeem }: RewardsListProps) {
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  async function handleRedeem(reward: Reward) {
    if (userPoints < reward.points_required) return;
    setRedeeming(reward.id);
    try {
      const supabase = createClient();
      await supabase.from("reward_redemptions").insert({ user_id: userId, reward_id: reward.id });
      await supabase.from("profiles").update({ points: userPoints - reward.points_required }).eq("id", userId);
      await supabase.from("point_transactions").insert({
        user_id: userId,
        amount: -reward.points_required,
        reason: `Prämie eingelöst: ${reward.name}`,
      });
      setConfirmed(reward.id);
      onRedeem();
    } finally { setRedeeming(null); }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {rewards.filter((r) => r.available).map((reward) => {
        const canRedeem = userPoints >= reward.points_required;
        const progress = Math.min((userPoints / reward.points_required) * 100, 100);
        return (
          <Card key={reward.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-[var(--color-text)] text-sm">{reward.name}</h3>
              <span className="font-mono text-[var(--color-accent)] text-sm whitespace-nowrap ml-2">
                {reward.points_required} Pkt.
              </span>
            </div>
            {reward.description && (
              <p className="text-xs text-[var(--color-muted)]">{reward.description}</p>
            )}
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${canRedeem ? "bg-[var(--color-accent)]" : "bg-[var(--color-surface-3)]"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {!canRedeem && (
                <p className="text-[10px] text-[var(--color-muted)]">
                  {userPoints} / {reward.points_required} Pkt. ({Math.round(progress)}%)
                </p>
              )}
            </div>
            {confirmed === reward.id ? (
              <div className="text-xs text-[var(--color-success)] bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                Eingelöst – zeige dem Personal diesen Bildschirm.
              </div>
            ) : (
              <Button
                size="sm"
                variant={canRedeem ? "primary" : "secondary"}
                disabled={!canRedeem}
                loading={redeeming === reward.id}
                onClick={() => handleRedeem(reward)}
                className="w-full"
              >
                {canRedeem ? "Einlösen" : `Noch ${reward.points_required - userPoints} Pkt. fehlen`}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
