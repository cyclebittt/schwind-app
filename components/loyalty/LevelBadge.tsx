import { Badge } from "@/components/ui/Badge";
import type { Level } from "@/lib/utils/points";
import { LEVELS } from "@/lib/utils/points";

export function LevelBadge({ level }: { level: Level }) {
  const map: Record<Level, "bronze" | "silver" | "gold"> = {
    bronze: "bronze",
    silver: "silver",
    gold:   "gold",
  };
  return <Badge variant={map[level]}>{LEVELS[level].label}</Badge>;
}
