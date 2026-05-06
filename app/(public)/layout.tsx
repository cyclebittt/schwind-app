import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      {/* Only this container scrolls – gives native app feel */}
      <main className="flex-1 app-scroll">
        {children}
        {/* Space for floating bottom nav + home indicator */}
        <div className="h-24 md:h-0" />
      </main>
      <BottomNav />
    </div>
  );
}
