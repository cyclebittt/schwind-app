"use client";

import { useState } from "react";
import { Users, Copy, Check } from "lucide-react";

export function InviteFriend({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${userId.slice(0, 8)}`
      : `https://schwind-app.vercel.app/register?ref=${userId.slice(0, 8)}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-3 card-shadow">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-[var(--color-muted)]" />
        <h2 className="font-bold text-[var(--color-text)] text-sm">Freund einladen – 20 Punkte sichern</h2>
      </div>
      <p className="text-xs text-[var(--color-muted)]">
        Lade einen Freund ein, der sich registriert – du erhältst <strong className="text-[var(--color-text)]">20 Bonuspunkte</strong> sobald er seinen ersten Bierkauf hat.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 text-xs bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-[var(--color-muted)] truncate font-mono">
          {inviteLink}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Kopiert!" : "Kopieren"}
        </button>
      </div>
    </section>
  );
}
