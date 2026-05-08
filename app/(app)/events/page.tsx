const EVENTS = [
  {
    id: "e1",
    title: "Frühschoppen",
    subtitle: "Jeden Sonntag",
    date: "So · 10:00 – 13:00 Uhr",
    desc: "Frisch gezapftes Helles, Weißwurst & Brez'n. Der klassische Münchner Sonntagsauftakt.",
    points: "+100 Pkt.",
    tag: "Wöchentlich",
    color: "var(--gold)",
    bg: "rgba(200,146,10,0.10)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
      </svg>
    ),
  },
  {
    id: "e2",
    title: "Bockbierfest",
    subtitle: "Starkbierzeit im März",
    date: "Fr. 14. März · 18:00 Uhr",
    desc: "Unser Schwindbräu Starkbier feiert Premiere. Live-Blasmusik, Spanferkel vom Grill.",
    points: "+50 Pkt.",
    tag: "Beliebt",
    color: "var(--crimson)",
    bg: "rgba(139,26,42,0.10)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/>
      </svg>
    ),
  },
  {
    id: "e3",
    title: "Brauerei-Tour",
    subtitle: "Jeden 1. Samstag",
    date: "Sa · 14:00 Uhr · 90 min",
    desc: "Führung durch unsere Hausbrauerei. Verkostung von 4 Bierstilen mit Braumeister Sepp.",
    points: "+200 Pkt.",
    tag: "Limitiert",
    color: "var(--navy)",
    bg: "rgba(28,40,54,0.10)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    ),
  },
  {
    id: "e4",
    title: "Weinabend",
    subtitle: "Fränkische Winzer zu Gast",
    date: "Mi. 26. März · 19:00 Uhr",
    desc: "Sechs Frankenweine im Glas-Tasting. Kleine Käse- und Wurstplatte inklusive.",
    points: "+30 Pkt.",
    tag: "Neu",
    color: "var(--gold-2)",
    bg: "rgba(224,164,26,0.10)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8M12 11v11M5 3h14v8a7 7 0 0 1-14 0V3z"/>
      </svg>
    ),
  },
];

export default function EventsPage() {
  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "8px 0 32px" }}>

      {/* Header */}
      <div style={{ padding: "8px 20px 20px" }}>
        <p className="eyebrow">Schwind Bräu</p>
        <h1 className="large-title">Events &<br />Stammtisch</h1>
        <p className="subtitle">Reserviere früh — Plätze gehen weg.</p>
      </div>

      {/* Events list */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {EVENTS.map((ev) => (
          <div key={ev.id} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.04)" }}>

            {/* Color strip header */}
            <div style={{ background: ev.bg, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ev.bg, border: `1px solid ${ev.color}22`, color: ev.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {ev.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: ev.color }}>{ev.tag}</p>
                  <p style={{ margin: "2px 0 0", fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.01em" }}>{ev.title}</p>
                </div>
              </div>
              <span style={{ background: ev.bg, color: ev.color, border: `1px solid ${ev.color}44`, borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 10px", flexShrink: 0 }}>{ev.points}</span>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 16px 16px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "var(--ios-secondary)", letterSpacing: "-0.08px" }}>{ev.date}</p>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "var(--ink)", lineHeight: 1.4 }}>{ev.desc}</p>
              <a href="/reserve" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: 44, borderRadius: 12, background: "var(--navy)",
                color: "#fff", fontFamily: "var(--font-display, sans-serif)",
                fontWeight: 600, fontSize: 15, textDecoration: "none", gap: 6,
              }}>
                Platz reservieren
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", margin: "24px 20px 0", lineHeight: 1.6 }}>
        Mitglieder mit Bierkenner-Status erhalten bevorzugte Plätze.
      </p>
    </div>
  );
}
