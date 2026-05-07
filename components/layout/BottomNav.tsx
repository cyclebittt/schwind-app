"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Beer, PartyPopper, Trophy, User } from "lucide-react";

const tabs = [
  { href: "/",        label: "News",        icon: Newspaper   },
  { href: "/menu",    label: "Speisekarte", icon: Beer        },
  { href: "/events",  label: "Events",      icon: PartyPopper },
  { href: "/loyalty", label: "Punkte",      icon: Trophy      },
  { href: "/profile", label: "Profil",      icon: User        },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="shrink-0 md:hidden bg-[var(--color-bg)]"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {/* Floating pill container */}
      <div className="mx-3 mt-1">
        <div
          className="bg-white/95 backdrop-blur-md rounded-2xl grid grid-cols-5 h-[62px] px-1"
          style={{
            boxShadow:
              "0 4px 16px rgba(28,20,8,0.12), 0 16px 48px rgba(28,20,8,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors relative"
              >
                {/* Active background pill */}
                {active && (
                  <span className="absolute inset-x-1 inset-y-1 rounded-xl bg-[var(--color-accent-light)]" />
                )}
                <Icon
                  className={[
                    "relative w-[22px] h-[22px] transition-colors",
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-muted-light)]",
                  ].join(" ")}
                  strokeWidth={active ? 2.2 : 1.7}
                />
                <span
                  className={[
                    "relative text-[10px] font-semibold tracking-wide transition-colors",
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-muted-light)]",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
