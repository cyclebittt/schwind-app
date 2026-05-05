"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/formatters";

interface Category { id: string; name: string; sort: number; }
interface MenuItem { id: string; category_id: string; name: string; description: string | null; price: number; available: boolean; }

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [catName, setCatName] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const [{ data: cats }, { data: its }] = await Promise.all([
      supabase.from("menu_categories").select("*").order("sort"),
      supabase.from("menu_items").select("*").order("sort"),
    ]);
    setCategories(cats ?? []);
    setItems(its ?? []);
    if (cats?.length && !selectedCat) setSelectedCat(cats[0].id);
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("menu_categories").insert({ name: catName, sort: categories.length + 1 });
    setCatName("");
    setLoading(false);
    load();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCat) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("menu_items").insert({
      category_id: selectedCat,
      name: itemName,
      description: itemDesc || null,
      price: parseFloat(itemPrice),
      available: true,
      sort: items.filter((i) => i.category_id === selectedCat).length + 1,
    });
    setItemName(""); setItemDesc(""); setItemPrice("");
    setLoading(false);
    load();
  }

  async function toggleAvailable(item: MenuItem) {
    const supabase = createClient();
    await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id);
    load();
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Speisekarte verwalten</h1>

      {/* Add category */}
      <form onSubmit={addCategory} className="bg-white border border-[var(--color-border)] rounded-xl p-5 flex gap-3 card-shadow">
        <input
          type="text" required value={catName} onChange={(e) => setCatName(e.target.value)}
          placeholder="Neue Kategorie..."
          className="flex-1 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
        />
        <Button type="submit" loading={loading} size="sm">Anlegen</Button>
      </form>

      {/* Add item */}
      <form onSubmit={addItem} className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-3 card-shadow">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Neues Gericht / Getränk</h2>
        <select
          value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]"
        >
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="text" required value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Name"
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]" />
        <input type="text" value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} placeholder="Beschreibung (optional)"
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]" />
        <input type="number" required step="0.01" min="0" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="Preis in €"
          className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-accent)]" />
        <Button type="submit" loading={loading} size="sm" className="w-full">Hinzufügen</Button>
      </form>

      {/* Items list by category */}
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category_id === cat.id);
        if (!catItems.length) return null;
        return (
          <section key={cat.id}>
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-2">{cat.name}</h2>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div key={item.id} className="bg-white border border-[var(--color-border)] rounded-xl p-4 flex items-center justify-between card-shadow">
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text)]">{item.name}</p>
                    {item.description && <p className="text-xs text-[var(--color-muted)]">{item.description}</p>}
                    <p className="text-xs font-semibold text-[var(--color-accent)] mt-0.5">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={["text-xs px-3 py-1.5 rounded-lg border transition-colors", item.available ? "border-green-300 text-green-700 bg-green-50" : "border-red-300 text-red-700 bg-red-50"].join(" ")}
                  >
                    {item.available ? "Verfügbar" : "Ausverkauft"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
