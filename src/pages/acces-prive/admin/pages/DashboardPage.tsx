import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AccessToken, Country, VpnConfig } from "@/pages/acces-prive/types";
import { CONFIG_TYPES } from "@/pages/acces-prive/types";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import StatCard from "@/pages/acces-prive/admin/components/StatCard";
import StatGauge from "@/pages/acces-prive/admin/components/StatGauge";
import ConfigBarChart from "@/pages/acces-prive/admin/components/ConfigBarChart";
import ConnectionsHistoryChart from "@/pages/acces-prive/admin/components/ConnectionsHistoryChart";
import PresentationMode from "@/pages/acces-prive/admin/components/PresentationMode";
import {
  daysUntil,
  formatDateTime,
  isExpiringSoon,
  isTokenActive,
  isTokenExpiredOrBlocked,
  isTokenUnused,
} from "@/pages/acces-prive/admin/utils";

interface DeviceRecord {
  id: number;
  token_code: string;
  device_id: string;
  first_seen: string | null;
  last_seen: string | null;
}

interface ActivityEntry {
  id: number;
  created_at: string;
  type: string;
  message: string | null;
  token_code: string | null;
  ip: string | null;
}

const LOG_BADGE: Record<string, string> = {
  login: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]",
  invalid: "border-[#ff5470]/40 bg-[#ff5470]/10 text-[#ff5470]",
  admin: "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#a78bfa]",
};

