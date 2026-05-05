import { NewsCard, type NewsPost } from "./NewsCard";

export function NewsFeed({ posts }: { posts: NewsPost[] }) {
  if (!posts.length) {
    return <p className="text-sm text-[var(--color-muted)] py-4">Keine Beiträge vorhanden.</p>;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => <NewsCard key={post.id} post={post} />)}
    </div>
  );
}
