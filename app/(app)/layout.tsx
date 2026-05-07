import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="flex-1 app-scroll">
        {children}
        <div className="h-6 md:h-0" />
      </main>
      <BottomNav />
    </div>
  );
}
