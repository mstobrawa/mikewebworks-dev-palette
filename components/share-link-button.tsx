"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import { cn, copyText } from "@/lib/utils";

type ShareLinkButtonProps = {
  path: string;
  className?: string;
  defaultLabel?: string;
  copiedLabel?: string;
};

export function ShareLinkButton({
  path,
  className,
  defaultLabel = "Share",
  copiedLabel = "Link copied!",
}: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = `${window.location.origin}${path}`;
    await copyText(shareUrl);
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
