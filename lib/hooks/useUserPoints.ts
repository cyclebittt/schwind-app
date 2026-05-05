"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Level } from "@/lib/utils/points";

export interface UserProfile {
  id: string;
  name: string;
  phone: string | null;
  points: number;
  level: Level;
}

export function useUserPoints() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setLoading(false); return; }
    const supabase = createClient();

    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) setProfile(data as UserProfile);
      } catch { /* Demo-Modus */ } finally { setLoading(false); }
    }

    fetchProfile();
  }, []);

  return { profile, loading };
}
