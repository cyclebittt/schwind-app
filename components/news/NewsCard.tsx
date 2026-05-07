import Image from "next/image";
import { formatDate } from "@/lib/utils/time";

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  type: "general" | "event" | "special" | "sport";
  pinned: boolean;
  published_at: string;
}

const typeLabels: Record<NewsPost["type"], string> = {
  general: "Allgemein",
  event:   "Event",
  special: "Angebot",
  sport:   "Sport",
};

const typeColors: Record<NewsPost["type"], string> = {
  general: "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
  event:   "bg-[var(--color-deep)]/8 text-[var(--color-deep)]",
  special: "bg-green-50 text-green-700",
  sport:   "bg-blue-50 text-blue-700",
};

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden card-shadow">
      {post.image_url && (
        <div className="relative h-44 w-full">
          <Image src={post.image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {post.pinned && (
            <span className="text-xs font-semibold bg-[var(--color-deep)] text-white px-2 py-0.5 rounded-md tracking-wide">
              Angeheftet
            </span>
          )}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${typeColors[post.type]}`}>
            {typeLabels[post.type]}
          </span>
          <span className="text-xs text-[var(--color-muted)] ml-auto">{formatDate(post.published_at)}</span>
        </div>
        <h3 className="font-semibold text-[var(--color-text)]">{post.title}</h3>
        <p className="text-sm text-[var(--color-muted)] line-clamp-3">{post.content}</p>
      </div>
    </article>
  );
}
