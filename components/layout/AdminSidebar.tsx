"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Newspaper, UtensilsCrossed, Beer, LogOut } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin",               label: "Dashboard",     icon: LayoutDashboard, exact: true },
  { href: "/admin/purchases",     label: "Bierkauf",      icon: Beer             },
  { href: "/admin/reservations",  label: "Reservierungen",icon: Calendar         },
  { href: "/admin/news",          label: "News",          icon: Newspaper        },
  { href: "/admin/menu",          label: "Speisekarte",   icon: UtensilsCrossed  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-56 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-[var(--color-border)] flex flex-col items-center gap-1">
        <Image src="/logo-dark.svg" alt="SCHWIND Bräu" width={100} height={62} />
        <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-widest font-medium">Admin</span>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[var(--color-accent)] text-white font-medium"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[var(--color-border)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-danger)] w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
