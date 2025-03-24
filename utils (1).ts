import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " anni fa";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " mesi fa";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " giorni fa";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " ore fa";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minuti fa";
  }
  return Math.floor(seconds) + " secondi fa";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function formatRating(rating: number): string {
  // Rating is stored as an integer 0-50 (0-5.0)
  return (rating / 10).toFixed(1);
}
