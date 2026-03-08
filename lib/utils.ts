import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}
