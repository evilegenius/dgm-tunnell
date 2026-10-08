export interface JournalEntry {
  id: string;
  server: string;
  country: string;
  flag: string;
  type: string;
  startedAt: number;
  endedAt: number;
  durationSec: number;
  downloadMb: number;
  uploadMb: number;
}

const STORAGE_KEY = "dgm_tunnel_journal";
const MAX_ENTRIES = 80;

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Historique des connexions, conservé sur l'appareil (comme le journal d'une appli native). */
export function getJournal(): JournalEntry[] {
  const store = safeStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as JournalEntry[];
  } catch {
    return [];
  }
}

export function addJournalEntry(entry: JournalEntry): void {
  const store = safeStorage();
  if (!store) return;
  try {
    const list = [entry, ...getJournal()].slice(0, MAX_ENTRIES);
    store.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignoré.
  }
}

export function clearJournal(): void {
  const store = safeStorage();
  try {
    store?.removeItem(STORAGE_KEY);
  } catch {
    // Ignoré.
  }
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function formatDateTime(ts: number): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ts));
  } catch {
    return "";
  }
}

export function formatDataAmount(mb: number): string {
  if (!Number.isFinite(mb) || mb <= 0) return "0 Mo";
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} Go`;
  return `${mb.toFixed(1)} Mo`;
}