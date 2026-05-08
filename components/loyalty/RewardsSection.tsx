"use client";

import { useState } from "react";
import { RewardsList } from "./RewardsList";
import type { Reward } from "./RewardsList";

const FILTER_CHIPS = [
  { key: "all",   label: "Alle" },
  { key: "drink", label: "Bier & Drinks" },
  { key: "event", label: "Erlebnisse" },
  { key: "merch", label: "Merch" },
  { key: "tour",  label: "Touren" },
];

interface RewardsSectionProps {
  rewards: Reward[];
  userPoints: number;
  userId: string;
}

export function RewardsSection({ rewards, userPoints, userId }: RewardsSectionProps) {
  const [filter, setFilter] = useState("all");
  const [key, setKey] = useState(0);

  const filtered = filter === "all" ? rewards : rewards.filter(r => r.type === filter);

  return (
    <div style={{ padding: "0 20px 24px" }}>
      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {FILTER_CHIPS.map(({ key: k, label }) => {
          const active = filter === k;
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              style={{
                flexShrink: 0,
                height: 34,
                padding: "0 16px",
                borderRadius: 999,
                border: active ? "none" : "1px solid rgba(26,24,20,0.12)",
                background: active ? "var(--navy)" : "#fff",
                color: active ? "#fff" : "var(--ink)",
                fontFamily: "var(--font-narrow, sans-serif)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.06em",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Rewards grid */}
      <RewardsList
        key={key}
        rewards={filtered}
        userPoints={userPoints}
        userId={userId}
        onRedeem={() => setKey(k => k + 1)}
      />
    </div>
  );
}
