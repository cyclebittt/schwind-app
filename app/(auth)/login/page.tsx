"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* HIG: secondary label — 12pt caption, ~45% white on dark bg */}
      <label style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)" }}>
        {label}
      </label>
      {/* HIG: dark-mode system fill = rgba(118,118,128,0.24), 10px radius, 44px min, 17px body */}
      <input
        {...props}
        style={{
          background: "rgba(118,118,128,0.24)",
          border: "none",
          borderRadius: 10,
          padding: "12px 16px",
          minHeight: 44,
          fontSize: 17,
          color: "#fff",
          fontFamily: "inherit",
          outline: "none",
          WebkitUserSelect: "text",
          userSelect: "text",
          boxSizing: "border-box" as const,
          width: "100%",
        }}
      />
    </div>
  );
}

function AuthForm({ mode, onBack }: { mode: "login" | "register"; onBack: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const supabase = createClient();
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: `${location.origin}/auth/callback` } });
        if (error) throw error;
        setSuccess("Konto erstellt! Du kannst dich jetzt anmelden.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fehler";
      if (msg.includes("Email not confirmed")) setError("E-Mail noch nicht bestätigt.");
      else if (msg.includes("Invalid login credentials")) setError("E-Mail oder Passwort falsch.");
      else setError(msg);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 20 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontSize: 14, background: "none", border: "none", cursor: "pointer", marginBottom: 32, alignSelf: "flex-start", padding: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        Zurück
      </button>
      <h2 style={{ fontFamily: "var(--font-display, 'Archivo', sans-serif)", fontWeight: 900, fontSize: 34, letterSpacing: "-0.025em", color: "#fff", margin: "0 0 28px", lineHeight: 1 }}>
        {mode === "login" ? "Willkommen zurück." : "Werde Mitglied."}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "register" && <Field label="Name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Vor- und Nachname" />}
        <Field label="E-Mail" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
        <Field label="Passwort" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        {error   && <p style={{ margin: 0, fontSize: 13, color: "#FDA4AF", background: "rgba(220,38,38,0.12)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(220,38,38,0.2)" }}>{error}</p>}
        {success && <p style={{ margin: 0, fontSize: 13, color: "#86EFAC", background: "rgba(22,163,74,0.12)",  borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(22,163,74,0.2)" }}>{success}</p>}
        {/* HIG: primary button = 50px, radius 14px, font-size 17px weight 600 */}
        <button type="submit" disabled={loading} style={{ marginTop: 8, minHeight: 50, borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(160deg, var(--gold) 0%, var(--gold-2) 100%)", color: "#1a1407", fontFamily: "var(--font-display, sans-serif)", fontWeight: 600, fontSize: 17, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Bitte warten…" : mode === "login" ? "Anmelden" : "Konto erstellen"}
        </button>
      </form>
    </div>
  );
}

function WelcomeScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <>
      <div style={{ marginTop: 52, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative" }}>
        <Image src="/logo-dark.svg" alt="SCHWIND" width={108} height={68} priority style={{ opacity: 0.95 }} />
        <p style={{ fontFamily: "var(--font-narrow, 'Archivo Narrow', sans-serif)", fontWeight: 700, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", margin: 0 }}>
          Hopfen · Malz · Heimat
        </p>
      </div>

      <div style={{ marginTop: 60, position: "relative" }}>
        <h1 style={{ fontFamily: "var(--font-display, 'Archivo', sans-serif)", fontWeight: 900, fontSize: 42, letterSpacing: "-0.03em", lineHeight: 0.95, margin: 0, color: "#fff" }}>
          Willkommen<br />im <span style={{ color: "var(--gold)" }}>Stammtisch</span>.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.65)", margin: "18px 0 0" }}>
          Sammle Punkte bei jedem Besuch. Sichere dir Freibier, Brauereiführungen und Plätze, bevor andere reservieren.
        </p>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
        {[
          { bg: "rgba(200,146,10,0.14)", fg: "var(--gold)", title: "+15 Punkte pro Bier", sub: "Automatisch beim Anstoß erfasst", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.5 6 6.5.6-5 4.4 1.5 6.4L12 16l-5.5 3.4L8 13 3 8.6 9.5 8z"/></svg> },
          { bg: "rgba(139,26,42,0.22)", fg: "#E89AA4",      title: "Vorab-Reservierungen",     sub: "Frühschoppen, Bockfest, Weinabend", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg> },
          { bg: "rgba(255,255,255,0.08)", fg: "#fff",       title: "Drei Stufen, echte Vorteile", sub: "Stammgast → Bierkenner → Braumeister", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21h10M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/></svg> },
        ].map(({ bg, fg, title, sub, icon }) => (
          <div key={title} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>{title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingBottom: 44, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
        {/* HIG: primary 50px, radius 14px, 17px weight 600 */}
        <button onClick={onRegister} style={{ minHeight: 50, borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(160deg, var(--gold) 0%, var(--gold-2) 100%)", color: "#1a1407", fontFamily: "var(--font-display, sans-serif)", fontWeight: 600, fontSize: 17 }}>
          Mitglied werden
        </button>
        {/* HIG: secondary = same height, tinted bg, no border */}
        <button onClick={onLogin} style={{ minHeight: 50, borderRadius: 14, cursor: "pointer", background: "rgba(118,118,128,0.24)", color: "#fff", border: "none", fontFamily: "var(--font-display, sans-serif)", fontWeight: 600, fontSize: 17 }}>
          Bereits Mitglied · Anmelden
        </button>
      </div>
    </>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"welcome" | "login" | "register">("welcome");

  useEffect(() => {
    if (searchParams.get("mode") === "login")    setView("login");
    if (searchParams.get("mode") === "register") setView("register");
  }, [searchParams]);

  return (
    <main style={{ minHeight: "100dvh", background: "#0F1822", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="hero-bg" />
      <div className="hero-grain" />
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", padding: "0 28px", maxWidth: 460, margin: "0 auto", width: "100%" }}>
        {view === "welcome" && <WelcomeScreen onLogin={() => setView("login")} onRegister={() => setView("register")} />}
        {(view === "login" || view === "register") && <AuthForm mode={view} onBack={() => setView("welcome")} />}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", background: "#0F1822" }} />}>
      <LoginContent />
    </Suspense>
  );
}
