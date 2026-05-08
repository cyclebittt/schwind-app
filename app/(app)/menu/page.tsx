export default function MenuPage() {
  const items = [
    { category: "Biere vom Fass", dishes: [
      { name: "Schwindbräu Helles", desc: "Unser Hausbier · mild & frisch", price: "4,50 €" },
      { name: "Schwindbräu Dunkles", desc: "Vollmundig mit Röstaromen", price: "4,80 €" },
      { name: "Weizen", desc: "Hefeweizen · naturtrüb", price: "4,90 €" },
      { name: "Radler", desc: "Halb Helles, halb Limo", price: "4,20 €" },
    ]},
    { category: "Baukastenküche", dishes: [
      { name: "Obazda & Brez'n", desc: "Hausgemacht, mit Schnittlauch", price: "7,90 €" },
      { name: "Schweinshaxe", desc: "Kross gebraten · Krautsalat & Knödel", price: "16,90 €" },
      { name: "Steckerlfisch", desc: "Makrele vom Holzkohlegrill", price: "12,50 €" },
      { name: "Wurstsalat", desc: "Lyoner · Zwiebeln · Essig-Öl", price: "9,50 €" },
      { name: "Käsespätzle", desc: "Überbacken · Röstzwiebeln", price: "11,90 €" },
    ]},
    { category: "Kleine Gerichte", dishes: [
      { name: "Laugenbrezel", desc: "Frisch gebacken", price: "2,50 €" },
      { name: "Radi mit Butter", desc: "Bayrische Art", price: "4,50 €" },
      { name: "Brezen-Chips", desc: "Hausgemacht · Dip", price: "3,90 €" },
    ]},
  ];

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "8px 0 32px" }}>

      {/* Header */}
      <div style={{ padding: "8px 20px 20px" }}>
        <p className="eyebrow">Schwind Bräu</p>
        <h1 className="large-title">Speisekarte</h1>
        <p className="subtitle">Frisch · Regional · Ehrlich</p>
      </div>

      {/* Banner */}
      <div style={{ margin: "0 20px 24px", background: "var(--navy)", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(200,146,10,0.20)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.8 4 4.4.6-3.2 3.1.8 4.4-3.8-2.1-3.8 2.1.8-4.4-3.2-3.1 4.4-.6z"/>
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>+15 Punkte pro Bier</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Zeige beim Anstoß deinen QR-Code</p>
        </div>
      </div>

      {/* Menu sections */}
      {items.map(({ category, dishes }) => (
        <div key={category}>
          <p className="section-label">{category}</p>
          <div style={{ margin: "0 20px 20px", background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.04)" }}>
            {dishes.map((dish, i) => (
              <div key={dish.name} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderTop: i === 0 ? "none" : "0.5px solid rgba(60,60,67,0.18)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.41px" }}>{dish.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--ios-secondary)" }}>{dish.desc}</p>
                </div>
                <span style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 14, color: "var(--crimson)", flexShrink: 0, letterSpacing: "-0.01em" }}>{dish.price}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer note */}
      <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", margin: "8px 20px 0", lineHeight: 1.6 }}>
        Alle Preise inkl. MwSt. · Saisonale Änderungen vorbehalten.
      </p>
    </div>
  );
}
