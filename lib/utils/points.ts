import type { SupabaseClient } from "@supabase/supabase-js";

export const BEER_TYPES = [
  { id: "helles",        name: "Helles (0,3l)",             points: 2 },
  { id: "helles_05",     name: "Helles (0,5l)",             points: 3 },
  { id: "helles_trüb",   name: "Helles naturtrüb (0,5l)",   points: 3 },
  { id: "export",        name: "Export (0,5l)",              points: 3 },
  { id: "pilsner",       name: "Pilsner (0,4l)",            points: 3 },
  { id: "dunkel",        name: "Dunkel (0,5l)",              points: 3 },
  { id: "jubilaeum",     name: "Jubiläumsbier 1761 (0,5l)", points: 4 },
  { id: "saison",        name: "Sommerhalbe SAISON (0,5l)", points: 4 },
  { id: "weizen",        name: "Hefeweizen (0,5l)",         points: 3 },
  { id: "rotgold",       name: "Rotgold Flasche (0,5l)",    points: 3 },
  { id: "radler",        name: "MAIN Radler (0,33l)",       points: 2 },
  { id: "alkoholfrei",   name: "ZERO,33 alkoholfrei",       points: 2 },
  { id: "bierflight",    name: "Bierflight 4×0,1l",         points: 5 },
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
