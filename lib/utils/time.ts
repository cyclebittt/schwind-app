export const OPENING_HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: "10:00", close: "22:00" }, // Sonntag
  1: { open: "11:00", close: "23:00" }, // Montag
  2: { open: "11:00", close: "23:00" }, // Dienstag
  3: { open: "11:00", close: "23:00" }, // Mittwoch
  4: { open: "11:00", close: "23:00" }, // Donnerstag
  5: { open: "11:00", close: "00:00" }, // Freitag
  6: { open: "10:00", close: "00:00" }, // Samstag
};

export function isOpenNow(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hours = OPENING_HOURS[day];
  if (!hours) return false;
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const openMin = oh * 60 + om;
  let closeMin = ch * 60 + cm;
  if (closeMin === 0) closeMin = 24 * 60;
  return currentMin >= openMin && currentMin < closeMin;
}

export function getTodayOpeningHours(): string {
  const day = new Date().getDay();
  const hours = OPENING_HOURS[day];
  if (!hours) return "Heute geschlossen";
  return `${hours.open} – ${hours.close} Uhr`;
}

export function generateTimeSlots(date: Date): string[] {
  const day = date.getDay();
  const hours = OPENING_HOURS[day];
  if (!hours) return [];
  const slots: string[] = [];
  const [startH] = hours.open.split(":").map(Number);
  let endH = Number(hours.close.split(":")[0]);
  if (endH === 0) endH = 23;
  for (let h = startH; h <= endH - 1; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < endH - 1) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
