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
      className="shrink-0 md:hidden tab-bar-ios"
      style={{ paddingBottom: "max(28px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex justify-around items-center pt-2 px-3">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-[3px] flex-1 py-1"
            >
              <Icon
                className="w-6 h-6 transition-colors"
                style={{ color: active ? "var(--color-accent)" : "var(--color-muted-light)" }}
                strokeWidth={active ? 2.2 : 1.6}
              />
              <span
                className="text-[10px] font-semibold transition-colors"
                style={{
                  fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
                  color: active ? "var(--color-accent)" : "var(--color-muted-light)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
