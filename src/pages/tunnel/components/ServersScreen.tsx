import { useMemo, useState } from "react";
import type { TunnelConfig, TunnelCountry, TunnelData } from "@/pages/tunnel/lib";
import { typeBadgeClass } from "@/pages/tunnel/lib";
import type { VpnServer } from "@/hooks/useVpnConnection";
import type { ServerLatency } from "@/pages/tunnel/useServerLatency";
import { latencyTone, signalIcon } from "@/pages/tunnel/useServerLatency";

interface ServersScreenProps {
  data: TunnelData;
  selectedId: number | null;
  onUse: (server: VpnServer) => void;
  results: Record<number, ServerLatency>;
  measuring: boolean;
  onRefresh: () => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  bestServer: VpnServer | null;
  bestServerLatency: number | null;
  onAutoSelect: () => void;
}

interface NetworkItem extends TunnelConfig {
  countryName: string;
  flag: string;
}

type TabKey = "recommended" | "all";

const TABS: { key: TabKey; label: string }[] = [
  { key: "recommended", label: "Recommandés" },
  { key: "all", label: "Tous les pays" },
];

const RECOMMENDED_PATTERN = /free|vip|fast|direct|boost|premium|gcp|unlimited|music|tiktok|youtube/i;

function healthLabel(latency: ServerLatency | undefined): { label: string; dot: string; tone: string } {
  if (!latency || latency.health === "testing") {
    return { label: "Mesure...", dot: "bg-[#d9a300]", tone: "text-[#b98a1f]" };
  }
  if (latency.health === "offline") {
    return { label: "Hors ligne", dot: "bg-[#dc2626]", tone: "text-[#dc2626]" };
  }
  return { label: "En ligne", dot: "bg-[#16a34a]", tone: "text-[#16a34a]" };
}

