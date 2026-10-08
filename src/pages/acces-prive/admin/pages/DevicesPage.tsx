import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDateTime } from "@/pages/acces-prive/admin/utils";
import { logAdminAction } from "@/pages/acces-prive/admin/logger";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import ConfirmDialog from "@/pages/acces-prive/admin/components/ConfirmDialog";
import { AdminInput } from "@/pages/acces-prive/admin/components/inputs";

interface DeviceRecord {
  id: number;
  token_code: string;
  device_id: string;
  first_seen: string | null;
  last_seen: string | null;
}

const ICON_BTN =
  "flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors cursor-pointer";

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeviceRecord | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: loadError } = await supabase
        .from("devices")
        .select("*")
        .order("last_seen", { ascending: false });
      if (loadError) throw loadError;
      setDevices((data as DeviceRecord[]) ?? []);
    } catch {
      setError("Impossible de charger les appareils. Vérifie ta connexion puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = search.trim().toUpperCase();
    if (!term) return devices;
    return devices.filter(
      (device) =>
        device.token_code.toUpperCase().includes(term) || device.device_id.toUpperCase().includes(term)
    );
  }, [devices, search]);

  const confirmRemove = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const { error: deleteError } = await supabase.from("devices").delete().eq("id", deleteTarget.id);
      if (deleteError) throw deleteError;
      await logAdminAction(`Appareil retiré (${deleteTarget.device_id.slice(0, 12)}…).`, deleteTarget.token_code);
      setDeleteTarget(null);
      await loadData();
    } catch {
      setError("Le retrait de l'appareil a échoué. Réessaie.");
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">Chargement des appareils...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">Appareils</h2>
          <p className="mt-1 text-sm text-[#8b8b9e]">Appareils enregistrés pour chaque jeton.</p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="flex items-center gap-2 whitespace-nowrap rounded-md border border-[#232334] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
        >
          <i className="ri-refresh-line text-base" />
          Rafraîchir
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-[#ff5470]/40 bg-[#ff5470]/10 px-4 py-3">
          <i className="ri-error-warning-line text-base text-[#ff5470]" />
          <p className="text-sm text-[#ff5470]">{error}</p>
        </div>
      ) : null}

      <Panel
        title={`Liste des appareils (${filtered.length})`}
        icon="ri-smartphone-line"
        action={
          <div className="relative">
            <i className="ri-search-line pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[#5a5a6e]" />
            <AdminInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un jeton ou appareil..."
              className="w-56 pl-8 text-xs"
            />
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <i className="ri-smartphone-line text-2xl text-[#3a3a52]" />
            <p className="mt-2 text-sm text-[#8b8b9e]">
              {devices.length === 0 ? "Aucun appareil enregistré pour l'instant." : "Aucun appareil ne correspond à ta recherche."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#232334]">
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Jeton</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Appareil</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Premier accès</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Dernier accès</th>
                  <th className="px-2 py-2 text-right font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((device) => (
                  <tr key={device.id} className="adm-row border-b border-[#1b1b28] last:border-0">
                    <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs font-semibold text-[#e8e8f0]">
                      {device.token_code}
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className="inline-block max-w-[220px] truncate align-middle font-mono text-[11px] text-[#8b8b9e]"
                        title={device.device_id}
                      >
                        {device.device_id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                      {formatDateTime(device.first_seen)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#c7c7d6]">
                      {formatDateTime(device.last_seen)}
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(device)}
                          title="Retirer l'appareil"
                          className={`${ICON_BTN} hover:border-[#ff5470]/50 hover:text-[#ff5470]`}
                        >
                          <i className="ri-logout-circle-r-line text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {deleteTarget ? (
        <ConfirmDialog
          title="Retirer l'appareil"
          message={`L'appareil « ${deleteTarget.device_id} » associé au jeton ${deleteTarget.token_code} sera retiré. Il pourra se reconnecter s'il reste de la place.`}
          confirmLabel="Retirer"
          busy={busy}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmRemove}
        />
      ) : null}
    </div>
  );
}