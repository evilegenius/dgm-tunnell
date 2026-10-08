import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AccessToken, Country, VpnConfig } from "@/pages/acces-prive/types";
import { CONFIG_TYPES } from "@/pages/acces-prive/types";
import {
  isExpiringSoon,
  isTokenActive,
  isTokenExpiredOrBlocked,
  isTokenUnused,
} from "@/pages/acces-prive/admin/utils";
import StatGauge from "@/pages/acces-prive/admin/components/StatGauge";
import ConnectionsHistoryChart from "@/pages/acces-prive/admin/components/ConnectionsHistoryChart";
import AnimatedCounter from "@/pages/acces-prive/admin/components/AnimatedCounter";
import PresentationStandby from "@/pages/acces-prive/admin/components/PresentationStandby";

interface DeviceRecord {
  id: number;
}

interface ActivityEntry {
  id: number;
  created_at: string;
  type: string | null;
  message: string | null;
  token_code: string | null;
}

interface PresentationModeProps {
  onClose: () => void;
}

/** Délai d'inactivité (ms) avant de basculer automatiquement en veille. */
const IDLE_MS = 60000;

const LOG_BADGE: Record<string, string> = {
  login: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]",
  invalid: "border-[#ff5470]/40 bg-[#ff5470]/10 text-[#ff5470]",
  admin: "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#a78bfa]",
};

