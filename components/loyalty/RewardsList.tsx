"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Beer, Ticket, Package, MapPin } from "lucide-react";

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

const typeIcon: Record<string, React.ElementType> = {
  drink: Beer,
  tour:  MapPin,
  merch: Package,
  event: Ticket,
};

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {rewards.filter((r) => r.available).map((reward) => {
        const canRedeem = userPoints >= reward.points_required;
        const progress = Math.min((userPoints / reward.points_required) * 100, 100);
        const Icon = typeIcon[reward.type] ?? Beer;

        return (
          <div
            key={reward.id}
            className="bg-[var(--color-surface)] rounded-[18px] overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.05)" }}
          >
            {/* Visual header — navy with gold icon */}
            <div
              className="h-[88px] flex items-center justify-center relative"
              style={{
                background: [
                  "radial-gradient(80% 80% at 50% 100%, rgba(200,146,10,0.15) 0%, transparent 70%)",
                  "#1C2836",
                ].join(", "),
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(200,146,10,0.18)", color: "var(--color-gold-2)" }}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="text-sm text-[var(--color-text)] leading-tight"
                  style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
                >
                  {reward.name}
                </h3>
                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span
                    className="text-lg leading-none"
                    style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, color: "var(--color-accent)", letterSpacing: "-0.02em" }}
                  >
                    {reward.points_required}
                  </span>
                  <span
                    className="text-[9px] uppercase"
                    style={{ fontFamily: "var(--font-archivo-narrow), sans-serif", fontWeight: 700, letterSpacing: "0.14em", color: "var(--color-muted-warm)" }}
                  >
                    Pkt.
                  </span>
                </div>
              </div>

              {reward.description && (
                <p className="text-xs text-[var(--color-muted)] leading-snug">{reward.description}</p>
              )}

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: canRedeem
                        ? "linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-2) 100%)"
                        : "var(--color-surface-3)",
                    }}
                  />
                </div>
                {!canRedeem && (
                  <p className="text-[10px] text-[var(--color-muted)]">
                    {userPoints} / {reward.points_required} Pkt.
                  </p>
                )}
              </div>

              {confirmed === reward.id ? (
                <div
                  className="text-xs text-[var(--color-success)] bg-green-50 border border-green-200 px-3 py-2 rounded-xl"
                  style={{ fontFamily: "var(--font-archivo-narrow), sans-serif", fontWeight: 600 }}
                >
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
