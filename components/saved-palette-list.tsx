"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { PaletteStrip } from "@/components/palette-strip";
import { ShareLinkButton } from "@/components/share-link-button";
import type { PaletteRecord } from "@/types/palette";
import { formatDate } from "@/lib/utils";

type SavedPaletteListProps = {
  initialPalettes: PaletteRecord[];
};

export function SavedPaletteList({ initialPalettes }: SavedPaletteListProps) {
  const router = useRouter();
  const [palettes, setPalettes] = useState(initialPalettes);
  const [isPending, startTransition] = useTransition();
  const [paletteToDelete, setPaletteToDelete] = useState<PaletteRecord | null>(null);
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(null);

  function handleDelete() {
    if (!paletteToDelete) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/palettes/${paletteToDelete.id}`, {
        method: "DELETE"
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (response.ok) {
        setPalettes((current) => current.filter((item) => item.id !== paletteToDelete.id));
        setPaletteToDelete(null);
        router.refresh();
        setNotice({
          title: "Palette deleted",
          description: `"${paletteToDelete.name}" was removed from Supabase and your dashboard.`,
        });
        return;
      }

      setNotice({
        title: "Delete failed",
        description: payload?.error ?? "The palette could not be deleted. Try again.",
      });
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {palettes.map((palette) => (
        <article
          key={palette.id}
          className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-panel transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <PaletteStrip palette={palette.colors} compact className="w-full" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link href={`/p/${palette.id}`} className="inline-block">
                  <h3 className="text-lg font-semibold text-ink transition hover:text-cyan-100">
                    {palette.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted">{formatDate(palette.created_at)}</p>
                <Link
                  href={`/generator?palette=${palette.id}`}
                  className="mt-2 inline-flex text-sm text-cyan-100 transition hover:text-cyan-50"
                >
                  Edit in generator
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <ShareLinkButton
                  path={`/p/${palette.id}`}
                  className="min-h-[44px]"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPaletteToDelete(palette);
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-muted transition hover:border-rose-300/20 hover:text-rose-200 disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}

      <Modal
        open={Boolean(paletteToDelete)}
        onClose={() => {
          if (!isPending) {
            setPaletteToDelete(null);
          }
        }}
        canClose={!isPending}
        title="Delete saved palette"
        description={
          paletteToDelete
            ? `Delete "${paletteToDelete.name}" from your dashboard and Supabase storage?`
            : undefined
        }
        icon={<Trash2 className="h-5 w-5" />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete palette"}
          </button>
          <button
            type="button"
            onClick={() => setPaletteToDelete(null)}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(notice)}
        onClose={() => setNotice(null)}
        title={notice?.title ?? ""}
        description={notice?.description}
        icon={<CheckCircle2 className="h-5 w-5" />}
      />
    </div>
  );
}
