"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Copy, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
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
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copiedColorKey, setCopiedColorKey] = useState<string | null>(null);

  async function handleShare(id: string) {
    const shareUrl = `${window.location.origin}/p/${id}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLinkId(id);
    window.setTimeout(() => setCopiedLinkId((current) => (current === id ? null : current)), 1200);
  }

  async function handleCopyColor(paletteId: string, role: string, value: string) {
    await navigator.clipboard.writeText(value);
    const key = `${paletteId}-${role}`;
    setCopiedColorKey(key);
    window.setTimeout(() => setCopiedColorKey((current) => (current === key ? null : current)), 1200);
  }

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
    <div className="grid gap-4">
      {palettes.map((palette) => (
        <article key={palette.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ink">{palette.name}</h3>
              <p className="text-sm text-muted">{formatDate(palette.created_at)}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleShare(palette.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-white/20 hover:text-ink"
              >
                <Share2 className="h-4 w-4" />
                {copiedLinkId === palette.id ? "Link copied!" : "Share"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setPaletteToDelete(palette)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-rose-300/20 hover:text-rose-200 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {Object.entries(palette.colors).map(([role, value]) => (
              <button
                key={role}
                type="button"
                onClick={() => void handleCopyColor(palette.id, role, value)}
                className="overflow-hidden rounded-2xl border border-white/10 text-left transition hover:border-white/20"
              >
                <div className="h-20" style={{ backgroundColor: value }} />
                <div className="bg-black/20 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs capitalize text-muted">{role}</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 font-mono text-[10px] text-muted">
                      <Copy className="h-3 w-3" />
                      {copiedColorKey === `${palette.id}-${role}` ? "Copied!" : "HEX"}
                    </span>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-ink">{value}</p>
                </div>
              </button>
            ))}
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
