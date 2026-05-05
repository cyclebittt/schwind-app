"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserPoints } from "@/lib/hooks/useUserPoints";

const navLinks = [
  { href: "/",        label: "Aktuelles"   },
  { href: "/menu",    label: "Speisekarte" },
  { href: "/reserve", label: "Reservieren" },
];

export function Navbar() {
  const pathname = usePathname();
  const { profile } = useUserPoints();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-border)] shadow-sm hidden md:block">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--color-text)] leading-none">SCHWIND Bräu</div>
            <div className="text-[10px] text-[var(--color-muted)]">Seit 1761</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                "px-4 py-2 rounded-lg text-base font-medium transition-all duration-150",
                pathname === href
                  ? "bg-[var(--color-surface-2)] text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <>
              <Link
                href="/loyalty"
                className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] font-semibold px-3 py-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <Trophy className="w-4 h-4" />
                {profile.points} Pkt.
              </Link>
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-accent)] transition-colors">
                  <User className="w-5 h-5 text-[var(--color-muted)]" />
                </div>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="secondary">Anmelden</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