function ratio(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
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

/** Écran de contrôle mural temps réel, pensé pour un affichage TV plein écran. */
export default function PresentationMode({ onClose }: PresentationModeProps) {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [configs, setConfigs] = useState<VpnConfig[]>([]);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [now, setNow] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [manualStandby, setManualStandby] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());

  const load = useCallback(async () => {
    try {
      const [tokensRes, countriesRes, configsRes, devicesRes, logsRes] = await Promise.all([
        supabase.from("tokens").select("*"),
        supabase.from("countries").select("*"),
        supabase.from("configs").select("*"),
        supabase.from("devices").select("id"),
        supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(300),
      ]);
      if (tokensRes.data) setTokens(tokensRes.data as AccessToken[]);
      if (countriesRes.data) setCountries(countriesRes.data as Country[]);
      if (configsRes.data) setConfigs(configsRes.data as VpnConfig[]);
      if (devicesRes.data) setDevices(devicesRes.data as DeviceRecord[]);
      if (logsRes.data) setLogs(logsRes.data as ActivityEntry[]);
    } catch {
      // On garde les dernières données connues à l'écran.
    }
  }, []);

  useEffect(() => {
    load();
    const dataTimer = window.setInterval(load, 12000);
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearInterval(dataTimer);
      window.clearInterval(clockTimer);
    };
  }, [load]);

  useEffect(() => {
    const el = containerRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => undefined);
    }
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    onChange();
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Sortie de veille au moindre signe d'activité humaine.
  useEffect(() => {
    const mark = () => {
      lastInteractionRef.current = Date.now();
      setManualStandby(false);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"];
    events.forEach((name) => window.addEventListener(name, mark, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, mark));
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else el.requestFullscreen().catch(() => undefined);
  };

  const stats = useMemo(() => {
    const activeTokens = tokens.filter(isTokenActive);
    return {
      activeTokens: activeTokens.length,
      totalTokens: tokens.length,
      unusedTokens: tokens.filter(isTokenUnused).length,
      expiring: activeTokens.filter((t) => isExpiringSoon(t, 3)).length,
      expiredOrBlocked: tokens.filter(isTokenExpiredOrBlocked).length,
      activeCountries: countries.filter((c) => c.active).length,
      totalCountries: countries.length,
      activeConfigs: configs.filter((c) => c.active).length,
      totalConfigs: configs.length,
      devices: devices.length,
    };
  }, [tokens, countries, configs, devices]);

  // Veille automatique : aucune activité journalisée depuis un moment,
  // et aucune interaction récente avec l'écran.
  const standby = useMemo(() => {
    if (manualStandby) return true;
    const top = logs[0]?.created_at;
    if (!top) return false;
    const nowMs = now.getTime();
    const idleFor = nowMs - new Date(top).getTime();
    const interactedFor = nowMs - lastInteractionRef.current;
    return idleFor > IDLE_MS && interactedFor > IDLE_MS;
  }, [manualStandby, logs, now]);

  const gauges = useMemo(
    () => [
      {
        label: "Jetons actifs",
        value: `${stats.activeTokens}/${stats.totalTokens || 0}`,
        percent: ratio(stats.activeTokens, stats.totalTokens),
        icon: "ri-shield-check-line",
        color: "#00f0ff",
      },
      {
        label: "Pays en service",
        value: `${stats.activeCountries}/${stats.totalCountries || 0}`,
        percent: ratio(stats.activeCountries, stats.totalCountries),
        icon: "ri-global-line",
        color: "#34d399",
      },
      {
        label: "Configs actives",
        value: `${stats.activeConfigs}/${stats.totalConfigs || 0}`,
        percent: ratio(stats.activeConfigs, stats.totalConfigs),
        icon: "ri-file-shield-2-line",
        color: "#a78bfa",
      },
    ],
    [stats]
  );

  const chartData = useMemo(
    () =>
      CONFIG_TYPES.map((type) => ({
        type,
        value: configs.filter((c) => c.active && c.type === type).length,
      })).filter((d) => d.value > 0),
    [configs]
  );

  const tiles = [
    { label: "Jetons actifs", value: stats.activeTokens, icon: "ri-coupon-3-line", color: "#00f0ff" },
    { label: "Appareils", value: stats.devices, icon: "ri-smartphone-line", color: "#a78bfa" },
    { label: "Pays en service", value: stats.activeCountries, icon: "ri-global-line", color: "#34d399" },
    { label: "À renouveler", value: stats.expiring, icon: "ri-alarm-warning-line", color: "#f5b544" },
  ];

  const recent = logs.slice(0, 9);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] overflow-hidden bg-[#07070c] text-[#e8e8f0]"
    >
      {standby ? (
        <PresentationStandby
          now={now}
          stats={stats}
          recent={logs.slice(0, 12)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onWake={() => setManualStandby(false)}
          onClose={onClose}
        />
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 adm-grid-bg opacity-50" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#00f0ff]/10 blur-[160px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#8b5cf6]/10 blur-[160px]" aria-hidden="true" />

          <div className="relative flex h-full w-full flex-col gap-4 p-6 lg:p-8">
            {/* En-tête */}
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 adm-glow-primary">
                  <i className="ri-radar-line text-2xl text-[#00f0ff]" />
                </span>
                <div>
                  <h1 className="font-heading text-2xl font-bold uppercase tracking-widest text-[#e8e8f0] lg:text-3xl">
                    Centre de <span className="adm-gradient-text">contrôle</span>
                  </h1>
                  <p className="mt-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8b8b9e]">
                    <span className="inline-flex items-center gap-1.5 text-[#34d399]">
                      <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
                      Diffusion en direct
                    </span>
                    · DGM TUNNEL
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-heading text-3xl font-bold tabular-nums text-[#e8e8f0] lg:text-4xl">
                    {new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now)}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">
                    {new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "2-digit", month: "long" }).format(now)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setManualStandby(true)}
                  title="Passer en veille"
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#232334] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#c3c3d4] transition-colors hover:border-[#f5b544]/50 hover:text-[#f5b544] cursor-pointer"
                >
                  <i className="ri-moon-clear-line text-base" />
                  Veille
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title="Plein écran"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#232334] text-[#c3c3d4] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
                >
                  <i className={isFullscreen ? "ri-fullscreen-exit-line text-xl" : "ri-fullscreen-line text-xl"} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-[#ff5470]/40 bg-[#ff5470]/10 px-4 py-3 font-mono text-xs uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/20 cursor-pointer"
                >
                  <i className="ri-close-line text-base" />
                  Quitter
                </button>
              </div>
            </header>

            {/* Tuiles de stats agrandies */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {tiles.map((tile) => (
                <div key={tile.label} className="adm-glass relative overflow-hidden rounded-2xl border border-[#232334] px-5 py-4">
                  <div className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: tile.color, opacity: 0.7 }} />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">{tile.label}</p>
                      <p className="mt-1 font-heading text-4xl font-bold text-[#e8e8f0] lg:text-5xl">
                        <AnimatedCounter value={tile.value} />
                      </p>
                    </div>
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl border"
                      style={{ borderColor: `${tile.color}55`, backgroundColor: `${tile.color}1a` }}
                    >
                      <i className={`${tile.icon} text-2xl`} style={{ color: tile.color }} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Corps : histo + santé + flux live */}
            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12">
              <section className="adm-glass flex min-h-0 flex-col rounded-2xl border border-[#232334] p-5 lg:col-span-8">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                    <i className="ri-line-chart-line text-lg text-[#00f0ff]" />
                  </span>
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e8e8f0]">
                    Évolution des connexions
                  </h2>
                </div>
                <div className="min-h-0 flex-1 overflow-hidden">
                  <ConnectionsHistoryChart logs={logs} days={14} plotHeight={168} big />
                </div>
              </section>

              <section className="adm-glass flex min-h-0 flex-col gap-4 rounded-2xl border border-[#232334] p-5 lg:col-span-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#34d399]/30 bg-[#34d399]/10">
                    <i className="ri-pulse-line text-lg text-[#34d399]" />
                  </span>
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e8e8f0]">Santé du réseau</h2>
                </div>
                <div className="flex flex-1 items-center justify-around gap-4">
                  {gauges.map((gauge) => (
                    <StatGauge
                      key={gauge.label}
                      label={gauge.label}
                      value={gauge.value}
                      percent={gauge.percent}
                      icon={gauge.icon}
                      color={gauge.color}
                    />
                  ))}
                </div>
                {chartData.length > 0 ? (
                  <div className="flex flex-wrap gap-2 border-t border-[#232334] pt-3">
                    {chartData.map((d) => (
                      <span
                        key={d.type}
                        className="rounded-md border border-[#232334] bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#c3c3d4]"
                      >
                        {d.type} · {d.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>

            {/* Flux d'activité en direct */}
            <section className="adm-glass min-h-0 rounded-2xl border border-[#232334] p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                    <i className="ri-history-line text-lg text-[#00f0ff]" />
                  </span>
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e8e8f0]">
                    Activité en direct
                  </h2>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#34d399]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  Temps réel
                </span>
              </div>
              {recent.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#5a5a6e]">Aucune activité enregistrée pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {recent.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 rounded-xl border border-[#1b1b28] bg-[#0d0d14]/60 px-3 py-2.5">
                      <span className={`inline-flex shrink-0 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${LOG_BADGE[log.type ?? ""] ?? "border-[#232334] bg-white/5 text-[#8b8b9e]"}`}>
                        {log.type ?? "info"}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-sm text-[#c7c7d6]">{log.message ?? "—"}</p>
                      <span className="shrink-0 font-mono text-[10px] text-[#5a5a6e]">{timeAgo(log.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}