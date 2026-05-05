import type { SupabaseClient } from "@supabase/supabase-js";

export const BEER_TYPES = [
  { id: "helles",      name: "Schwindbräu Helles (0,5l)",   points: 3 },
  { id: "weissbier",   name: "Schwindbräu Weißbier (0,5l)", points: 3 },
  { id: "spezial",     name: "Schwindbräu Spezial (0,5l)",  points: 5 },
  { id: "saisonbier",  name: "Saisonbier",                  points: 5 },
  { id: "radler",      name: "Radler (0,5l)",               points: 2 },
  { id: "alkoholfrei", name: "Alkoholfrei (0,5l)",          points: 2 },
] as const;

export type BeerTypeId = typeof BEER_TYPES[number]["id"];

export const POINT_RULES = {
  TABLE_RESERVATION: 8,
  DAILY_CHECKIN: 5,
} as const;

export const LEVELS = {
  bronze: { min: 0,   max: 149,     label: "Stammgast" },
  silver: { min: 150, max: 399,     label: "Bierkenner" },
  gold:   { min: 400, max: Infinity, label: "Braumeister" },
} as const;

export type Level = keyof typeof LEVELS;

export function calculateLevel(points: number): Level {
  if (points >= 400) return "gold";
  if (points >= 150) return "silver";
  return "bronze";
}

export function progressToNextLevel(points: number): {
  current: number;
  max: number;
  percentage: number;
  nextLevel: Level | null;
} {
  if (points >= 400) {
    return { current: points - 400, max: Infinity, percentage: 100, nextLevel: null };
  }
  if (points >= 150) {
    return { current: points - 150, max: 250, percentage: ((points - 150) / 250) * 100, nextLevel: "gold" };
  }
  return { current: points, max: 150, percentage: (points / 150) * 100, nextLevel: "silver" };
}

export async function awardPoints(
  userId: string,
  amount: number,
  reason: string,
  supabase: SupabaseClient
) {
  await supabase.from("point_transactions").insert({ user_id: userId, amount, reason });

  const { data: profile } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", userId)
    .single();

  const newPoints = (profile?.points ?? 0) + amount;
  const newLevel = calculateLevel(newPoints);

  await supabase
    .from("profiles")
    .update({ points: newPoints, level: newLevel })
    .eq("id", userId);

  return { points: newPoints, level: newLevel };
}
