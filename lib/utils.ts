import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

export function getShareUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fs-tribute.example.com";
  return `${siteUrl}${path}`;
}
