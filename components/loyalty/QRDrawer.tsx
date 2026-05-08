"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

interface QRDrawerProps {
  userId: string;
  name: string;
  points: number;
}

export function QRDrawer({ userId, name, points }: QRDrawerProps) {
  const [open, setOpen] = useState(false);

  // Brighten screen while QR is visible
  useEffect(() => {
    if (open && "wakeLock" in navigator) {
      (navigator as Navigator & { wakeLock: { request: (t: string) => Promise<unknown> } }).wakeLock.request("screen").catch(() => {});
    }
  }, [open]);

  const shortCode = userId.slice(0, 8).toUpperCase();
  const pin       = userId.replace(/-/g, "").slice(0, 5).toUpperCase();
  const qrValue   = `schwindbräu://user/${userId}`;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%", marginTop: 16, height: 52, borderRadius: 16, border: "none",
          cursor: "pointer", background: "linear-gradient(160deg, var(--gold) 0%, var(--gold-2) 100%)",
          color: "#1a1407", fontFamily: "var(--font-display, 'Archivo', sans-serif)", fontWeight: 700,
          fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7M14 18h3v3"/>
        </svg>
        QR-Code zum Anstoß zeigen
      </button>
    );
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "linear-gradient(180deg, #1C2836 0%, #0F1822 100%)", display: "flex", flexDirection: "column", overflow: "hidden" }}
      onClick={() => setOpen(false)}
    >
      <div className="hero-grain" />

      <div
        style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 8px", color: "#fff" }}>
          <span style={{ opacity: 0.6, fontSize: 13, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>Anstoß-Code</span>
          <button onClick={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", color: "#fff", marginTop: 20 }}>
          <p style={{ margin: 0, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)" }}>Zeige dem Personal</p>
          <h1 style={{ margin: "8px 0 0", fontFamily: "var(--font-display, 'Archivo', sans-serif)", fontWeight: 900, fontSize: 30, letterSpacing: "-0.02em", color: "#fff" }}>Punkte sammeln</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Bildschirm wird automatisch heller.</p>
        </div>

        {/* QR card */}
        <div style={{ background: "#fff", borderRadius: 28, padding: 24, margin: "24px 0 0", boxShadow: "0 24px 60px -12px rgba(0,0,0,0.45)", position: "relative" }}>
          {/* Wordmark + level */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--font-narrow, 'Archivo Narrow', sans-serif)", lineHeight: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--navy)" }}>SCHWIND</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--crimson)", marginTop: 2 }}>Am Dalberg</div>
            </div>
            <span style={{ background: "rgba(200,146,10,0.16)", border: "1px solid rgba(200,146,10,0.30)", color: "var(--gold-2)", borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "5px 12px" }}>
              Mitglied
            </span>
          </div>

          {/* QR code with logo overlay */}
          <div style={{ position: "relative", background: "#fff", borderRadius: 16, overflow: "hidden", padding: 18, aspectRatio: "1" }}>
            <QRCodeSVG value={qrValue} size={280} bgColor="#ffffff" fgColor="#1A1408" level="M" style={{ width: "100%", height: "100%" }} />
            {/* Center logo */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 56, height: 56, background: "#fff", padding: 8, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image src="/logo-dark.svg" alt="" width={40} height={25} />
            </div>
          </div>

          {/* Name + member no. */}
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "0.04em" }}>{name.toUpperCase()}</p>
            <p style={{ margin: "4px 0 0", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 600, fontSize: 11, letterSpacing: "0.2em", color: "var(--muted)" }}>#{shortCode} · {points} PKT.</p>
          </div>

          {/* PIN row */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed rgba(26,24,20,0.14)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <p style={{ margin: 0, fontFamily: "'Archivo', monospace", fontWeight: 900, fontSize: 24, color: "var(--ink)", letterSpacing: "0.4em", paddingLeft: "0.4em" }}>{pin}</p>
            <span style={{ background: "var(--cream)", padding: "6px 10px", borderRadius: 8, fontFamily: "var(--font-narrow, sans-serif)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "var(--ink)" }}>PIN</span>
          </div>
        </div>

        {/* Recent gain */}
        <div style={{ marginTop: 20, background: "rgba(200,146,10,0.12)", border: "1px solid rgba(200,146,10,0.25)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--gold)", color: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8m0 0 4-4m-4 4-4-4M5 16v4h14v-4"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#fff" }}>Guthaben · {points} Punkte</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>App dem Personal zeigen zum Einlösen</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "24px 0 36px", lineHeight: 1.6 }}>
          Code aktualisiert sich alle 60 s.<br />Nicht weitergeben.
        </p>
      </div>
    </div>
  );
}
