import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { SiteNavbar } from "@/components/site-navbar";
import { ToastHost } from "@/components/toast-host";
import { cn, getAppBaseUrl } from "@/lib/utils";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  title: {
    default: "Dev Palette Generator",
    template: "%s | Dev Palette Generator",
  },
  description: "Generate UI color palettes and export them to Tailwind, CSS variables or design tokens.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Dev Palette Generator",
    description: "Generate UI color palettes and export them to Tailwind, CSS variables or design tokens.",
    url: getAppBaseUrl(),
    siteName: "Dev Palette Generator",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Palette Generator",
    description: "Generate UI color palettes and export them to Tailwind or CSS variables.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/final-logo-small-svg.svg",
  },
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
        <ToastHost />
      </body>
    </html>
  );
}
