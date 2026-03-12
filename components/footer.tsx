import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Dev Palette Generator for developers and designers shipping faster. · v1.0.0</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="https://buymeacoffee.com/mikewebworks"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center text-sm text-muted transition hover:text-cyan-100"
          >
            <span className="group-hover:hidden">Support Mike Webworks ☕</span>
            <span className="hidden group-hover:inline">Buy me a coffee ☕</span>
          </Link>
          <Link
            href="https://mikewebworks.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-cyan-300/15"
          >
            <Sparkles className="h-4 w-4" />
            <span>Crafted by Mike Webworks</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
