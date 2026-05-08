"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Level } from "@/lib/utils/points";

const levelLabel: Record<string, string> = { bronze: "Stammgast", silver: "Bierkenner", gold: "Braumeister" };

interface Profile { id: string; name: string; email?: string; phone: string | null; points: number; level: Level; visits?: number; redeemed?: number; }

function Row({ icon, label, right, red }: { icon: React.ReactNode; label: string; right?: React.ReactNode; red?: boolean }) {
  return (
    <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: red ? "rgba(139,26,42,0.10)" : "rgba(200,146,10,0.14)", color: red ? "var(--crimson)" : "var(--gold-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <p style={{ margin: 0, flex: 1, fontSize: 14, fontWeight: 600, color: red ? "var(--crimson)" : "var(--ink)" }}>{label}</p>
      {right ?? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [editing, setEditing] = useState(false);
  const [email,   setEmail]   = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setEmail(user.email ?? "");
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) { setProfile(data as Profile); setName(data.name ?? ""); setPhone(data.phone ?? ""); }
        setLoading(false);
      });
    });
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ name, phone: phone || null }).eq("id", profile.id);
    setProfile(p => p ? { ...p, name, phone: phone || null } : p);
    setSaved(true); setTimeout(() => { setSaved(false); setEditing(false); }, 1500);
    setSaving(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); router.push("/");
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--ios-sep)", borderTopColor: "var(--crimson)", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const initials = (profile?.name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const level    = profile?.level ?? "bronze";

  return (
    <div style={{ maxWidth: 460, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ padding: "8px 20px 20px" }}>
        <p className="eyebrow">Profil</p>
        <h1 className="large-title">Mein Konto</h1>
      </div>

      {/* ── Identity card ── */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, display: "flex", alignItems: "center", gap: 18, boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.05)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--navy) 0%, var(--crimson) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontFamily: "var(--font-display, 'Archivo', sans-serif)", fontWeight: 900, fontSize: 26, flexShrink: 0, letterSpacing: "-0.02em" }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-display, sans-serif)", fontWeight: 800, fontSize: 20, color: "var(--ink)", letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.name || "Stammgast"}</p>
            <p style={{ margin: "3px 0 8px", fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
            <span style={{ background: "rgba(200,146,10,0.14)", color: "var(--gold-2)", borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 10px" }}>
              {levelLabel[level]} · seit {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { val: profile?.points ?? 0,   label: "Punkte",  color: "var(--crimson)" },
            { val: profile?.visits ?? 0,   label: "Besuche", color: "var(--navy)"    },
            { val: profile?.redeemed ?? 0, label: "Prämien", color: "var(--gold-2)"  },
          ].map(({ val, label, color }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "14px 8px", textAlign: "center", boxShadow: "0 1px 3px rgba(26,24,20,0.06)" }}>
              <p className="num-display" style={{ fontSize: 24, color, margin: 0 }}>{val}</p>
              <p style={{ margin: "2px 0 0", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Edit form ── */}
      {editing ? (
        <div style={{ padding: "0 20px 20px" }}>
          <form onSubmit={handleSave} style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.05)" }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Persönliche Daten bearbeiten</p>
            {[
              { label: "Name",     value: name,  set: setName,  type: "text", placeholder: "Vor- und Nachname" },
              { label: "Telefon",  value: phone, set: setPhone, type: "tel",  placeholder: "+49 …" },
            ].map(({ label, value, set, type, placeholder }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <label style={{ fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ios-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
                <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                  style={{ width: "100%", background: "var(--ios-bg)", border: "1px solid rgba(26,24,20,0.10)", borderRadius: 12, padding: "12px 14px", fontSize: 16, color: "var(--ink)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, height: 48, borderRadius: 12, border: "1px solid rgba(26,24,20,0.12)", background: "transparent", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: 14 }}>Abbrechen</button>
              <button type="submit" disabled={saving} style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: saved ? "#16A34A" : "var(--navy)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: 14, opacity: saving ? 0.7 : 1 }}>
                {saved ? "Gespeichert ✓" : saving ? "…" : "Speichern"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* ── Konto section ── */}
      <p className="section-label">Konto</p>
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.05)" }}>
          <button type="button" onClick={() => setEditing(e => !e)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <Row icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>} label="Persönliche Daten" />
          </button>
          <div style={{ height: "0.5px", background: "rgba(60,60,67,0.12)", marginLeft: 60 }} />
          <Row
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8a7 7 0 0 1 14 0v6l2 4H3l2-4z"/><path d="M9 19a3 3 0 0 0 6 0"/></svg>}
            label="Mitteilungen"
            right={<span style={{ background: "var(--cream)", color: "var(--ink)", borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 10px" }}>3 neu</span>}
          />
        </div>
      </div>

      {/* ── Stammtisch section ── */}
      <p className="section-label">Stammtisch</p>
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 3px rgba(26,24,20,0.06),0 4px 12px rgba(26,24,20,0.05)" }}>
          <Row
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 14c2-1 4-1 6 0 1 .5 1 3 1 5"/></svg>}
            label="Freund einladen"
            right={<span style={{ background: "rgba(200,146,10,0.16)", color: "var(--gold-2)", border: "1px solid rgba(200,146,10,0.30)", borderRadius: 999, fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 700, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 10px" }}>+20 Pkt.</span>}
          />
          <div style={{ height: "0.5px", background: "rgba(60,60,67,0.12)", marginLeft: 60 }} />
          <Row
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z"/><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7"/></svg>}
            label="Hilfe & Kontakt"
          />
          <div style={{ height: "0.5px", background: "rgba(60,60,67,0.12)", marginLeft: 60 }} />
          <button type="button" onClick={handleLogout} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <Row
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h5v16h-5M9 12H3m0 0 4-4m-4 4 4 4"/></svg>}
              label="Abmelden"
              red
              right={null}
            />
          </button>
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-narrow, sans-serif)", fontWeight: 600, fontSize: 10, letterSpacing: "0.24em", color: "var(--muted)", margin: "28px 0 0", textTransform: "uppercase" }}>
          Schwind Bräu · App V 2.5.0
        </p>
      </div>

    </div>
  );
}
