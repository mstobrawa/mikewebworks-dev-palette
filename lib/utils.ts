import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);
  return didCopy;
}

export function hexToRgbString(hex: string) {
  const value = hex.replace("#", "");
  const parts = value.length === 3 ? value.split("").map((part) => part + part) : value.match(/.{1,2}/g);

  if (!parts || parts.length !== 3) {
    return "0, 0, 0";
  }

  const [r, g, b] = parts.map((part) => parseInt(part, 16));
  return `${r}, ${g}, ${b}`;
}

function hexToRgbChannels(hex: string) {
  const value = hex.replace("#", "");
  const parts = value.length === 3 ? value.split("").map((part) => part + part) : value.match(/.{1,2}/g);

  if (!parts || parts.length !== 3) {
    return [0, 0, 0] as const;
  }

  return parts.map((part) => parseInt(part, 16)) as [number, number, number];
}

function toRelativeLuminance(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function getContrastRatio(foreground: string, background: string) {
  const [fr, fg, fb] = hexToRgbChannels(foreground);
  const [br, bg, bb] = hexToRgbChannels(background);
  const foregroundLuminance =
    0.2126 * toRelativeLuminance(fr) +
    0.7152 * toRelativeLuminance(fg) +
    0.0722 * toRelativeLuminance(fb);
  const backgroundLuminance =
    0.2126 * toRelativeLuminance(br) +
    0.7152 * toRelativeLuminance(bg) +
    0.0722 * toRelativeLuminance(bb);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastLabel(ratio: number) {
  if (ratio >= 7) {
    return "WCAG AAA";
  }

  if (ratio >= 4.5) {
    return "WCAG AA";
  }

  return "Needs work";
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

export function getAppBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
