export type VpnServerStatus = "online" | "offline" | "maintenance";

export type VpnProtocol = "WireGuard" | "OpenVPN" | "IKEv2" | "L2TP";

export interface VpnServer {
  id: number;
  name: string;
  country: string | null;
  city: string | null;
  host: string | null;
  protocol: string;
  port: number;
  status: string;
  capacity: number;
  connected: number;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export type VpnKeyStatus = "active" | "revoked" | "expired";

export interface VpnKey {
  id: number;
  label: string;
  server_id: number | null;
  key_value: string | null;
  status: string;
  expires_at: string | null;
  notes: string | null;
  created_at?: string;
}

export const SERVER_STATUS_META: Record<string, { label: string; className: string; dot: string }> = {
  online: {
    label: "En ligne",
    className: "bg-primary-500/15 text-primary-300 border-primary-500/40",
    dot: "bg-primary-400",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-accent-500/15 text-accent-300 border-accent-500/40",
    dot: "bg-accent-400",
  },
  offline: {
    label: "Hors ligne",
    className: "bg-secondary-500/15 text-secondary-300 border-secondary-500/40",
    dot: "bg-secondary-400",
  },
};

export const KEY_STATUS_META: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary-500/15 text-primary-300 border-primary-500/40" },
  revoked: { label: "Révoquée", className: "bg-secondary-500/15 text-secondary-300 border-secondary-500/40" },
  expired: { label: "Expirée", className: "bg-background-300/60 text-foreground-400 border-background-400/60" },
};

export interface Country {
  id: number;
  name: string;
  flag: string | null;
  active: boolean;
  created_at?: string;
}

export type ConfigType =
  | "VLESS"
  | "VMess"
  | "Trojan"
  | "SSH"
  | "DNS"
  | "Shadowsocks"
  | "Hysteria2"
  | "Autre";

export const CONFIG_TYPES: ConfigType[] = [
  "VLESS",
  "VMess",
  "Trojan",
  "SSH",
  "DNS",
  "Shadowsocks",
  "Hysteria2",
  "Autre",
];

export interface VpnConfig {
  id: number;
  country_id: number;
  name: string;
  type: string;
  content: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AccessToken {
  id: number;
  code: string;
  days: number;
  max_devices: number;
  blocked: boolean;
  activated_at: string | null;
  expires_at: string | null;
  note: string | null;
  created_at?: string;
}

export interface AppRelease {
  id: number;
  version_name: string;
  version_code: number;
  changelog: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  external_url: string | null;
  is_published: boolean;
  is_mandatory: boolean;
  min_version_code: number;
  download_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface TokenStatus {
  label: string;
  className: string;
  dot: string;
}

export function getTokenStatus(token: AccessToken): TokenStatus {
  if (token.blocked) {
    return {
      label: "Bloqué",
      className: "bg-secondary-500/15 text-secondary-300 border-secondary-500/40",
      dot: "bg-secondary-400",
    };
  }
  if (token.expires_at && new Date(token.expires_at).getTime() < Date.now()) {
    return {
      label: "Expiré",
      className: "bg-background-300/60 text-foreground-400 border-background-400/60",
      dot: "bg-background-400",
    };
  }
  if (token.activated_at) {
    return {
      label: "Actif",
      className: "bg-primary-500/15 text-primary-300 border-primary-500/40",
      dot: "bg-primary-400",
    };
  }
  return {
    label: "Non utilisé",
    className: "bg-accent-500/15 text-accent-300 border-accent-500/40",
    dot: "bg-accent-400",
  };
}

export function generateTokenCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let middle = "";
  for (let i = 0; i < 6; i += 1) {
    middle += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DGM-${middle}-CREDIT`;
}