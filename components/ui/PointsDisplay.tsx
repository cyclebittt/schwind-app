"use client";

import { useEffect, useRef, useState } from "react";

interface PointsDisplayProps {
  points: number;
  size?: "sm" | "md" | "lg";
  label?: boolean;
}

const sizes = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" };

export function PointsDisplay({ points, size = "md", label = true }: PointsDisplayProps) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = points;
    if (from === to) return;
    const steps = 40;
    const step = (to - from) / steps;
    let current = from;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      current += step;
      if (count >= steps) { setDisplayed(to); clearInterval(interval); }
      else setDisplayed(Math.round(current));
    }, 800 / steps);
    prevRef.current = to;
    return () => clearInterval(interval);
  }, [points]);

  return (
    <span className="inline-flex items-baseline gap-1">
      <span className={`font-mono font-bold text-[var(--color-accent)] tabular-nums ${sizes[size]}`}>
        {displayed.toLocaleString("de-DE")}
      </span>
      {label && <span className="text-[var(--color-muted)] text-sm">Punkte</span>}
    </span>
  );
}
