"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { History, Link2, Save } from "lucide-react";
import { ExportPanel } from "@/components/export-panel";
import { GenerateButton } from "@/components/generate-button";
import { HarmonySelector } from "@/components/harmony-selector";
import { PaletteCard } from "@/components/palette-card";
import { UIPreview } from "@/components/ui-preview";
import { generatePalette, paletteToSearchParam } from "@/lib/palette";
import type { HarmonyMode, Palette } from "@/types/palette";

type PaletteStudioProps = {
  initialPalette: Palette;
  canSave: boolean;
};

export function PaletteStudio({ initialPalette, canSave }: PaletteStudioProps) {
  const [mode, setMode] = useState<HarmonyMode>("random");
  const [palette, setPalette] = useState(initialPalette);
  const [history, setHistory] = useState<Palette[]>([initialPalette]);
  const [isPending, startTransition] = useTransition();
  const deferredPalette = useDeferredValue(palette);
  const paletteEntries = useMemo(
    () => Object.entries(deferredPalette),
    [deferredPalette],
  );

  const handleGenerate = () => {
    const nextPalette = generatePalette(mode);
    setPalette(nextPalette);
    setHistory((current) => [nextPalette, ...current].slice(0, 8));
    const url = new URL(window.location.href);
    url.searchParams.set("palette", paletteToSearchParam(nextPalette));
    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tagName = (event.target as HTMLElement | null)?.tagName ?? "";
      if (
        event.code === "Space" &&
        tagName !== "INPUT" &&
        tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        handleGenerate();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleGenerate]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleSave() {
    startTransition(async () => {
      const name = window.prompt(
        "Palette name",
        `Palette ${new Date().toLocaleDateString()}`,
      );
      if (!name) return;

      const response = await fetch("/api/palettes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, colors: palette }),
      });

      if (response.status === 401) {
        window.alert("Sign in to save palettes.");
        return;
      }

      if (!response.ok) {
        window.alert("Saving failed. Check your Supabase configuration.");
        return;
      }

      window.alert("Palette saved.");
    });
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
              Generator
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Build polished palettes for production UIs.
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-muted lg:mx-0">
              Generate color systems with harmony rules, preview them in
              context, and ship exports straight into your stack.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-end">
            <GenerateButton onClick={handleGenerate} />
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink"
            >
              <Link2 className="h-4 w-4" />
              Share URL
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Palette (Pro)
            </button>
          </div>
        </div>
        <div className="mt-6">
          <HarmonySelector value={mode} onChange={setMode} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {paletteEntries.map(([role, value]) => (
          <PaletteCard key={role} label={role as keyof Palette} value={value} />
        ))}
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <UIPreview palette={deferredPalette} />
        <div className="space-y-8">
          <ExportPanel palette={deferredPalette} />
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
            <div className="flex items-center gap-2 text-ink">
              <History className="h-4 w-4" />
              <h2 className="text-sm font-medium">Palette history</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {history.map((item, index) => (
                <button
                  key={`${item.primary}-${index}`}
                  type="button"
                  onClick={() => setPalette(item)}
                  className="grid grid-cols-5 overflow-hidden rounded-2xl border border-white/10"
                >
                  {Object.values(item).map((value) => (
                    <span
                      key={value}
                      className="h-12"
                      style={{ backgroundColor: value }}
                    />
                  ))}
                </button>
              ))}
            </div>
            {!canSave ? (
              <p className="mt-4 text-sm text-muted">
                Sign in with Supabase Auth to unlock palette saving.
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