function ratio(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [configs, setConfigs] = useState<VpnConfig[]>([]);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [presentation, setPresentation] = useState(false);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [tokensRes, countriesRes, configsRes, devicesRes, logsRes] = await Promise.all([
        supabase.from("tokens").select("*"),
        supabase.from("countries").select("*"),
        supabase.from("configs").select("*"),
        supabase.from("devices").select("*"),
        supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(300),
      ]);
      if (tokensRes.error) throw tokensRes.error;
      if (countriesRes.error) throw countriesRes.error;
      if (configsRes.error) throw configsRes.error;
      if (devicesRes.error) throw devicesRes.error;
      if (logsRes.error) throw logsRes.error;

      setTokens((tokensRes.data as AccessToken[]) ?? []);
      setCountries((countriesRes.data as Country[]) ?? []);
      setConfigs((configsRes.data as VpnConfig[]) ?? []);
      setDevices((devicesRes.data as DeviceRecord[]) ?? []);
      setLogs((logsRes.data as ActivityEntry[]) ?? []);
    } catch {
      if (!silent) setError("Impossible de charger les données. Vérifie ta connexion puis réessaie.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Rafraîchissement silencieux pour l'activité "en direct".
  useEffect(() => {
    const timer = window.setInterval(() => loadData(true), 20000);
    return () => window.clearInterval(timer);
  }, [loadData]);

  const stats = useMemo(() => {
    const activeTokens = tokens.filter(isTokenActive);
    const unusedTokens = tokens.filter(isTokenUnused);
    const expiringSoon = activeTokens.filter((t) => isExpiringSoon(t, 3));
    const expiredOrBlocked = tokens.filter(isTokenExpiredOrBlocked);
    return {
      totalTokens: tokens.length,
      activeTokens: activeTokens.length,
      unusedTokens: unusedTokens.length,
      expiringSoon,
      expiredOrBlocked: expiredOrBlocked.length,
      activeCountries: countries.filter((c) => c.active).length,
      totalCountries: countries.length,
      activeConfigs: configs.filter((c) => c.active).length,
      totalConfigs: configs.length,
      devices: devices.length,
    };
  }, [tokens, countries, configs, devices]);

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
      })),
    [configs]
  );

  const renewList = useMemo(
    () =>
      [...stats.expiringSoon].sort((a, b) => {
        const da = daysUntil(a.expires_at) ?? 0;
        const db = daysUntil(b.expires_at) ?? 0;
        return da - db;
      }),
    [stats.expiringSoon]
  );

  const recentLogs = useMemo(() => logs.slice(0, 8), [logs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#ff5470]/30 bg-[#ff5470]/5 px-6 py-16 text-center">
        <i className="ri-error-warning-line text-3xl text-[#ff5470]" />
        <p className="mt-3 text-sm text-[#e8e8f0]">{error}</p>
        <button
          type="button"
          onClick={() => loadData()}
          className="mt-5 whitespace-nowrap rounded-lg border border-[#ff5470]/50 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/15 cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">
            Vue d'ensemble
          </h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#8b8b9e]">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#34d399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
              Live
            </span>
            État en temps réel du réseau et des accès.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPresentation(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#a78bfa] transition-colors hover:bg-[#8b5cf6]/20 cursor-pointer"
          >
            <i className="ri-tv-2-line text-base" />
            Mode TV
          </button>
          <button
            type="button"
            onClick={() => loadData()}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#232334] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
          >
            <i className="ri-refresh-line text-base" />
            Rafraîchir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jetons actifs" value={stats.activeTokens} icon="ri-coupon-3-line" tone="cyan" hint="En cours de validité" />
        <StatCard label="Non utilisés" value={stats.unusedTokens} icon="ri-time-line" tone="violet" hint="Jamais activés" />
        <StatCard label="Expirent sous 3 j" value={stats.expiringSoon.length} icon="ri-alarm-warning-line" tone="amber" hint="À renouveler bientôt" />
        <StatCard label="Expirés ou bloqués" value={stats.expiredOrBlocked} icon="ri-forbid-2-line" tone="rose" hint="Accès coupés" />
        <StatCard label="Pays" value={stats.totalCountries} icon="ri-global-line" tone="emerald" hint={`${stats.activeCountries} actifs`} />
        <StatCard label="Configurations" value={configs.length} icon="ri-file-shield-2-line" tone="cyan" hint={`${stats.activeConfigs} actives`} />
        <StatCard label="Appareils connectés" value={stats.devices} icon="ri-smartphone-line" tone="violet" hint="Appareils enregistrés" />
        <StatCard label="Lignes de journal" value={logs.length} icon="ri-file-list-3-line" tone="neutral" hint="Historique 14 jours" />
      </div>

      <Panel title="Évolution des connexions" icon="ri-line-chart-line">
        <ConnectionsHistoryChart logs={logs} days={14} />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Santé du réseau" icon="ri-pulse-line" className="lg:col-span-1">
          <div className="flex flex-wrap items-center justify-around gap-6 py-2">
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
        </Panel>

        <Panel title="Configurations actives par type" icon="ri-bar-chart-2-line" className="lg:col-span-2">
          <ConfigBarChart data={chartData} />
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="À renouveler bientôt" icon="ri-alarm-warning-line" className="lg:col-span-1">
          {renewList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <i className="ri-checkbox-circle-line text-2xl text-[#34d399]" />
              <p className="mt-2 text-sm text-[#8b8b9e]">Aucun jeton n'expire dans les 3 prochains jours.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {renewList.map((token) => {
                const days = daysUntil(token.expires_at);
                return (
                  <li
                    key={token.id}
                    className="adm-lift rounded-xl border border-[#f5b544]/30 bg-[#f5b544]/5 p-3 hover:border-[#f5b544]/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs font-semibold text-[#e8e8f0]">{token.code}</span>
                      <span className="shrink-0 rounded-md border border-[#f5b544]/40 bg-[#f5b544]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#f5b544]">
                        {days} j
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#8b8b9e]">
                      Expire le {formatDateTime(token.expires_at)}
                      {token.note ? ` · ${token.note}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Dernières activités"
          icon="ri-history-line"
          className="lg:col-span-2"
          action={
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#34d399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
              Temps réel
            </span>
          }
        >
          {recentLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <i className="ri-file-list-3-line text-2xl text-[#3a3a52]" />
              <p className="mt-2 text-sm text-[#8b8b9e]">Aucune activité enregistrée pour le moment.</p>
            </div>
          ) : (
            <div className="adm-scroll overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#232334]">
                    <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Type</th>
                    <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Message</th>
                    <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Jeton</th>
                    <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="adm-row border-b border-[#1b1b28] last:border-0">
                      <td className="px-2 py-2.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            LOG_BADGE[log.type] ?? "border-[#232334] bg-white/5 text-[#8b8b9e]"
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-sm text-[#c7c7d6]">{log.message ?? "—"}</td>
                      <td className="px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">{log.token_code ?? "—"}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {presentation ? <PresentationMode onClose={() => setPresentation(false)} /> : null}
    </div>
  );
}