import { useCallback, useEffect, useRef, useState } from "react";
import { addJournalEntry } from "@/pages/tunnel/journal";

export type VpnStatus = "disconnected" | "connecting" | "connected";

export interface VpnServer {
  id: number;
  name: string;
  country: string;
  flag: string;
  type: string;
}

export interface VpnController {
  status: VpnStatus;
  seconds: number;
  download: number;
  upload: number;
  ping: number;
  ip: string;
  connect: () => void;
  disconnect: () => void;
}

interface UseVpnConnectionArgs {
  server: VpnServer | null;
}

function randomServerIp(): string {
  const a = 45 + Math.floor(Math.random() * 160);
  const b = Math.floor(Math.random() * 256);
  const c = Math.floor(Math.random() * 256);
  const d = 1 + Math.floor(Math.random() * 254);
  return `${a}.${b}.${c}.${d}`;
}

/**
 * Gère l'état de la connexion : chrono de session, ping, débit descendant /
 * montant et adresse IP. À la déconnexion, la session est ajoutée au journal.
 */
export function useVpnConnection({ server }: UseVpnConnectionArgs): VpnController {
  const [status, setStatus] = useState<VpnStatus>("disconnected");
  const [seconds, setSeconds] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [ip, setIp] = useState("");

  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const statusRef = useRef<VpnStatus>("disconnected");
  const startedAtRef = useRef(0);
  const serverRef = useRef<VpnServer | null>(server);
  const totalsRef = useRef({ down: 0, up: 0 });

  serverRef.current = server;

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const commitJournal = useCallback(() => {
    const active = serverRef.current;
    const startedAt = startedAtRef.current;
    if (!active || !startedAt) return;
    const endedAt = Date.now();
    const durationSec = Math.max(1, Math.round((endedAt - startedAt) / 1000));
    addJournalEntry({
      id: `${startedAt}-${active.id}`,
      server: active.name,
      country: active.country,
      flag: active.flag,
      type: active.type,
      startedAt,
      endedAt,
      durationSec,
      downloadMb: Number((totalsRef.current.down / 8).toFixed(1)),
      uploadMb: Number((totalsRef.current.up / 8).toFixed(1)),
    });
  }, []);

  const disconnect = useCallback(() => {
    clearTimers();
    if (statusRef.current === "connected") commitJournal();
    statusRef.current = "disconnected";
    setStatus("disconnected");
    setDownload(0);
    setUpload(0);
    setPing(0);
  }, [clearTimers, commitJournal]);

  const connect = useCallback(() => {
    const active = serverRef.current;
    if (!active) return;
    clearTimers();
    statusRef.current = "connecting";
    setStatus("connecting");
    setSeconds(0);
    setDownload(0);
    setUpload(0);
    totalsRef.current = { down: 0, up: 0 };

    timeoutRef.current = window.setTimeout(() => {
      startedAtRef.current = Date.now();
      setIp(randomServerIp());
      setPing(12 + Math.floor(Math.random() * 60));
      statusRef.current = "connected";
      setStatus("connected");

      intervalRef.current = window.setInterval(() => {
        setSeconds((value) => value + 1);
        const down = 6 + Math.random() * 58;
        const up = 2 + Math.random() * 22;
        totalsRef.current.down += down;
        totalsRef.current.up += up;
        setDownload(down);
        setUpload(up);
      }, 1000);
    }, 1400);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return { status, seconds, download, upload, ping, ip, connect, disconnect };
}