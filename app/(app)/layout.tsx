import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <Navbar />

      {/* Scrollable content — bottom padding reserves space for fixed tab bar */}
      <main
        className="flex-1 app-scroll"
        style={{
          paddingBottom: "calc(49px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </main>

      {/* Tab bar — fixed to the very bottom of the viewport */}
      <BottomNav />
    </div>
  );
}
