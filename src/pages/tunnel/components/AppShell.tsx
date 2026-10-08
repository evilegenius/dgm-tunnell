import { useMemo, useState } from "react";
import type { TunnelConfig, TunnelData } from "@/pages/tunnel/lib";
import { formatClock } from "@/pages/tunnel/lib";
import { useVpnConnection } from "@/hooks/useVpnConnection";
import type { VpnServer } from "@/hooks/useVpnConnection";
import { useServerLatency } from "@/pages/tunnel/useServerLatency";
import { useFavoriteServers } from "@/pages/tunnel/useFavoriteServers";
import HomeVpnScreen from "@/pages/tunnel/components/HomeVpnScreen";
import ServersScreen from "@/pages/tunnel/components/ServersScreen";
import JournalScreen from "@/pages/tunnel/components/JournalScreen";
import SettingsScreen from "@/pages/tunnel/components/SettingsScreen";
import InstallGuideScreen from "@/pages/tunnel/components/InstallGuideScreen";
import IpFinderScreen from "@/pages/tunnel/components/IpFinderScreen";
import SubscriptionScreen from "@/pages/tunnel/components/SubscriptionScreen";
import ConnectionDetailScreen from "@/pages/tunnel/components/ConnectionDetailScreen";

export type AppNavKey =
  | "accueil"
  | "serveurs"
  | "journal"
  | "parametres"
  | "guide"
  | "ipfinder"
  | "abonnement"
  | "details";

interface AppShellProps {
  data: TunnelData;
  updating: boolean;
  onUpdate: () => Promise<void>;
  onQuit: () => void;
}

const TABS: { key: AppNavKey; label: string; icon: string }[] = [
  { key: "accueil", label: "Accueil", icon: "ri-home-5-line" },
  { key: "serveurs", label: "Serveurs", icon: "ri-server-line" },
  { key: "journal", label: "Stats", icon: "ri-bar-chart-2-line" },
  { key: "parametres", label: "Paramètres", icon: "ri-settings-3-line" },
];

const MENU: { key: AppNavKey; label: string; desc: string; icon: string }[] = [
  { key: "accueil", label: "Accueil", desc: "Connexion et état", icon: "ri-home-5-line" },
  { key: "serveurs", label: "Serveurs", desc: "Pays et configurations", icon: "ri-server-line" },
  { key: "journal", label: "Journal", desc: "Historique des connexions", icon: "ri-history-line" },
  { key: "abonnement", label: "Abonnement", desc: "Jours restants et renouvellement", icon: "ri-vip-crown-2-line" },
  { key: "ipfinder", label: "IP Finder", desc: "Voir ton adresse IP", icon: "ri-map-pin-user-line" },
  { key: "guide", label: "Guide d'installation", desc: "Installer et connecter", icon: "ri-book-open-line" },
  { key: "parametres", label: "Paramètres", desc: "Application et accès", icon: "ri-settings-3-line" },
];

