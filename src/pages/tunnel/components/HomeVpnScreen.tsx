import { useEffect, useState } from "react";
import type { TunnelData } from "@/pages/tunnel/lib";
import { formatDate } from "@/pages/tunnel/lib";
import { formatDuration } from "@/pages/tunnel/journal";
import type { VpnController, VpnServer } from "@/hooks/useVpnConnection";
import { latencyTone } from "@/pages/tunnel/useServerLatency";

interface HomeVpnScreenProps {
  vpn: VpnController;
  server: VpnServer | null;
  serverCount: number;
  data: TunnelData;
  updating: boolean;
  onUpdate: () => Promise<void>;
  onGoServers: () => void;
  onOpenDetails: () => void;
  lastUpdatedLabel: string;
  latencyMs: number | null;
  latencyLoading: boolean;
  bestServerName: string;
  bestServerLatency: number | null;
  onAutoSelect: () => void;
}

function Tile({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] p-3">
      <div className="flex items-center gap-1.5 text-[#9b6b86]">
        <i className={`${icon} text-sm`} />
        <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-1.5 font-heading text-base font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

export default function HomeVpnScreen({
  vpn,
  server,
  serverCount,
  data,
  updating,
  onUpdate,
  onGoServers,
  onOpenDetails,
  lastUpdatedLabel,
  latencyMs,
  latencyLoading,
  bestServerName,
  bestServerLatency,
  onAutoSelect,
}: HomeVpnScreenProps) {
  const connected = vpn.status === "connected";
  const connecting = vpn.status === "connecting";

  const [autoProtection, setAutoProtection] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("dgm_tunnel_auto_protection");
      if (stored !== null) setAutoProtection(stored === "true");
    } catch {
      // Ignoré.
    }
  }, []);

  const toggleAutoProtection = () => {
    setAutoProtection((current) => {
      const next = !current;
      try {
        window.localStorage.setItem("dgm_tunnel_auto_protection", String(next));
      } catch {
        // Ignoré.
      }
      return next;
    });
  };

  const statusLabel = connecting ? "Connexion en cours..." : connected ? "VPN connecté" : "VPN déconnecté";
  const hintLabel = connected ? "Ta connexion est sécurisée" : connecting ? "Établissement du tunnel..." : "Appuie pour sécuriser ta connexion";

  const statusTone = connected ? "text-[#e6007e]" : connecting ? "text-[#d63384]" : "text-[#9b6b86]";
  const statusDot = connected ? "bg-[#e6007e]" : connecting ? "bg-[#d63384]" : "bg-[#edb8d3]";

  const ringBorder = connected ? "border-[#e6007e]" : connecting ? "border-[#c026d3]" : "border-[#f7cfe3]";
  const ringGlow = connected
    ? "shadow-[0_0_60px_-12px_#e6007e]"
    : connecting
      ? "shadow-[0_0_60px_-12px_#c026d3]"
      : "";
  const buttonTone = connected
    ? "border-[#e6007e] bg-[#e6007e]/10 text-[#e6007e]"
    : connecting
      ? "border-[#c026d3] bg-[#c026d3]/10 text-[#d63384]"
      : "border-[#f7cfe3] bg-[#fff5fa] text-[#6b3651] hover:border-[#e6007e]/50 hover:text-[#e6007e]";

  const toggle = () => {
    if (connected || connecting) vpn.disconnect();
    else vpn.connect();
  };

  const remainingDays = data.token.remaining_days;

  const latencyValue = connected
    ? `${vpn.ping} ms`
    : latencyMs !== null
      ? `${latencyMs} ms`
      : latencyLoading
        ? "..."
        : "—";
  const latencyToneClass = connected
    ? "text-[#d63384]"
    : latencyMs !== null
      ? latencyTone(latencyMs)
      : "text-[#b98aa6]";

  return (
    <div className="space-y-4">
      {/* Bloc de connexion (hero) */}
      <section className="flex flex-col items-center rounded-3xl border border-[#f7cfe3] bg-[#fff5fa] px-4 pb-7 pt-7">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-[#f7cfe3] bg-[#ffffff] px-3.5 py-1.5">
          <span className={`h-2 w-2 rounded-full ${statusDot} ${connected || connecting ? "animate-pulse" : ""}`} />
          <span className={`font-mono text-[11px] uppercase tracking-wider ${statusTone}`}>{statusLabel}</span>
        </div>

        <div className="relative flex h-56 w-56 items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-2 ${ringBorder} ${ringGlow}`} aria-hidden="true" />
          {connected ? (
            <div
              className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#e6007e]"
              aria-hidden="true"
            />
          ) : null}
          {connecting ? (
            <div
              className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#d63384]"
              aria-hidden="true"
            />
          ) : null}
          <div
            className={`absolute inset-10 rounded-full ${
              connected ? "bg-[#e6007e]/10" : connecting ? "bg-[#c026d3]/10" : "bg-[#c026d3]/5"
            } blur-2xl`}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={toggle}
            disabled={!server}
            className={`relative flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${buttonTone}`}
          >
            <i className="ri-shut-down-line text-4xl" />
            <span className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-widest">
              {connecting ? "Patientez" : connected ? "Déconnecter" : "Connecter"}
            </span>
          </button>
        </div>

        <p className="mt-6 text-center font-heading text-sm font-semibold text-[#6b3651]">{hintLabel}</p>
        <p className="mt-3 font-heading text-3xl font-extrabold tabular-nums text-[#3a0a26]">
          {formatDuration(vpn.seconds)}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">Durée de session</p>
      </section>

      {/* Tuiles débit / latence */}
      <section className="grid grid-cols-3 gap-2.5">
        <Tile
          label="Descendant"
          value={connected ? `${vpn.download.toFixed(1)} Mb/s` : "—"}
          icon="ri-arrow-down-line"
          tone="text-[#e6007e]"
        />
        <Tile
          label="Montant"
          value={connected ? `${vpn.upload.toFixed(1)} Mb/s` : "—"}
          icon="ri-arrow-up-line"
          tone="text-[#16a34a]"
        />
        <Tile label="Latence" value={latencyValue} icon="ri-pulse-line" tone={latencyToneClass} />
      </section>

      {/* Serveur actif → détails de connexion */}
      <button
        type="button"
        onClick={onOpenDetails}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] p-4 text-left transition-colors hover:border-[#e6007e]/50 cursor-pointer"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-3xl leading-none">{server?.flag ?? "🏳️"}</span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">Serveur sélectionné</p>
            <p className="truncate font-heading text-sm font-bold text-[#3a0a26]">
              {server ? `${server.country} · ${server.name}` : "Aucun serveur"}
            </p>
            {server ? (
              <span className="mt-1 inline-flex rounded-md border border-[#e6007e]/30 bg-[#e6007e]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#e6007e]">
                {server.type}
              </span>
            ) : (
              <p className="mt-1 font-mono text-[10px] text-[#b98aa6]">
                {serverCount === 0 ? "Aucune configuration disponible" : "Choisis un serveur"}
              </p>
            )}
          </div>
        </div>
        <span className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#f7cfe3] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">
          <i className="ri-information-line text-base" />
          Détails
        </span>
      </button>

      <div className="grid grid-cols-2 gap-2.5">
        <Tile
          label="Adresse IP"
          value={connected && vpn.ip ? vpn.ip : "—"}
          icon="ri-earth-line"
          tone="text-[#3a0a26]"
        />
        <Tile label="Pays" value={String(data.countries.length)} icon="ri-global-line" tone="text-[#3a0a26]" />
      </div>

      {/* Protection automatique */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#16a34a]/30 bg-[#16a34a]/10 text-[#16a34a]">
            <i className="ri-shield-check-line" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-[#3a0a26]">Protection automatique</p>
            <p className="font-mono text-[10px] text-[#b98aa6]">Reprend le tunnel si le réseau change</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={autoProtection}
          onClick={toggleAutoProtection}
          className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors cursor-pointer ${
            autoProtection ? "border-[#e6007e]/60 bg-[#e6007e]/25" : "border-[#f7cfe3] bg-[#ffffff]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
              autoProtection ? "left-6 bg-[#e6007e]" : "left-0.5 bg-[#b98aa6]"
            }`}
          />
        </button>
      </div>

      {/* Accès + mise à jour */}
      <section className="rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6007e]/30 bg-[#e6007e]/10">
              <i className="ri-vip-crown-2-line text-xl text-[#e6007e]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">Accès actif</p>
              <p className="font-heading text-base font-bold text-[#3a0a26]">
                {remainingDays === null
                  ? "Illimité"
                  : `${remainingDays} jour${remainingDays > 1 ? "s" : ""} restant${remainingDays > 1 ? "s" : ""}`}
              </p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Expire le {formatDate(data.expires_at)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onUpdate}
            disabled={updating}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#e6007e] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#ffffff] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 cursor-pointer"
          >
            {updating ? (
              <i className="ri-loader-4-line animate-spin text-base" />
            ) : (
              <i className="ri-refresh-line text-base" />
            )}
            Update
          </button>
        </div>
        {lastUpdatedLabel ? (
          <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-[#16a34a]">
            <i className="ri-checkbox-circle-line" />
            Mis à jour à {lastUpdatedLabel}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onGoServers}
          className="mt-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#f7cfe3] px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#9b6b86] transition-colors hover:border-[#e6007e]/50 hover:text-[#e6007e] cursor-pointer"
        >
          <i className="ri-list-settings-line text-base" />
          Changer de serveur
        </button>
      </section>

      {/* Meilleur serveur automatique */}
      <button
        type="button"
        onClick={onAutoSelect}
        disabled={!bestServerName}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors ${
          bestServerName
            ? "cursor-pointer border-[#e6007e]/40 bg-gradient-to-r from-[#e6007e]/10 to-[#c026d3]/10 hover:border-[#e6007e]"
            : "cursor-not-allowed border-[#f7cfe3] bg-[#fff5fa] opacity-60"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6007e]/40 bg-[#e6007e]/15 text-[#e6007e]">
            <i className="ri-flashlight-fill text-xl" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold text-[#3a0a26]">Meilleur serveur automatique</p>
            <p className="mt-0.5 truncate font-mono text-[10px] text-[#9b6b86]">
              {bestServerName || (latencyLoading ? "Analyse en cours..." : "Aucun serveur en ligne")}
            </p>
          </div>
        </div>
        {bestServerLatency !== null ? (
          <span className={`whitespace-nowrap font-mono text-[11px] font-bold tabular-nums ${latencyTone(bestServerLatency)}`}>
            {bestServerLatency} ms
          </span>
        ) : null}
      </button>
    </div>
  );
}