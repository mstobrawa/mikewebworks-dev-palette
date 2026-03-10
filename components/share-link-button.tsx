"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import { cn, copyText } from "@/lib/utils";

type ShareLinkButtonProps = {
  path?: string;
  className?: string;
  defaultLabel?: string;
  copiedLabel?: string;
  useCurrentUrl?: boolean;
};

export function ShareLinkButton({
  path,
  className,
  defaultLabel = "Share",
  copiedLabel = "Link copied!",
  useCurrentUrl = false,
}: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = useCurrentUrl
      ? window.location.href
      : `${window.location.origin}${path ?? ""}`;
    const copiedSuccessfully = useCurrentUrl && navigator.clipboard?.writeText
      ? await navigator.clipboard.writeText(window.location.href).then(() => true).catch(() => copyText(shareUrl))
      : await copyText(shareUrl);

    if (!copiedSuccessfully) {
      return;
    }

    setCopied(true);
    showToast("Link copied!");
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        void handleShare();
      }}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink",
        className,
      )}
    >
      <Share2 className="h-4 w-4" />
      {copied ? copiedLabel : defaultLabel}
    </button>
  );
}
