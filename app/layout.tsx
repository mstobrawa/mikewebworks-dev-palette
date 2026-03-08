import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { SiteNavbar } from "@/components/site-navbar";
import { cn } from "@/lib/utils";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Mike Webworks - Dev Palette Generator",
  description: "Generate developer-ready color palettes and export them to CSS, SCSS, Tailwind, and design tokens."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(sans.variable, mono.variable)}>
      <body className="font-[var(--font-sans)] antialiased">
        <div className="relative flex min-h-screen flex-col">
          <SiteNavbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
