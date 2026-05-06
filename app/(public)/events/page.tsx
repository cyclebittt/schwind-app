import Link from "next/link";
import { Calendar, Clock, MapPin, Users, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  type: "regular" | "special" | "sport" | "tour";
  points?: number;
  capacity?: number;
  bookable: boolean;
  image?: string;
}

const EVENTS: Event[] = [
  {
    id: "e1",
    title: "Frühschoppen",
    subtitle: "Jeden Sonntag ab 10 Uhr – Live-Musik am ersten Sonntag des Monats",
    date: "Jeden Sonntag",
    time: "10:00 – 14:00 Uhr",
    type: "regular",
    points: 8,
    bookable: false,
  },
  {
    id: "e2",
    title: "Champions League live",
    subtitle: "Alle UEFA CL-Spiele auf der großen Leinwand – Schwindbräu vom Fass",
    date: "Spieltage",
    time: "Ab Anpfiff",
    type: "sport",
    points: 5,
    bookable: false,
  },
  {
    id: "e3",
    title: "Maibock-Anstich",
    subtitle: "Unser Frühlingsbock feiert Premiere – 6,5% malzig-vollmundig",
    date: "Sa, 17. Mai 2026",
    time: "15:00 Uhr",
    type: "special",
    points: 15,
    capacity: 80,
    bookable: true,
  },
  {
    id: "e4",
    title: "Vatertagsparty",
    subtitle: "Großes Fest im Biergarten – Live-Musik, Spanferkel, Schwindbräu",
    date: "Do, 29. Mai 2026",
    time: "11:00 – 22:00 Uhr",
    type: "special",
    points: 20,
    capacity: 200,
    bookable: true,
  },
];

const TOURS = [
  {
    id: "t1",
    title: "Brauereiführung",
    description:
      "Erlebe unsere Brauerei von innen: Sudhaus, Gärkeller, Lagerkeller. Abschluss mit Bierverkostung direkt am Fass. Perfekt für Gruppen und Bierliebhaber.",
    duration: "ca. 90 Minuten",
    group: "bis 15 Personen",
    price: "12 € pro Person",
    points: 30,
    dates: ["Sa, 24. Mai 2026 – 10:00 Uhr", "Sa, 07. Jun 2026 – 10:00 Uhr", "Sa, 21. Jun 2026 – 10:00 Uhr"],
  },
  {
    id: "t2",
    title: "Bierkeller-Führung",
    description:
      "Exklusiver Blick in unsere historischen Lagerkeller. Kleine Gruppe, großes Erlebnis. Mit Degustation von drei Schwindbräu-Sorten direkt im Keller.",
    duration: "ca. 60 Minuten",
    group: "bis 8 Personen",
    price: "16 € pro Person",
    points: 25,
    dates: ["Fr, 23. Mai 2026 – 18:00 Uhr", "Fr, 06. Jun 2026 – 18:00 Uhr"],
  },
];

const typeColors: Record<string, string> = {
  regular: "bg-blue-50 text-blue-700 border-blue-200",
  special: "bg-amber-50 text-amber-700 border-amber-200",
  sport:   "bg-green-50 text-green-700 border-green-200",
  tour:    "bg-purple-50 text-purple-700 border-purple-200",
};

const typeLabels: Record<string, string> = {
  regular: "Regelmäßig",
  special: "Sonderevent",
  sport:   "Live-Sport",
  tour:    "Führung",
};

export default function EventsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Events & Führungen</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Erlebe Schwindbräu – sammle Punkte bei jedem Event</p>
      </div>

      {/* Upcoming Events */}
      <section className="space-y-4">
        <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Veranstaltungen</h2>
        {EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 card-shadow space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[var(--color-text)]">{event.title}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${typeColors[event.type]}`}>
                    {typeLabels[event.type]}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-muted)]">{event.subtitle}</p>
              </div>
              {event.points && (
                <div className="flex items-center gap-1 text-[var(--color-accent)] font-mono font-semibold text-sm whitespace-nowrap">
                  <Trophy className="w-3.5 h-3.5" />
                  +{event.points} Pkt.
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {event.time}
              </span>
              {event.capacity && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> max. {event.capacity} Gäste
                </span>
              )}
            </div>

            {event.bookable && (
              <Link href={`/reserve?note=Event: ${encodeURIComponent(event.title)}`}>
                <Button size="sm" variant="secondary" className="w-full mt-1">
                  Tisch reservieren <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </section>

      {/* Brewery Tours */}
      <section className="space-y-4">
        <h2 className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Brauereiführungen</h2>
        {TOURS.map((tour) => (
          <div
            key={tour.id}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 card-shadow space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-[var(--color-text)]">{tour.title}</h3>
              <div className="flex items-center gap-1 text-[var(--color-accent)] font-mono font-semibold text-sm whitespace-nowrap">
                <Trophy className="w-3.5 h-3.5" />
                +{tour.points} Pkt.
              </div>
            </div>

            <p className="text-sm text-[var(--color-muted)]">{tour.description}</p>

            <div className="flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {tour.duration}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {tour.group}</span>
              <span className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">{tour.price}</span>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Nächste Termine</p>
              {tour.dates.map((d) => (
                <div key={d} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text)]">{d}</span>
                  <Link href={`/reserve?note=Führung: ${encodeURIComponent(tour.title)} – ${encodeURIComponent(d)}`}>
                    <span className="text-[var(--color-accent)] text-xs font-medium hover:underline">Anmelden →</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Table reservation CTA */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <MapPin className="w-5 h-5 text-[var(--color-accent)] mt-0.5 shrink-0" />
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-[var(--color-text)]">Tisch reservieren</h3>
            <p className="text-sm text-[var(--color-muted)]">
              Plane deinen Besuch – für Events, Frühschoppen oder einfach so. Online reservieren, +8 Punkte sichern.
            </p>
            <Link href="/reserve">
              <Button size="sm" className="mt-1">Jetzt reservieren</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
