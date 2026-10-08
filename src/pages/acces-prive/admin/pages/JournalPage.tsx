import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDateTime } from "@/pages/acces-prive/admin/utils";
import { downloadCsv, timestampSuffix } from "@/pages/acces-prive/admin/csv";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import { AdminInput, AdminSelect } from "@/pages/acces-prive/admin/components/inputs";

interface ActivityEntry {
  id: number;
  created_at: string;
  type: string | null;
  message: string | null;
  token_code: string | null;
  ip: string | null;
}

const TYPE_META: Record<string, { label: string; className: string }> = {
  login: { label: "Connexion", className: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]" },
  invalid: { label: "Échec", className: "border-[#ff5470]/40 bg-[#ff5470]/10 text-[#ff5470]" },
  admin: { label: "Admin", className: "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#a78bfa]" },
};

function typeMeta(type: string | null) {
  if (!type) return { label: "—", className: "border-[#232334] bg-white/5 text-[#8b8b9e]" };
  return TYPE_META[type] ?? { label: type, className: "border-[#232334] bg-white/5 text-[#8b8b9e]" };
}

export default function JournalPage() {
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: loadError } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (loadError) throw loadError;
      setLogs((data as ActivityEntry[]) ?? []);
    } catch {
      setError("Impossible de charger le journal. Vérifie ta connexion puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.type) set.add(log.type);
    });
    return ["login", "invalid", "admin", ...Array.from(set)].filter(
      (type, index, arr) => arr.indexOf(type) === index
    );
  }, [logs]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (typeFilter !== "all" && log.type !== typeFilter) return false;
      if (!term) return true;
      return (
        (log.message ?? "").toLowerCase().includes(term) ||
        (log.token_code ?? "").toLowerCase().includes(term) ||
        (log.ip ?? "").toLowerCase().includes(term)
      );
    });
  }, [logs, search, typeFilter]);

  const stats = useMemo(
    () => ({
      total: logs.length,
      login: logs.filter((l) => l.type === "login").length,
      invalid: logs.filter((l) => l.type === "invalid").length,
      admin: logs.filter((l) => l.type === "admin").length,
    }),
    [logs]
  );

  const exportCsv = () => {
    downloadCsv(
      `journal-activite-${timestampSuffix()}.csv`,
      ["Type", "Message", "Jeton", "IP", "Date"],
      filtered.map((log) => [
        typeMeta(log.type).label,
        log.message ?? "",
        log.token_code ?? "",
        log.ip ?? "",
        log.created_at ? formatDateTime(log.created_at) : "",
      ])
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">Chargement du journal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">Journal d'activité</h2>
          <p className="mt-1 text-sm text-[#8b8b9e]">Historique des connexions, échecs et actions de l'admin.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#34d399] transition-colors hover:bg-[#34d399]/20 disabled:opacity-50 cursor-pointer"
          >
            <i className="ri-download-2-line text-base" />
            Exporter CSV
          </button>
          <button
            type="button"
            onClick={loadData}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-[#232334] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
          >
            <i className="ri-refresh-line text-base" />
            Rafraîchir
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-[#ff5470]/40 bg-[#ff5470]/10 px-4 py-3">
          <i className="ri-error-warning-line text-base text-[#ff5470]" />
          <p className="text-sm text-[#ff5470]">{error}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: "ri-file-list-3-line", tone: "text-[#8b8b9e]" },
          { label: "Connexions", value: stats.login, icon: "ri-login-circle-line", tone: "text-[#00f0ff]" },
          { label: "Échecs", value: stats.invalid, icon: "ri-error-warning-line", tone: "text-[#ff5470]" },
          { label: "Actions admin", value: stats.admin, icon: "ri-shield-user-line", tone: "text-[#a78bfa]" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-[#232334] bg-[#12121b] p-3.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#232334] bg-white/5 ${item.tone}`}>
              <i className={`${item.icon} text-base`} />
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-[#e8e8f0]">{item.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Panel
        title={`Entrées (${filtered.length})`}
        icon="ri-history-line"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <i className="ri-search-line pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[#5a5a6e]" />
              <AdminInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-48 pl-8 text-xs"
              />
            </div>
            <AdminSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-36 text-xs">
              <option value="all" className="bg-[#0d0d14]">
                Tous les types
              </option>
              {typeOptions.map((type) => (
                <option key={type} value={type} className="bg-[#0d0d14]">
                  {typeMeta(type).label}
                </option>
              ))}
            </AdminSelect>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <i className="ri-history-line text-2xl text-[#3a3a52]" />
            <p className="mt-2 text-sm text-[#8b8b9e]">
              {logs.length === 0 ? "Aucune activité enregistrée pour le moment." : "Aucune entrée ne correspond à ton filtre."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#232334]">
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Type</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Message</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Jeton</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">IP</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const meta = typeMeta(log.type);
                  return (
                    <tr key={log.id} className="adm-row border-b border-[#1b1b28] last:border-0">
                      <td className="px-2 py-2.5">
                        <span className={`inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${meta.className}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-sm text-[#c7c7d6]">{log.message ?? "—"}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">{log.token_code ?? "—"}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">{log.ip ?? "—"}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}