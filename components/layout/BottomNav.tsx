"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Beer, PartyPopper, Trophy, User } from "lucide-react";

const tabs = [
  { href: "/",        label: "News",        icon: Newspaper    },
  { href: "/menu",    label: "Speisekarte", icon: Beer         },
  { href: "/events",  label: "Events",      icon: PartyPopper  },
  { href: "/loyalty", label: "Punkte",      icon: Trophy       },
  { href: "/profile", label: "Profil",      icon: User         },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--color-border)] shadow-[0_-2px_12px_rgba(28,22,8,0.08)] md:hidden">
      <div className="grid grid-cols-5 h-[68px]">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors py-2",
                active ? "text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
              ].join(" ")}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
