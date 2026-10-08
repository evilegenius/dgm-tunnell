import { useEffect, useMemo, useState } from "react";
import type { JournalEntry } from "@/pages/tunnel/journal";
import { clearJournal, formatDataAmount, formatDateTime, formatDuration, getJournal } from "@/pages/tunnel/journal";
import type { VpnStatus } from "@/hooks/useVpnConnection";

interface JournalScreenProps {
  vpnStatus: VpnStatus;
}

const FILTERS: { key: string; label: string; days: number }[] = [
  { key: "all", label: "Tout", days: 0 },
  { key: "7", label: "7 jours", days: 7 },
  { key: "30", label: "30 jours", days: 30 },
];

export default function JournalScreen({ vpnStatus }: JournalScreenProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filter, setFilter] = useState("all");

  // Recharge l'historique à l'ouverture et à chaque changement de connexion.
  useEffect(() => {
    setEntries(getJournal());
  }, [vpnStatus]);

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    const days = Number(filter);
    const limit = Date.now() - days * 86400000;
    return entries.filter((entry) => entry.endedAt >= limit);
  }, [entries, filter]);

  const totalSeconds = useMemo(() => filtered.reduce((sum, e) => sum + e.durationSec, 0), [filtered]);
  const totalData = useMemo(
    () => filtered.reduce((sum, e) => sum + e.downloadMb + e.uploadMb, 0),
    [filtered]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wider text-[#3a0a26]">
            <i className="ri-history-line text-base text-[#e6007e]" />
            Journal des connexions
          </h2>
          <p className="mt-1 font-mono text-[11px] text-[#b98aa6]">Historique conservé sur cet appareil</p>
        </div>
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              clearJournal();
              setEntries([]);
            }}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dc2626]/40 bg-[#dc2626]/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[#dc2626] transition-colors hover:bg-[#dc2626]/20 cursor-pointer"
          >
            <i className="ri-delete-bin-6-line text-base" />
            Vider
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-3.5 text-center">
          <p className="font-heading text-xl font-bold text-[#3a0a26]">{filtered.length}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">Sessions</p>
        </div>
        <div className="rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-3.5 text-center">
          <p className="font-heading text-xl font-bold text-[#e6007e]">{formatDuration(totalSeconds)}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">Durée</p>
        </div>
        <div className="rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-3.5 text-center">
          <p className="font-heading text-xl font-bold text-[#d63384]">{formatDataAmount(totalData)}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">Données</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
              filter === item.key
                ? "border-[#e6007e]/60 bg-[#e6007e]/10 text-[#e6007e]"
                : "border-[#f7cfe3] text-[#9b6b86] hover:border-[#edb8d3] hover:text-[#3a0a26]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#f7cfe3] bg-[#ffffff] py-16 text-center">
          <i className="ri-file-list-3-line text-2xl text-[#edb8d3]" />
          <p className="mt-2 text-sm text-[#9b6b86]">Aucune connexion enregistrée.</p>
          <p className="mt-1 text-[12px] text-[#b98aa6]">Connecte-toi depuis l'écran Accueil pour voir ton historique.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-2xl leading-none">{entry.flag}</span>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold text-[#3a0a26]">
                      {entry.country} · {entry.server}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">
                      {formatDateTime(entry.endedAt)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-md border border-[#f7cfe3] bg-black/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#9b6b86]">
                  {entry.type}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#f7cfe3] pt-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">Durée</p>
                  <p className="mt-0.5 font-heading text-sm font-bold tabular-nums text-[#3a0a26]">
                    {formatDuration(entry.durationSec)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">Débit</p>
                  <p className="mt-0.5 font-heading text-sm font-bold text-[#e6007e]">
                    {formatDataAmount(entry.downloadMb + entry.uploadMb)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">Statut</p>
                  <p className="mt-0.5 flex items-center gap-1 font-heading text-sm font-bold text-[#16a34a]">
                    <i className="ri-checkbox-circle-line text-sm" />
                    Terminée
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}