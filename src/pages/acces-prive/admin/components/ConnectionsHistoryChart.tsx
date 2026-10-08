import { useEffect, useMemo, useState } from "react";

interface LogLike {
  created_at: string;
  type: string | null;
}

interface ConnectionsHistoryChartProps {
  logs: LogLike[];
  days?: number;
  /** Hauteur (px) de la zone des barres. */
  plotHeight?: number;
  big?: boolean;
}

interface DayBucket {
  key: string;
  label: string;
  fullLabel: string;
  total: number;
  login: number;
  invalid: number;
  admin: number;
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const LEGEND = [
  { key: "login", label: "Connexions", color: "#00f0ff" },
  { key: "invalid", label: "Échecs", color: "#ff5470" },
  { key: "admin", label: "Admin", color: "#a78bfa" },
];

/** Histogramme empilé de l'activité par jour, alimenté par le journal. */
export default function ConnectionsHistoryChart({
  logs,
  days = 14,
  plotHeight = 180,
  big = false,
}: ConnectionsHistoryChartProps) {
  const [mounted, setMounted] = useState(false);

  const buckets = useMemo(() => {
    const map = new Map<string, DayBucket>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(today.getTime() - i * 86400000);
      const key = dayKey(d);
      map.set(key, {
        key,
        label: new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(d),
        fullLabel: new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "2-digit", month: "short" }).format(d),
        total: 0,
        login: 0,
        invalid: 0,
        admin: 0,
      });
    }
    logs.forEach((log) => {
      if (!log.created_at) return;
      const bucket = map.get(dayKey(new Date(log.created_at)));
      if (!bucket) return;
      bucket.total += 1;
      if (log.type === "login") bucket.login += 1;
      else if (log.type === "invalid") bucket.invalid += 1;
      else if (log.type === "admin") bucket.admin += 1;
    });
    return [...map.values()];
  }, [logs, days]);

  const max = useMemo(() => Math.max(1, ...buckets.map((b) => b.total)), [buckets]);
  const totalPeriod = useMemo(() => buckets.reduce((sum, b) => sum + b.total, 0), [buckets]);

  useEffect(() => {
    setMounted(false);
    const timer = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, [buckets]);

  const labelSize = big ? "text-[11px]" : "text-[9px]";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          {LEGEND.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className={`font-mono uppercase tracking-wider text-[#8b8b9e] ${big ? "text-xs" : "text-[10px]"}`}>
                {item.label}
              </span>
            </span>
          ))}
        </div>
        <span className={`font-mono uppercase tracking-wider text-[#5a5a6e] ${big ? "text-xs" : "text-[10px]"}`}>
          {totalPeriod} activité{totalPeriod > 1 ? "s" : ""} · {days} j
        </span>
      </div>

      <div className="relative">
        <div className="flex items-end gap-1 sm:gap-1.5">
          {buckets.map((bucket, index) => {
            const barH = Math.round((bucket.total / max) * plotHeight);
            return (
              <div key={bucket.key} className="flex flex-1 flex-col items-center gap-2" title={`${bucket.fullLabel} · ${bucket.total} activité(s)`}>
                <div className="flex w-full items-end justify-center" style={{ height: plotHeight }}>
                  <div
                    className="flex w-full flex-col-reverse overflow-hidden rounded-t-md transition-all duration-700 ease-out"
                    style={{
                      height: mounted ? Math.max(bucket.total > 0 ? barH : 0, bucket.total > 0 ? 5 : 0) : 0,
                      transitionDelay: `${index * 35}ms`,
                    }}
                  >
                    {bucket.login > 0 ? (
                      <div style={{ flexGrow: bucket.login }} className="w-full bg-gradient-to-t from-[#00f0ff]/50 to-[#00f0ff]" />
                    ) : null}
                    {bucket.invalid > 0 ? (
                      <div style={{ flexGrow: bucket.invalid }} className="w-full bg-gradient-to-t from-[#ff5470]/50 to-[#ff5470]" />
                    ) : null}
                    {bucket.admin > 0 ? (
                      <div style={{ flexGrow: bucket.admin }} className="w-full bg-gradient-to-t from-[#8b5cf6]/50 to-[#a78bfa]" />
                    ) : null}
                  </div>
                </div>
                <span className={`font-mono text-[#5a5a6e] ${labelSize}`}>{bucket.label}</span>
              </div>
            );
          })}
        </div>

        {totalPeriod === 0 ? (
          <div className="absolute inset-x-0 top-0 flex h-[calc(100%-1.5rem)] items-center justify-center">
            <p className="text-sm text-[#5a5a6e]">Aucune activité sur les {days} derniers jours.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}