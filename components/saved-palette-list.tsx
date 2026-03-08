"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { PaletteRecord } from "@/types/palette";
import { formatDate } from "@/lib/utils";

type SavedPaletteListProps = {
  initialPalettes: PaletteRecord[];
};

export function SavedPaletteList({ initialPalettes }: SavedPaletteListProps) {
  const [palettes, setPalettes] = useState(initialPalettes);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const response = await fetch(`/api/palettes/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setPalettes((current) => current.filter((item) => item.id !== id));
      }
    });
  }

  if (!palettes.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-8 text-sm text-muted">
        No palettes saved yet. Generate a palette and save it from the generator page.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {palettes.map((palette) => (
        <article key={palette.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ink">{palette.name}</h3>
              <p className="text-sm text-muted">{formatDate(palette.created_at)}</p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDelete(palette.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-rose-300/20 hover:text-rose-200 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {Object.entries(palette.colors).map(([role, value]) => (
              <div key={role} className="overflow-hidden rounded-2xl border border-white/10">
                <div className="h-20" style={{ backgroundColor: value }} />
                <div className="bg-black/20 px-3 py-2">
                  <p className="text-xs capitalize text-muted">{role}</p>
                  <p className="font-mono text-xs text-ink">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
