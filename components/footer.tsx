import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Dev Palette Generator for developers and designers shipping faster.</p>
        <Link
          href="https://mikewebworks.dev"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/15"
        >
          <span>Crafted by Mike Webworks</span>
        </Link>
      </div>
    </footer>
  );
}
