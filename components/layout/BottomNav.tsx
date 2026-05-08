"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    svg: (
      <svg style={{ width: 24, height: 24, stroke: "currentColor", strokeWidth: "inherit", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} viewBox="0 0 24 24">
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    href: "/menu",
    label: "Speisen",
    svg: (
      <svg style={{ width: 24, height: 24, stroke: "currentColor", strokeWidth: "inherit", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} viewBox="0 0 24 24">
        <path d="M17 11V3l-2 2-2-2v8M17 11l2 9H5l2-9M17 11H7" />
      </svg>
    ),
  },
  {
    href: "/events",
    label: "Events",
    svg: (
      <svg style={{ width: 24, height: 24, stroke: "currentColor", strokeWidth: "inherit", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} viewBox="0 0 24 24">
        <path d="M12 3l1.8 4 4.4.6-3.2 3.1.8 4.4-3.8-2.1-3.8 2.1.8-4.4-3.2-3.1 4.4-.6z" />
      </svg>
    ),
  },
  {
    href: "/loyalty",
    label: "Punkte",
    svg: (
      <svg style={{ width: 24, height: 24, stroke: "currentColor", strokeWidth: "inherit", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} viewBox="0 0 24 24">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profil",
    svg: (
      <svg style={{ width: 24, height: 24, stroke: "currentColor", strokeWidth: "inherit", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="shrink-0 md:hidden tab-bar-ios"
      aria-label="Hauptnavigation"
      style={{
        /* HIG: tab bar content height = 49px, plus safe-area */
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 49,           /* HIG: tab bar = 49pt */
          alignItems: "stretch",
          padding: "0 4px",
        }}
      >
        {tabs.map(({ href, label, svg }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              style={{
                /* HIG: each tab = full flex-1, min 44px touch width */
                flex: 1,
                minWidth: 44,      /* HIG hit-target minimum */
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                color: active ? "var(--crimson)" : "var(--ios-tertiary)",
                textDecoration: "none",
              }}
            >
              {/* HIG: tab icon = 24–25pt */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  color: active ? "var(--crimson)" : "var(--ios-tertiary)",
                  /* active tab icons get slightly heavier stroke */
                  strokeWidth: active ? "2.1" : "1.6",
                }}
              >
                {svg}
              </span>
              {/* HIG: tab label = 10pt, SF Pro Text / system */}
              <span
                style={{
                  fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
                  fontSize: 10,
                  fontWeight: active ? 600 : 500,
                  letterSpacing: 0.12,
                  color: active ? "var(--crimson)" : "var(--ios-tertiary)",
                  lineHeight: 1,
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
