import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import Image from "next/image";
import type { Route } from "next";

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/generator", label: "Generator" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-medium text-ink"
        >
          <Image
            src="/final-logo-small-svg.svg"
            alt="Mike Webworks"
            width={50}
            height={40}
          />

          <span>
            Mike Webworks
            <span className="block font-mono text-xs text-muted">
              Dev Palette Generator
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}
