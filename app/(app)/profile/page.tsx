"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LevelBadge } from "@/components/loyalty/LevelBadge";
import type { Level } from "@/lib/utils/points";

interface Profile { id: string; name: string; phone: string | null; points: number; level: Level; }

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data as Profile);
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
        }
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
    setProfile((p) => p ? { ...p, name, phone: phone || null } : p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-[var(--color-muted)]">Laden...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-0.5" style={{ color: "var(--color-brand-red)" }}>SCHWIND AM DALBERG</p>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Profil</h1>
        </div>
        {profile && <LevelBadge level={profile.level} />}
      </div>

      {profile && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm text-[var(--color-muted)]">Treuepunkte</p>
          <p className="text-4xl font-bold font-mono text-[var(--color-accent)] mt-1">{profile.points}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Persönliche Daten</h2>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <Button type="submit" loading={saving} className="w-full">
          {saved ? "Gespeichert ✓" : "Speichern"}
        </Button>
      </form>

      <div className="pt-4 border-t border-[var(--color-border)]">
        <Button variant="ghost" onClick={handleLogout} className="w-full text-[var(--color-danger)]">
          Abmelden
        </Button>
      </div>
    </div>
  );
}
