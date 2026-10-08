import type { AccessToken } from "@/pages/acces-prive/types";

const DAY_MS = 86400000;

export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / DAY_MS);
}

export function isTokenActive(token: AccessToken): boolean {
  if (token.blocked || !token.activated_at || !token.expires_at) return false;
  return new Date(token.expires_at).getTime() >= Date.now();
}

export function isTokenUnused(token: AccessToken): boolean {
  return !token.blocked && !token.activated_at;
}

export function isTokenExpiredOrBlocked(token: AccessToken): boolean {
  if (token.blocked) return true;
  return !!token.expires_at && new Date(token.expires_at).getTime() < Date.now();
}

export function isExpiringSoon(token: AccessToken, withinDays = 3): boolean {
  if (!isTokenActive(token)) return false;
  const days = daysUntil(token.expires_at);
  return days !== null && days >= 0 && days <= withinDays;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return "—";
  }
}