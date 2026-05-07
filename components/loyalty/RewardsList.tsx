"use client";

import { useState } from "react";
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

// Icon SVGs per type
function RewardIcon({ type }: { type: string }) {
  if (type === "drink") return (
    <svg className="i" viewBox="0 0 24 24">
      <path d="M6 4h12v6a6 6 0 0 1-12 0z M6 7H3v2a3 3 0 0 0 3 3M18 7h3v2a3 3 0 0 1-3 3M9 22h6"/>
    </svg>
  );
  if (type === "tour") return (
    <svg className="i" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
  if (type === "event") return (
    <svg className="i" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 10h18M8 3v4M16 3v4"/>
    </svg>
  );
  return (
    <svg className="i" viewBox="0 0 24 24">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM2 12h20"/>
    </svg>
  );
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
    } finally {
      setRedeeming(null);
    }
  }

  const available = rewards.filter((r) => r.available);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {available.map((reward) => {
        const canRedeem = userPoints >= reward.points_required;
        const progress = Math.min((userPoints / reward.points_required) * 100, 100);

        return (
          <div
            key={reward.id}
            className="bg-white rounded-[18px] overflow-hidden card-shadow flex flex-col"
          >
            {/* Visual header — navy + gold icon */}
            <div
              className="flex items-center justify-center relative"
              style={{
                height: 100,
                background: [
                  "radial-gradient(80% 80% at 50% 100%, rgba(200,146,10,0.15) 0%, transparent 70%)",
                  "var(--navy-2, #1C2836)",
                ].join(", "),
                color: "var(--gold)",
              }}
            >
              <div
                style={{
                  width: 44, height: 44,
                  borderRadius: 14,
                  background: "rgba(200,146,10,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <RewardIcon type={reward.type} />
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2.5 flex-1">
              {/* Name + points */}
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="text-sm leading-snug flex-1"
                  style={{
                    fontFamily: "var(--font-display), 'Archivo', sans-serif",
                    fontWeight: 700, color: "var(--ink)",
                    letterSpacing: "-0.01em", margin: 0,
                  }}
                >
                  {reward.name}
                </h3>
                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span
                    style={{
                      fontFamily: "var(--font-display), sans-serif",
                      fontWeight: 900, fontSize: 18,
                      color: "var(--crimson)", letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {reward.points_required}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-narrow), sans-serif",
                      fontWeight: 700, fontSize: 9,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    Pkt.
                  </span>
                </div>
              </div>

              {reward.description && (
                <p className="text-xs leading-snug" style={{ color: "var(--ios-secondary)", margin: 0 }}>
                  {reward.description}
                </p>
              )}

              {/* Progress */}
              <div className="space-y-1">
                <div
                  style={{ height: 5, borderRadius: 999, background: "var(--cream-2)", overflow: "hidden" }}
                >
                  <div
                    style={{
                      height: "100%", borderRadius: 999,
                      width: `${progress}%`,
                      background: canRedeem
                        ? "linear-gradient(90deg, var(--gold) 0%, var(--gold-2) 100%)"
                        : "var(--cream-2)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                {!canRedeem && (
                  <p style={{ fontSize: 10, color: "var(--ios-tertiary)", margin: 0 }}>
                    {userPoints} / {reward.points_required} Pkt.
                  </p>
                )}
              </div>

              {/* CTA */}
              {confirmed === reward.id ? (
                <div
                  className="text-xs text-center py-2 rounded-xl"
                  style={{
                    fontFamily: "var(--font-narrow), sans-serif",
                    fontWeight: 700, letterSpacing: "0.1em",
                    background: "rgba(22,163,74,0.08)",
                    color: "#16A34A",
                    border: "1px solid rgba(22,163,74,0.2)",
                  }}
                >
                  Eingelöst – zeige dem Personal diesen Bildschirm.
                </div>
              ) : (
                <button
                  disabled={!canRedeem || redeeming === reward.id}
                  onClick={() => handleRedeem(reward)}
                  className="w-full rounded-xl py-2.5 text-sm font-bold transition-all active:scale-[0.98]"
                  style={{
                    fontFamily: "var(--font-display), sans-serif",
                    fontWeight: 700,
                    background: canRedeem ? "var(--crimson)" : "var(--cream-2)",
                    color: canRedeem ? "#fff" : "var(--ios-tertiary)",
                    border: "none", cursor: canRedeem ? "pointer" : "default",
                    opacity: redeeming === reward.id ? 0.7 : 1,
                  }}
                >
                  {redeeming === reward.id
                    ? "Wird eingelöst…"
                    : canRedeem
                    ? "Einlösen"
                    : `Noch ${reward.points_required - userPoints} Pkt. fehlen`}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