export default function AppShell({ data, updating, onUpdate, onQuit }: AppShellProps) {
  const servers = useMemo<VpnServer[]>(
    () =>
      data.countries.flatMap((country) =>
        country.configs.map((config) => ({
          id: config.id,
          name: config.name,
          country: country.name,
          flag: country.flag || "🏳️",
          type: config.type,
        }))
      ),
    [data.countries]
  );

  const [selectedId, setSelectedId] = useState<number | null>(servers[0]?.id ?? null);
  const [active, setActive] = useState<AppNavKey>("accueil");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const latency = useServerLatency(
    useMemo(() => servers.map((server) => ({ id: server.id, type: server.type })), [servers])
  );
  const { favorites, toggleFavorite } = useFavoriteServers();

  const selectedServer = servers.find((item) => item.id === selectedId) ?? servers[0] ?? null;

  /** Serveur en ligne le plus rapide (latence mesurée la plus basse). */
  const bestServer = useMemo<VpnServer | null>(() => {
    const online = servers
      .map((server) => ({
        server,
        latency: latency.results[server.id]?.latency ?? null,
        health: latency.results[server.id]?.health,
      }))
      .filter((entry) => entry.health === "online" && entry.latency !== null);
    if (online.length === 0) return null;
    online.sort((a, b) => (a.latency as number) - (b.latency as number));
    return online[0].server;
  }, [servers, latency.results]);

  const selectedLatency = selectedServer ? latency.results[selectedServer.id]?.latency ?? null : null;
  const bestServerLatency = bestServer ? latency.results[bestServer.id]?.latency ?? null : null;

  const selectedConfig = useMemo<TunnelConfig | null>(() => {
    for (const country of data.countries) {
      const found = country.configs.find((config) => config.id === selectedId);
      if (found) return found;
    }
    return null;
  }, [data.countries, selectedId]);

  const vpn = useVpnConnection({ server: selectedServer });

  const go = (key: AppNavKey) => {
    setActive(key);
    setDrawerOpen(false);
  };

  const handleUse = (server: VpnServer) => {
    setSelectedId(server.id);
    setActive("accueil");
  };

  const handleAutoSelect = () => {
    if (!bestServer) return;
    setSelectedId(bestServer.id);
    setActive("accueil");
  };

  const handleUpdate = async () => {
    await onUpdate();
    setLastUpdated(new Date());
  };

  const statusDot =
    vpn.status === "connected" ? "bg-[#e6007e]" : vpn.status === "connecting" ? "bg-[#d63384]" : "bg-[#edb8d3]";

  const renderScreen = () => {
    switch (active) {
      case "serveurs":
        return (
          <ServersScreen
            data={data}
            selectedId={selectedServer?.id ?? null}
            onUse={handleUse}
            results={latency.results}
            measuring={latency.measuring}
            onRefresh={latency.refresh}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            bestServer={bestServer}
            bestServerLatency={bestServerLatency}
            onAutoSelect={handleAutoSelect}
          />
        );
      case "journal":
        return <JournalScreen vpnStatus={vpn.status} />;
      case "parametres":
        return (
          <SettingsScreen
            onQuit={onQuit}
            onOpenGuide={() => go("guide")}
            onOpenIpFinder={() => go("ipfinder")}
            onOpenSubscription={() => go("abonnement")}
          />
        );
      case "guide":
        return <InstallGuideScreen onBack={() => go("parametres")} />;
      case "ipfinder":
        return <IpFinderScreen onBack={() => go("parametres")} />;
      case "abonnement":
        return <SubscriptionScreen data={data} onBack={() => go("accueil")} />;
      case "details":
        return (
          <ConnectionDetailScreen
            server={selectedServer}
            config={selectedConfig}
            connected={vpn.status === "connected"}
            onBack={() => go("accueil")}
          />
        );
      default:
        return (
          <HomeVpnScreen
            vpn={vpn}
            server={selectedServer}
            serverCount={servers.length}
            data={data}
            updating={updating}
            onUpdate={handleUpdate}
            onGoServers={() => setActive("serveurs")}
            onOpenDetails={() => setActive("details")}
            lastUpdatedLabel={lastUpdated ? formatClock(lastUpdated) : ""}
            latencyMs={selectedLatency}
            latencyLoading={latency.measuring}
            bestServerName={bestServer ? `${bestServer.country} · ${bestServer.name}` : ""}
            bestServerLatency={bestServerLatency}
            onAutoSelect={handleAutoSelect}
          />
        );
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-[#f7cfe3] bg-[#ffffff]/85 backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5">
          <button type="button" onClick={() => go("accueil")} className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6007e]/40 bg-[#e6007e]/10">
              <i className="ri-shield-keyhole-line text-xl text-[#e6007e]" />
            </div>
            <div className="text-left">
              <h1 className="font-heading text-sm font-extrabold uppercase tracking-wider text-[#3a0a26]">
                DGM <span className="text-[#e6007e]">TUNNEL</span>
              </h1>
              <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#b98aa6]">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                {vpn.status === "connected" ? "Connecté" : vpn.status === "connecting" ? "Connexion" : "Hors ligne"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f7cfe3] text-[#6b3651] transition-colors hover:border-[#e6007e]/50 hover:text-[#e6007e] cursor-pointer"
          >
            <i className="ri-menu-3-line text-xl" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5">{renderScreen()}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto w-full max-w-[440px] border-t border-[#f7cfe3]/80 bg-[#ffffff]/92 backdrop-blur-md">
          <div className="grid grid-cols-4 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => go(tab.key)}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 transition-colors cursor-pointer ${
                    isActive ? "text-[#e6007e]" : "text-[#b98aa6] hover:text-[#6b3651]"
                  }`}
                >
                  <i className={`${tab.icon} text-xl`} />
                  <span className="font-mono text-[10px] uppercase tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {drawerOpen ? (
        <div
          className="fixed inset-0 z-[70] flex bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de l'application"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="ml-auto flex h-full w-[82%] max-w-sm flex-col border-l border-[#f7cfe3] bg-[#ffffff]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#f7cfe3] px-4 py-4">
              <div>
                <p className="font-heading text-sm font-extrabold uppercase tracking-wider text-[#3a0a26]">
                  DGM <span className="text-[#e6007e]">TUNNEL</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#d63384]">Celui qui demeure</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f7cfe3] text-[#8b8b9e] transition-colors hover:text-[#3a0a26] cursor-pointer"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {MENU.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => go(item.key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors cursor-pointer ${
                    active === item.key ? "bg-[#e6007e]/10" : "hover:bg-black/5"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      active === item.key
                        ? "border-[#e6007e]/40 bg-[#e6007e]/10 text-[#e6007e]"
                        : "border-[#f7cfe3] bg-black/5 text-[#6b3651]"
                    }`}
                  >
                    <i className={`${item.icon} text-lg`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-sm font-semibold text-[#3a0a26]">{item.label}</span>
                    <span className="block font-mono text-[10px] text-[#b98aa6]">{item.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-[#f7cfe3] p-3">
              <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-[#edb8d3]">
                Jeton : {data.token.code}
              </p>
              <button
                type="button"
                onClick={onQuit}
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#dc2626]/40 bg-[#dc2626]/10 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#dc2626] transition-colors hover:bg-[#dc2626]/20 cursor-pointer"
              >
                <i className="ri-logout-box-r-line text-base" />
                Quitter
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}