export default function ServersScreen({
  data,
  selectedId,
  onUse,
  results,
  measuring,
  onRefresh,
  favorites,
  onToggleFavorite,
  bestServer,
  bestServerLatency,
  onAutoSelect,
}: ServersScreenProps) {
  const [tab, setTab] = useState<TabKey>("recommended");
  const [search, setSearch] = useState("");
  const [protocol, setProtocol] = useState<string>("ALL");

  const networks = useMemo<NetworkItem[]>(
    () =>
      data.countries.flatMap((country: TunnelCountry) =>
        country.configs.map((config) => ({
          ...config,
          countryName: country.name,
          flag: country.flag || "🏳️",
        }))
      ),
    [data.countries]
  );

  /** Liste des protocoles présents dans les données, avec leur nombre de serveurs. */
  const protocols = useMemo(() => {
    const map = new Map<string, number>();
    networks.forEach((item) => {
      const key = (item.type || "AUTRE").toUpperCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, count }));
  }, [networks]);

  const onlineCount = useMemo(
    () => networks.filter((item) => results[item.id]?.health === "online").length,
    [networks, results]
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list: NetworkItem[] = networks;
    if (tab === "recommended") {
      const picked = networks.filter((item) => RECOMMENDED_PATTERN.test(item.name));
      list = picked.length >= 8 ? picked : networks.slice(0, 16);
    }
    if (protocol !== "ALL") {
      list = list.filter((item) => (item.type || "AUTRE").toUpperCase() === protocol);
    }
    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.countryName.toLowerCase().includes(query)
      );
    }

    // Favoris épinglés en haut, puis du plus rapide au plus lent (hors ligne à la fin).
    return [...list].sort((a, b) => {
      const favA = favorites.includes(a.id) ? 0 : 1;
      const favB = favorites.includes(b.id) ? 0 : 1;
      if (favA !== favB) return favA - favB;

      const healthA = results[a.id]?.health;
      const healthB = results[b.id]?.health;
      const offA = healthA === "offline" ? 1 : 0;
      const offB = healthB === "offline" ? 1 : 0;
      if (offA !== offB) return offA - offB;

      const latA = results[a.id]?.latency ?? null;
      const latB = results[b.id]?.latency ?? null;
      if (latA === null && latB === null) return a.name.localeCompare(b.name);
      if (latA === null) return 1;
      if (latB === null) return -1;
      return latA - latB;
    });
  }, [networks, tab, search, protocol, favorites, results]);

  const handleUse = (item: NetworkItem, latency: ServerLatency | undefined) => {
    if (latency?.health === "offline") return;
    onUse({
      id: item.id,
      name: item.name,
      country: item.countryName,
      flag: item.flag,
      type: item.type,
    });
  };

  return (
    <div className="space-y-4">
      {/* Recherche */}
      <div className="relative">
        <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#b98aa6]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un réseau ou un pays..."
          aria-label="Rechercher un réseau"
          className="w-full rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3a0a26] outline-none transition-colors placeholder:font-normal placeholder:text-[#b98aa6] focus:border-[#e6007e]"
        />
      </div>

      {/* Meilleur serveur automatique */}
      <button
        type="button"
        onClick={onAutoSelect}
        disabled={!bestServer}
        className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
          bestServer
            ? "cursor-pointer border-[#e6007e]/40 bg-gradient-to-r from-[#e6007e]/10 to-[#c026d3]/10 hover:border-[#e6007e]"
            : "cursor-not-allowed border-[#f7cfe3] bg-[#fff5fa] opacity-60"
        }`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6007e]/40 bg-[#e6007e]/15 text-[#e6007e]">
          <i className="ri-flashlight-fill text-xl" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-3 font-heading text-sm font-bold text-[#3a0a26]">
            Meilleur serveur automatique
            <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#e6007e]">
              Recommandé
            </span>
          </p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-[#9b6b86]">
            {bestServer
              ? `${bestServer.flag} ${bestServer.country} · ${bestServer.name}`
              : measuring
                ? "Analyse des serveurs en cours..."
                : "Aucun serveur en ligne détecté"}
          </p>
        </div>
        {bestServer && bestServerLatency !== null ? (
          <span className={`flex items-center gap-1 whitespace-nowrap font-mono text-[11px] font-bold tabular-nums ${latencyTone(bestServerLatency)}`}>
            <i className={`${signalIcon(bestServerLatency)} text-base`} />
            {bestServerLatency} ms
          </span>
        ) : null}
      </button>

      {/* Onglets Recommandés / Tous les pays */}
      <div className="flex gap-1 rounded-full border border-[#f7cfe3] bg-[#fff5fa] p-1">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              tab === item.key ? "bg-[#e6007e] text-white" : "text-[#9b6b86] hover:text-[#e6007e]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Filtre par protocole */}
      {protocols.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setProtocol("ALL")}
            aria-pressed={protocol === "ALL"}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              protocol === "ALL"
                ? "border-[#e6007e] bg-[#e6007e] text-white"
                : "border-[#f7cfe3] bg-[#fff5fa] text-[#9b6b86] hover:border-[#e6007e]/50 hover:text-[#e6007e]"
            }`}
          >
            Tous · {networks.length}
          </button>
          {protocols.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setProtocol(item.key)}
              aria-pressed={protocol === item.key}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                protocol === item.key
                  ? "border-[#e6007e] bg-[#e6007e] text-white"
                  : "border-[#f7cfe3] bg-[#fff5fa] text-[#9b6b86] hover:border-[#e6007e]/50 hover:text-[#e6007e]"
              }`}
            >
              {item.key} · {item.count}
            </button>
          ))}
        </div>
      ) : null}

      {/* Compteur + actualisation */}
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="font-mono text-[11px] text-[#9b6b86]">
          {visible.length} serveur{visible.length > 1 ? "s" : ""} · {onlineCount} en ligne
        </p>
        <button
          type="button"
          onClick={onRefresh}
          disabled={measuring}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#f7cfe3] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86] transition-colors hover:border-[#e6007e]/50 hover:text-[#e6007e] disabled:opacity-50 cursor-pointer"
        >
          <i className={`${measuring ? "ri-loader-4-line animate-spin" : "ri-pulse-line"} text-sm`} />
          {measuring ? "Mesure..." : "Ping"}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#f7cfe3] bg-[#fff5fa] py-16 text-center">
          <i className="ri-global-line text-2xl text-[#edb8d3]" />
          <p className="mt-2 text-sm text-[#9b6b86]">
            {networks.length === 0 ? "Aucun serveur disponible pour le moment." : "Aucun réseau ne correspond."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visible.map((item) => {
            const active = item.id === selectedId;
            const latency = results[item.id];
            const health = healthLabel(latency);
            const offline = latency?.health === "offline";
            const favorite = favorites.includes(item.id);
            const isBest = bestServer?.id === item.id;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-1 rounded-2xl border transition-colors ${
                  offline
                    ? "border-[#f7cfe3] bg-[#fff5fa] opacity-60"
                    : active
                      ? "border-[#e6007e] bg-[#e6007e]/5"
                      : "border-[#f7cfe3] bg-[#fff5fa] hover:border-[#e6007e]/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleUse(item, latency)}
                  disabled={offline}
                  className={`flex min-w-0 flex-1 items-center gap-3 p-3.5 text-left ${
                    offline ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <span className="shrink-0 text-2xl leading-none">{item.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate font-heading text-sm font-bold text-[#3a0a26]">
                      <span className="truncate">{item.name}</span>
                      {isBest ? (
                        <i
                          className="ri-flashlight-fill shrink-0 text-xs text-[#e6007e]"
                          title="Meilleur serveur"
                        />
                      ) : null}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${health.dot}`} />
                      <span className={health.tone}>{health.label}</span>
                      <span className="text-[#edb8d3]">·</span>
                      <span className="truncate">{item.countryName}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={`flex items-center gap-1 font-mono text-[11px] font-bold tabular-nums ${
                        latency && latency.latency !== null ? latencyTone(latency.latency) : "text-[#b98aa6]"
                      }`}
                    >
                      <i
                        className={`text-base ${
                          offline
                            ? "ri-signal-wifi-off-line"
                            : latency && latency.health === "testing"
                              ? "ri-loader-4-line animate-spin"
                              : latency && latency.latency !== null
                                ? signalIcon(latency.latency)
                                : "ri-signal-wifi-off-line"
                        }`}
                      />
                      {offline
                        ? "—"
                        : latency && latency.health === "testing"
                          ? "..."
                          : latency && latency.latency !== null
                            ? `${latency.latency} ms`
                            : "—"}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${typeBadgeClass(item.type)}`}
                    >
                      {item.type}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  aria-pressed={favorite}
                  className={`mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                    favorite
                      ? "border-[#e6007e]/40 bg-[#e6007e]/10 text-[#e6007e]"
                      : "border-[#f7cfe3] text-[#b98aa6] hover:border-[#e6007e]/50 hover:text-[#e6007e]"
                  }`}
                >
                  <i className={`${favorite ? "ri-star-fill" : "ri-star-line"} text-base`} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}