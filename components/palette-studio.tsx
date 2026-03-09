"use client";

import {
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { CheckCircle2, History, Link2, Save } from "lucide-react";
import { ContrastChecker } from "@/components/contrast-checker";
import { ExportPanel } from "@/components/export-panel";
import { GenerateButton } from "@/components/generate-button";
import { HarmonySelector } from "@/components/harmony-selector";
import { Modal } from "@/components/modal";
import { PaletteStrip } from "@/components/palette-strip";
import { UIPreview } from "@/components/ui-preview";
import { showToast } from "@/lib/toast";
import { copyText } from "@/lib/utils";
import { generatePalette, paletteToSearchParam } from "@/lib/palette";
import type { HarmonyMode, Palette, PaletteRole } from "@/types/palette";

type PaletteStudioProps = {
  initialPalette: Palette;
  canSave: boolean;
};

export function PaletteStudio({ initialPalette, canSave }: PaletteStudioProps) {
  const [mode, setMode] = useState<HarmonyMode>("random");
  const [palette, setPalette] = useState(initialPalette);
  const [paletteId, setPaletteId] = useState<string | null>(null);
  const [lockedRoles, setLockedRoles] = useState<Record<PaletteRole, boolean>>({
    primary: false,
    secondary: false,
    accent: false,
    background: false,
    text: false,
  });
  const [history, setHistory] = useState<Palette[]>([initialPalette]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState(`Palette ${new Date().toLocaleDateString()}`);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(null);
  const deferredPalette = useDeferredValue(palette);

  function getLockedColors(currentPalette: Palette) {
    return (Object.entries(lockedRoles) as [PaletteRole, boolean][])
      .filter(([, isLocked]) => isLocked)
      .reduce<Partial<Record<PaletteRole, string>>>((accumulator, [role]) => {
        accumulator[role] = currentPalette[role];
        return accumulator;
      }, {});
  }

  const handleGenerate = () => {
    const nextPalette = generatePalette(mode, getLockedColors(palette));
    setPalette(nextPalette);
    setPaletteId(null);
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
    void sharePalette();
  }

  function openSaveModal() {
    setSaveError(null);
    setSaveName(`Palette ${new Date().toLocaleDateString()}`);
    setIsSaveModalOpen(true);
  }

  function closeSaveModal() {
    if (isSaving) return;
    setIsSaveModalOpen(false);
  }

  async function handleSave() {
    const nextId = await persistPalette(saveName.trim(), false);

    if (!nextId) {
      return;
    }

    setPaletteId(nextId);
    setIsSaveModalOpen(false);
    setNotice({
      title: "Palette saved",
      description: `"${saveName.trim()}" has been stored in Supabase and is ready in your dashboard.`,
    });
  }

  async function persistPalette(name: string, isPublic: boolean) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setSaveError("Give this palette a name before saving it.");
      return null;
    }

    setIsSaving(true);
    setSaveError(null);

    const response = await fetch("/api/palettes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: trimmedName, colors: palette, public: isPublic }),
    });

    setIsSaving(false);

    if (response.status === 401) {
      setSaveError("Sign in to save palettes.");
      return null;
    }

    if (!response.ok) {
      setSaveError("Saving failed. Check your Supabase configuration.");
      return null;
    }

    const data = (await response.json()) as { id: string };
    return data.id;
  }

  async function sharePalette() {
    let nextId = paletteId;

    if (!nextId) {
      const response = await fetch("/api/palettes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Shared palette",
          colors: palette,
          public: true,
        }),
      });

      if (!response.ok) {
        showToast("Share failed");
        return;
      }

      const data = (await response.json()) as { id?: string };
      nextId = data.id ?? null;

      if (!nextId) {
        showToast("Share failed");
        return;
      }

      setPaletteId(nextId);
    }

    const shareUrl = `${window.location.origin}/p/${nextId}`;
    const copied = await copyText(shareUrl);
    if (!copied) {
      showToast("Share failed");
      return;
    }
    showToast("Link copied!");
  }

  function toggleRoleLock(role: PaletteRole) {
    setLockedRoles((current) => ({
      ...current,
      [role]: !current[role],
    }));
  }

  return (
    <div className="grid gap-6 sm:gap-8">
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
          <div className="flex flex-wrap gap-3 sm:items-center sm:justify-center lg:justify-end">
            <GenerateButton onClick={handleGenerate} />
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink"
            >
              <Link2 className="h-4 w-4" />
              Share URL
            </button>
            <button
              type="button"
              onClick={openSaveModal}
              disabled={!canSave || isSaving}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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

      <section className="px-1 sm:px-0">
        <PaletteStrip
          palette={deferredPalette}
          lockedRoles={lockedRoles}
          onToggleLock={toggleRoleLock}
        />
        <p className="mt-3 text-sm text-muted">
          Click a lock icon to keep a color fixed. Press <span className="font-mono text-cyan-100">SPACE</span> to generate a new palette.
        </p>
      </section>

      <ContrastChecker palette={deferredPalette} />

      <div className="grid gap-8 xl:items-start xl:grid-cols-[1.2fr_0.8fr]">
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
                  onClick={() => {
                    setPalette(item);
                    setPaletteId(null);
                  }}
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

      <Modal
        open={isSaveModalOpen}
        onClose={closeSaveModal}
        canClose={!isSaving}
        title="Save palette"
        description="Name this palette before saving it to your Supabase dashboard."
        icon={<Save className="h-5 w-5" />}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm text-ink">Palette name</span>
            <input
              type="text"
              value={saveName}
              onChange={(event) => setSaveName(event.target.value)}
              placeholder="Spring launch palette"
              required
              autoFocus
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-cyan-200/50 focus:bg-white/10"
            />
          </label>

          {saveError ? (
            <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {saveError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save palette"}
            </button>
            <button
              type="button"
              onClick={closeSaveModal}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
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
