import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ActivityEntry {
  id: number;
  created_at: string;
  type: string | null;
  message: string | null;
  token_code: string | null;
}

const SEEN_KEY = "dgm_admin_notif_seen";

const TYPE_META: Record<string, { icon: string; className: string }> = {
  login: { icon: "ri-login-circle-line", className: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]" },
  invalid: { icon: "ri-error-warning-line", className: "border-[#ff5470]/40 bg-[#ff5470]/10 text-[#ff5470]" },
  admin: { icon: "ri-shield-user-line", className: "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#a78bfa]" },
};

function metaOf(type: string | null) {
  if (!type) return { icon: "ri-notification-3-line", className: "border-[#232334] bg-white/5 text-[#8b8b9e]" };
  return TYPE_META[type] ?? { icon: "ri-notification-3-line", className: "border-[#232334] bg-white/5 text-[#8b8b9e]" };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [unread, setUnread] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("activity_log")
        .select("id, created_at, type, message, token_code")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      const list = (data as ActivityEntry[]) ?? [];
      setEntries(list);
      const seen = window.localStorage.getItem(SEEN_KEY) ?? "";
      const seenTime = seen ? new Date(seen).getTime() : 0;
      setUnread(list.filter((entry) => new Date(entry.created_at).getTime() > seenTime).length);
    } catch {
      setEntries([]);
      setUnread(0);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 20000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = () => {
    setOpen((value) => {
      const next = !value;
      if (next) {
        window.localStorage.setItem(SEEN_KEY, new Date().toISOString());
        setUnread(0);
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#232334] text-[#c3c3d4] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
      >
        <i className="ri-notification-3-line text-lg" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5470] px-1 font-mono text-[9px] font-bold text-white adm-ping">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-[#232334] adm-glass-strong adm-glow-primary adm-fade-up">
          <div className="flex items-center justify-between gap-3 border-b border-[#232334] px-4 py-3">
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-[#e8e8f0]">Activité récente</p>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#34d399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
              Live
            </span>
          </div>
          <div className="adm-scroll max-h-80 overflow-y-auto p-2">
            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <i className="ri-notification-off-line text-xl text-[#3a3a52]" />
                <p className="mt-2 text-xs text-[#8b8b9e]">Aucune activité pour l'instant.</p>
              </div>
            ) : (
              entries.map((entry) => {
                const meta = metaOf(entry.type);
                return (
                  <div key={entry.id} className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/5">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${meta.className}`}>
                      <i className={`${meta.icon} text-sm`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug text-[#c7c7d6]">{entry.message ?? "Activité"}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#5a5a6e]">{timeAgo(entry.created_at)}</span>
                        {entry.token_code ? (
                          <span className="truncate font-mono text-[10px] text-[#5a5a6e]">· {entry.token_code}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}