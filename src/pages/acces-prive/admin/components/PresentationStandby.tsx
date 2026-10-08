import { useMemo } from "react";

export interface StandbyStats {
  activeTokens: number;
  totalTokens: number;
  expiring: number;
  expiredOrBlocked: number;
  activeCountries: number;
  totalCountries: number;
  activeConfigs: number;
  devices: number;
}

export interface StandbyActivity {
  id: number;
  created_at: string;
  type: string | null;
  message: string | null;
  token_code: string | null;
}

interface TickerItem {
  key: string;
  icon: string;
  color: string;
  label: string;
  value: string;
}

interface PresentationStandbyProps {
  now: Date;
  stats: StandbyStats;
  recent: StandbyActivity[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onWake: () => void;
  onClose: () => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

/**
 * Écran de veille du mode présentation : grande horloge plein écran + bandeau
 * des dernières statistiques et activités qui défile tant que rien ne bouge.
 */
export default function PresentationStandby({
  now,
  stats,
  recent,
  isFullscreen,
  onToggleFullscreen,
  onWake,
  onClose,
}: PresentationStandbyProps) {
  const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(now);
  const seconds = new Intl.DateTimeFormat("fr-FR", { second: "2-digit" }).format(now);
  const dateLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now);

  const tickerItems = useMemo<TickerItem[]>(() => {
    const statItems: TickerItem[] = [
      { key: "s1", icon: "ri-coupon-3-line", color: "#00f0ff", label: "Jetons actifs", value: `${stats.activeTokens}/${stats.totalTokens}` },
      { key: "s2", icon: "ri-smartphone-line", color: "#a78bfa", label: "Appareils", value: `${stats.devices}` },
      { key: "s3", icon: "ri-global-line", color: "#34d399", label: "Pays en service", value: `${stats.activeCountries}/${stats.totalCountries}` },
      { key: "s4", icon: "ri-file-shield-2-line", color: "#00f0ff", label: "Configs actives", value: `${stats.activeConfigs}` },
      { key: "s5", icon: "ri-alarm-warning-line", color: "#f5b544", label: "À renouveler", value: `${stats.expiring}` },
      { key: "s6", icon: "ri-forbid-2-line", color: "#ff5470", label: "Expirés / bloqués", value: `${stats.expiredOrBlocked}` },
    ];
    const actItems: TickerItem[] = recent.slice(0, 10).map((log) => ({
      key: `a${log.id}`,
      icon: "ri-history-line",
      color: log.type === "invalid" ? "#ff5470" : log.type === "admin" ? "#a78bfa" : "#00f0ff",
      label: timeAgo(log.created_at),
      value: log.message ?? "—",
    }));
    return [...statItems, ...actItems];
  }, [stats, recent]);

  const loopItems = [...tickerItems, ...tickerItems];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 adm-grid-bg opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00f0ff]/8 blur-[180px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#8b5cf6]/10 blur-[160px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[#34d399]/8 blur-[160px]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 adm-scan bg-gradient-to-b from-[#00f0ff]/10 to-transparent" aria-hidden="true" />

      <div className="relative flex h-full w-full flex-col">
        {/* En-tête discret */}
        <header className="flex items-center justify-between gap-4 p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10">
              <i className="ri-moon-clear-line text-xl text-[#00f0ff]" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-[#e8e8f0]">
                DGM <span className="adm-gradient-text">TUNNEL</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">
                Écran de contrôle · Veille
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleFullscreen}
              title="Plein écran"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#232334] text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
            >
              <i className={isFullscreen ? "ri-fullscreen-exit-line text-lg" : "ri-fullscreen-line text-lg"} />
            </button>
            <button
              type="button"
              onClick={onWake}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#00f0ff] transition-colors hover:bg-[#00f0ff]/20 cursor-pointer"
            >
              <i className="ri-eye-line text-base" />
              Réveiller
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#ff5470]/40 bg-[#ff5470]/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/20 cursor-pointer"
            >
              <i className="ri-close-line text-base" />
              Quitter
            </button>
          </div>
        </header>

        {/* Horloge plein écran */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="mb-6 flex items-center gap-2.5 rounded-full border border-[#232334] bg-[#0d0d14]/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#8b8b9e]">
            <span className="h-2 w-2 rounded-full bg-[#f5b544] animate-pulse" />
            Aucune activité · En attente
          </span>

          <div className="flex items-end justify-center gap-3 lg:gap-5">
            <span className="adm-standby-clock font-heading text-[6rem] font-bold leading-none tabular-nums text-[#e8e8f0] sm:text-[9rem] lg:text-[13rem]">
              {time}
            </span>
            <span className="adm-breathe mb-3 font-heading text-3xl font-bold tabular-nums text-[#00f0ff] lg:mb-6 lg:text-5xl">
              {seconds}
            </span>
          </div>

          <p className="mt-5 font-mono text-sm uppercase tracking-[0.35em] text-[#8b8b9e] lg:text-base">
            {dateLabel}
          </p>
        </div>

        {/* Statistiques qui défilent */}
        <footer className="space-y-4 p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10">
              <i className="ri-bar-chart-2-line text-lg text-[#00f0ff]" />
            </span>
            <h2 className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-[#8b8b9e]">
              Dernières statistiques
            </h2>
            <span className="h-px flex-1 bg-[#232334]" />
          </div>

          <div className="adm-mask-fade relative overflow-hidden">
            <div className="adm-ticker-track flex w-max items-center gap-8">
              {loopItems.map((item, index) => (
                <span
                  key={`${item.key}-${index}`}
                  className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-[#232334] bg-[#0d0d14]/70 px-4 py-2"
                >
                  <i className={`${item.icon} text-base`} style={{ color: item.color }} />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">
                    {item.label}
                  </span>
                  <span className="font-heading text-sm font-bold text-[#e8e8f0]">{item.value}</span>
                </span>
              ))}
            </div>
          </div>

          <p className="flex items-center justify-center gap-2 text-center font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">
            <i className="ri-mouse-line text-[#00f0ff]" />
            Bougez la souris, cliquez ou appuyez sur une touche pour revenir au direct
          </p>
        </footer>
      </div>
    </div>
  );
}