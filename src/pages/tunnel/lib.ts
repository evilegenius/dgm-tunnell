import { supabase } from "@/lib/supabase";

export interface TunnelConfig {
  id: number;
  name: string;
  type: string;
  content: string | null;
}

export interface TunnelCountry {
  id: number;
  name: string;
  flag: string | null;
  configs: TunnelConfig[];
}

export interface TunnelData {
  expires_at: string | null;
  token: {
    code: string;
    days: number;
    remaining_days: number | null;
  };
  countries: TunnelCountry[];
}

export type LoginResult = { ok: true; data: TunnelData } | { ok: false; message: string };

const DEVICE_KEY = "dgm_tunnel_device_id";
const TOKEN_KEY = "dgm_tunnel_token";

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Identifiant d'appareil stable, généré une fois et conservé dans le navigateur. */
export function getDeviceId(): string {
  const store = safeStorage();
  try {
    const existing = store?.getItem(DEVICE_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    store?.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

export function getSavedToken(): string {
  try {
    return safeStorage()?.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveToken(token: string): void {
  try {
    safeStorage()?.setItem(TOKEN_KEY, token);
  } catch {
    // Ignoré.
  }
}

export function clearSavedToken(): void {
  try {
    safeStorage()?.removeItem(TOKEN_KEY);
  } catch {
    // Ignoré.
  }
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function formatClock(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
  } catch {
    return "";
  }
}

/** Appelle la fonction login-token (jamais d'accès direct aux tables). */
export async function loginWithToken(code: string): Promise<LoginResult> {
  try {
    const { data: res, error: fnError } = await supabase.functions.invoke("login-token", {
      body: { token: code, device_id: getDeviceId() },
    });

    if (fnError) {
      let message = "Connexion impossible. Vérifie ta connexion puis réessaie.";
      const context = (fnError as unknown as { context?: Response }).context;
      if (context && typeof context.json === "function") {
        try {
          const body = await context.json();
          if (body && typeof body.message === "string" && body.message) message = body.message;
        } catch {
          // On garde le message par défaut.
        }
      }
      return { ok: false, message };
    }

    if (!res || res.success !== true) {
      return { ok: false, message: (res && res.message) || "Jeton invalide." };
    }

    return { ok: true, data: res as TunnelData };
  } catch {
    return { ok: false, message: "Connexion impossible. Vérifie ta connexion puis réessaie." };
  }
}

const TYPE_BADGE_STYLES: Record<string, string> = {
  VLESS: "border-[#e6007e]/40 bg-[#e6007e]/10 text-[#c2006a]",
  VMESS: "border-[#c026d3]/40 bg-[#c026d3]/10 text-[#a21caf]",
  TROJAN: "border-[#dc2626]/40 bg-[#dc2626]/10 text-[#dc2626]",
  SSH: "border-[#16a34a]/40 bg-[#16a34a]/10 text-[#15803d]",
  DNS: "border-[#d97706]/40 bg-[#d97706]/10 text-[#b45309]",
  SHADOWSOCKS: "border-[#0d9488]/40 bg-[#0d9488]/10 text-[#0f766e]",
  HYSTERIA2: "border-[#c026d3]/40 bg-[#c026d3]/10 text-[#a21caf]",
};

/** Classe de couleur du badge correspondant au type de configuration. */
export function typeBadgeClass(type: string): string {
  return TYPE_BADGE_STYLES[(type || "").toUpperCase()] ?? "border-[#f7cfe3] bg-black/5 text-[#6b3651]";
}

const USAGE_KEYWORDS: { tag: string; words: string[] }[] = [
  { tag: "Streaming", words: ["stream", "netflix", "youtube", "video", "media", "iptv"] },
  { tag: "P2P", words: ["p2p", "torrent", "peer", "download"] },
  { tag: "Gaming", words: ["game", "gaming", "play", "latency", "low-latency"] },
];

/**
 * Étiquettes d'usage déduites du nom de la configuration (Streaming / P2P /
 * Gaming). Toute configuration est au minimum « Secure ».
 */
export function deriveConfigTags(name: string): string[] {
  const value = (name || "").toLowerCase();
  const tags = ["Secure"];
  USAGE_KEYWORDS.forEach(({ tag, words }) => {
    if (words.some((word) => value.includes(word))) tags.push(tag);
  });
  return tags;
}

/** Extrait l'adresse et le port d'un lien de configuration (Best effort). */
export function parseEndpoint(content: string | null): { host: string; port: string } | null {
  if (!content) return null;
  const value = content.trim();
  if (!value) return null;
  try {
    if (value.startsWith("vmess://")) {
      const decoded = JSON.parse(atob(value.slice("vmess://".length).trim()));
      const host = String(decoded?.add ?? "").trim();
      if (!host) return null;
      return { host, port: String(decoded?.port ?? "").trim() };
    }
    const withoutScheme = value.replace(/^[a-z0-9]+:\/\//i, "");
    const atIndex = withoutScheme.indexOf("@");
    const hostPart = withoutScheme.slice(atIndex + 1).split(/[/?#]/)[0];
    const [host, port = ""] = hostPart.split(":");
    if (!host) return null;
    return { host, port };
  } catch {
    return null;
  }
}