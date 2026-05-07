"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

// Separate component so useSearchParams is inside a Suspense boundary
function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const cbError = searchParams.get("error");
    if (cbError) setError(cbError);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const supabase = createClient();

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccess("Konto erstellt! Du kannst dich jetzt anmelden.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Full page reload — bypasses Next.js Router Cache, reads fresh cookies
        window.location.href = "/";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.";
      if (msg.includes("Email not confirmed")) {
        setError("E-Mail noch nicht bestätigt. Bitte prüfe deinen Posteingang.");
      } else if (msg.includes("Invalid login credentials")) {
        setError("E-Mail oder Passwort ist falsch.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-deep)] flex items-center justify-center mx-auto">
          <Image src="/logo.svg" alt="SCHWIND AM DALBERG" width={36} height={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            <span style={{ color: "var(--color-brand)" }}>SCHWIND</span>{" "}
            <span style={{ color: "var(--color-brand-red)" }}>AM DALBERG</span>
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {mode === "login" ? "Melde dich an und sammle Punkte" : "Erstelle dein Konto"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">E-Mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Passwort</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-[var(--color-success)] bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {mode === "login" ? "Anmelden" : "Konto erstellen"}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)]">
        {mode === "login" ? (
          <>
            Noch kein Konto?{" "}
            <button
              onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
              className="text-[var(--color-accent)] font-semibold hover:underline"
            >
              Registrieren
            </button>
          </>
        ) : (
          <>
            Schon registriert?{" "}
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className="text-[var(--color-accent)] font-semibold hover:underline"
            >
              Anmelden
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <Suspense fallback={<div className="w-16 h-16 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
