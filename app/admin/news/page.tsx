"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/time";

interface NewsPost { id: string; title: string; content: string; type: string; pinned: boolean; published_at: string; }

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("general");
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    const supabase = createClient();
    const { data } = await supabase.from("news_posts").select("*").order("published_at", { ascending: false }).limit(30);
    setPosts(data ?? []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("news_posts").insert({ title, content, type, pinned });
    setTitle(""); setContent(""); setType("general"); setPinned(false);
    setLoading(false);
    loadPosts();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("news_posts").delete().eq("id", id);
    loadPosts();
  }

  const typeLabels: Record<string, string> = { general: "Allgemein", event: "Event", special: "Angebot", sport: "Sport" };
  const typeVariant: Record<string, "default" | "warning" | "success" | "silver"> = {
    general: "default", event: "warning", special: "success", sport: "silver",
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">News verwalten</h1>

      <form onSubmit={handleCreate} className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-4 card-shadow">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Neuer Beitrag</h2>
        <input
          type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
        />
        <textarea
          required value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Inhalt..."
          rows={4}
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)] resize-none"
        />
        <div className="flex gap-3 flex-wrap">
          <select
            value={type} onChange={(e) => setType(e.target.value)}
            className="border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
          >
            <option value="general">Allgemein</option>
            <option value="event">Event</option>
            <option value="special">Angebot</option>
            <option value="sport">Sport</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
            Anheften
          </label>
          <Button type="submit" loading={loading} size="sm" className="ml-auto">Veröffentlichen</Button>
        </div>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-[var(--color-border)] rounded-xl p-4 card-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {post.pinned && <span className="text-xs bg-[var(--color-accent)] text-white px-2 py-0.5 rounded">Angeheftet</span>}
                  <Badge variant={typeVariant[post.type] ?? "default"} size="sm">{typeLabels[post.type]}</Badge>
                  <span className="text-xs text-[var(--color-muted)]">{formatDate(post.published_at)}</span>
                </div>
                <p className="font-medium text-sm text-[var(--color-text)]">{post.title}</p>
                <p className="text-xs text-[var(--color-muted)] line-clamp-2">{post.content}</p>
              </div>
              <button onClick={() => handleDelete(post.id)} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] shrink-0">
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
