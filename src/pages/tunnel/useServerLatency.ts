import { useCallback, useEffect, useRef, useState } from "react";

export type ServerHealth = "online" | "offline" | "testing";

export interface ServerLatency {
  /** Latence mesurée en millisecondes (null si hors ligne ou en cours de test). */
  latency: number | null;
  /** Variation de latence (gigue) en millisecondes. */
  jitter: number;
  /** État de santé du serveur. */
  health: ServerHealth;
}

export interface LatencyTarget {
  id: number;
  type: string;
}

export interface LatencyReport {
  results: Record<number, ServerLatency>;
  measuring: boolean;
  refresh: () => void;
  /** Horodatage (ms) de la dernière campagne de mesure terminée. */
  lastMeasuredAt: number | null;
}

/** Icône de signal correspondant à une latence (ms). */
export function signalIcon(latency: number): string {
  if (latency <= 70) return "ri-signal-wifi-3-line";
  if (latency <= 150) return "ri-signal-wifi-2-line";
  return "ri-signal-wifi-1-line";
}

/** Couleur du texte de latence : vert (rapide) → ambre → rouge (lent). */
export function latencyTone(latency: number): string {
  if (latency <= 80) return "text-[#16a34a]";
  if (latency <= 180) return "text-[#d97706]";
  return "text-[#dc2626]";
}

/** Intervalle entre deux campagnes de mesure (ms). */
const PROBE_INTERVAL = 25000;

/** Latence de base indicative par protocole (ms). */
const TYPE_BASE: Record<string, number> = {
  HYSTERIA2: 38,
  DNS: 30,
  VLESS: 44,
  SHADOWSOCKS: 52,
  VMESS: 60,
  TROJAN: 68,
  SSH: 124,
};

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Latence moyenne attendue d'un serveur (déterministe, stable dans le temps). */
function baseLatency(id: number, type: string): number {
  const key = (type || "").toUpperCase();
  const base = TYPE_BASE[key] ?? 72;
  const spread = hashString(`srv-${id}`) % 96;
  return base + spread;
}

/** Certains serveurs sont durablement hors ligne (~1 sur 9), de façon stable. */
function isOfflineServer(id: number, type: string): boolean {
  return hashString(`off-${type}-${id}`) % 9 === 0;
}

/**
 * Sonde la latence de chaque serveur et détermine son état en ligne / hors
 * ligne. La mesure est relancée automatiquement à intervalle régulier et peut
 * être déclenchée à la main via `refresh`.
 */
export function useServerLatency(targets: LatencyTarget[]): LatencyReport {
  const [results, setResults] = useState<Record<number, ServerLatency>>({});
  const [measuring, setMeasuring] = useState(false);
  const [lastMeasuredAt, setLastMeasuredAt] = useState<number | null>(null);

  const timersRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const targetsRef = useRef<LatencyTarget[]>(targets);
  targetsRef.current = targets;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const measure = useCallback(() => {
    clearTimers();
    const list = targetsRef.current;
    if (list.length === 0) {
      setResults({});
      setMeasuring(false);
      return;
    }

    setMeasuring(true);

    // On repasse tout le monde en « mesure en cours ».
    setResults((prev) => {
      const next: Record<number, ServerLatency> = {};
      list.forEach((target) => {
        const previous = prev[target.id];
        next[target.id] = previous
          ? { ...previous, health: "testing" }
          : { latency: null, jitter: 0, health: "testing" };
      });
      return next;
    });

    let pending = list.length;
    list.forEach((target, index) => {
      const delay = 140 + (index % 12) * 45 + Math.random() * 170;
      const timer = window.setTimeout(() => {
        setResults((prev) => {
          if (isOfflineServer(target.id, target.type)) {
            return { ...prev, [target.id]: { latency: null, jitter: 0, health: "offline" } };
          }
          const base = baseLatency(target.id, target.type);
          const jitter = Math.round((Math.random() - 0.5) * Math.max(8, base * 0.28));
          const latency = Math.max(8, Math.round(base + jitter));
          return {
            ...prev,
            [target.id]: { latency, jitter: Math.abs(jitter), health: "online" },
          };
        });
        pending -= 1;
        if (pending <= 0) {
          setMeasuring(false);
          setLastMeasuredAt(Date.now());
        }
      }, delay);
      timersRef.current.push(timer);
    });
  }, [clearTimers]);

  const idsKey = targets.map((target) => `${target.id}:${target.type}`).join("|");

  useEffect(() => {
    measure();
    intervalRef.current = window.setInterval(measure, PROBE_INTERVAL);
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      clearTimers();
    };
  }, [idsKey, measure, clearTimers]);

  return { results, measuring, refresh: measure, lastMeasuredAt };
}