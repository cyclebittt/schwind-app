import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SCHWIND AM DALBERG",
  description: "Seit 1761 – Brauerei & Gaststätte in Erlenbach am Main. Treuepunkte, Events & Reservierungen.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SCHWIND AM DALBERG",
  },
  other: {
    // Full-screen PWA on iOS
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = {
  // Cover the notch + home indicator area on iPhone
  viewportFit: "cover",
  // Prevent user zoom – feels more native
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Status bar tints
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#120C00" },
    { media: "(prefers-color-scheme: dark)",  color: "#120C00" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${jakarta.variable} ${geistMono.variable}`}>
      {/* h-full + overflow-hidden enforced via globals.css on html/body */}
      <body className="h-full overflow-hidden flex flex-col bg-[var(--color-bg)]">
        {children}
      </body>
    </html>
  );
}
