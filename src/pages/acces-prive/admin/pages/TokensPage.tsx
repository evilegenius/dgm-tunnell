import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { AccessToken } from "@/pages/acces-prive/types";
import { generateTokenCode, getTokenStatus } from "@/pages/acces-prive/types";
import { formatDateTime } from "@/pages/acces-prive/admin/utils";
import { downloadCsv, timestampSuffix } from "@/pages/acces-prive/admin/csv";
import { logAdminAction, logAdminActions } from "@/pages/acces-prive/admin/logger";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import ConfirmDialog from "@/pages/acces-prive/admin/components/ConfirmDialog";
import ExtendDaysModal from "@/pages/acces-prive/admin/components/ExtendDaysModal";
import { AdminInput, AdminSelect, FieldLabel } from "@/pages/acces-prive/admin/components/inputs";

type StatusKey = "all" | "unused" | "active" | "expired" | "blocked";

interface DeviceCodeRow {
  token_code: string;
}

const STATUS_FILTERS: { key: StatusKey; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "unused", label: "Non utilisé" },
  { key: "active", label: "Actif" },
  { key: "expired", label: "Expiré" },
  { key: "blocked", label: "Bloqué" },
];

const ICON_BTN =
  "flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors cursor-pointer";

function statusKeyOf(token: AccessToken): Exclude<StatusKey, "all"> {
  if (token.blocked) return "blocked";
  if (token.expires_at && new Date(token.expires_at).getTime() < Date.now()) return "expired";
  if (token.activated_at) return "active";
  return "unused";
}

function generateUniqueCodes(count: number, existing: Set<string>): string[] {
  const result = new Set<string>();
  let guard = 0;
  while (result.size < count && guard < count * 60) {
    guard += 1;
    const code = generateTokenCode();
    if (!existing.has(code) && !result.has(code)) result.add(code);
  }
  return [...result];
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ quantity: "1", days: "30", max_devices: "1", note: "" });
  const [formMsg, setFormMsg] = useState("");
  const [formErr, setFormErr] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [extendTarget, setExtendTarget] = useState<AccessToken | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccessToken | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    setSelected(new Set());
    try {
      const [tokensRes, devicesRes] = await Promise.all([
        supabase.from("tokens").select("*").order("created_at", { ascending: false }),
        supabase.from("devices").select("token_code"),
      ]);
      if (tokensRes.error) throw tokensRes.error;
      if (devicesRes.error) throw devicesRes.error;
      setTokens((tokensRes.data as AccessToken[]) ?? []);
      const counts: Record<string, number> = {};
      ((devicesRes.data as DeviceCodeRow[]) ?? []).forEach((row) => {
        counts[row.token_code] = (counts[row.token_code] ?? 0) + 1;
      });
      setDeviceCounts(counts);
    } catch {
      setError("Impossible de charger les jetons. Vérifie ta connexion puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = search.trim().toUpperCase();
    return tokens.filter((token) => {
      if (statusFilter !== "all" && statusKeyOf(token) !== statusFilter) return false;
      if (!term) return true;
      return (
        token.code.toUpperCase().includes(term) ||
        (token.note ?? "").toUpperCase().includes(term)
      );
    });
  }, [tokens, search, statusFilter]);

  const exportCsv = () => {
    downloadCsv(
      `jetons-${timestampSuffix()}.csv`,
      ["Jeton", "Statut", "Durée (jours)", "Appareils utilisés", "Max appareils", "Activé le", "Expire le", "Note", "Créé le"],
      filtered.map((token) => [
        token.code,
        getTokenStatus(token).label,
        token.days ?? "",
        deviceCounts[token.code] ?? 0,
        token.max_devices ?? 1,
        token.activated_at ? formatDateTime(token.activated_at) : "",
        token.expires_at ? formatDateTime(token.expires_at) : "",
        token.note ?? "",
        token.created_at ? formatDateTime(token.created_at) : "",
      ])
    );
  };

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMsg("");
    setFormErr("");
    const quantity = Number(form.quantity);
    const days = Number(form.days);
    const maxDevices = Number(form.max_devices);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      setFormErr("La quantité doit être un nombre entier entre 1 et 50.");
      return;
    }
    if (!Number.isInteger(days) || days < 1 || days > 3650) {
      setFormErr("La durée doit être un nombre de jours entre 1 et 3650.");
      return;
    }
    if (!Number.isInteger(maxDevices) || maxDevices < 1 || maxDevices > 100) {
      setFormErr("Le nombre d'appareils doit être entre 1 et 100.");
      return;
    }

    setBusy(true);
    try {
      const { data: existingRows, error: existingError } = await supabase.from("tokens").select("code");
      if (existingError) throw existingError;
      const existing = new Set(((existingRows ?? []) as { code: string }[]).map((row) => row.code));
      const codes = generateUniqueCodes(quantity, existing);
      if (codes.length < quantity) throw new Error("code-generation-failed");

      const { error: insertError } = await supabase.from("tokens").insert(
        codes.map((code) => ({
          code,
          days,
          max_devices: maxDevices,
          note: form.note.trim() || null,
          blocked: false,
        }))
      );
      if (insertError) throw insertError;

      await logAdminActions(
        codes.map((code) => ({
          message: `Jeton créé (${days} j, ${maxDevices} appareil${maxDevices > 1 ? "s" : ""}).`,
          tokenCode: code,
        }))
      );

      setForm({ quantity: "1", days: "30", max_devices: "1", note: "" });
      setFormMsg(`${codes.length} jeton${codes.length > 1 ? "s" : ""} créé${codes.length > 1 ? "s" : ""} : ${codes.join(", ")}`);
      await loadData();
    } catch {
      setFormErr("La génération a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async (token: AccessToken) => {
    try {
      await navigator.clipboard.writeText(token.code);
      setCopiedId(token.id);
      window.setTimeout(() => setCopiedId((current) => (current === token.id ? null : current)), 1600);
    } catch {
      setError("La copie a échoué. Copie le code manuellement.");
    }
  };

  const toggleBlock = async (token: AccessToken) => {
    setBusy(true);
    try {
      const nextBlocked = !token.blocked;
      const { error: updateError } = await supabase.from("tokens").update({ blocked: nextBlocked }).eq("id", token.id);
      if (updateError) throw updateError;
      await logAdminAction(nextBlocked ? "Jeton bloqué." : "Jeton débloqué.", token.code);
      await loadData();
    } catch {
      setError("L'opération a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const confirmExtend = async (days: number) => {
    if (!extendTarget) return;
    setBusy(true);
    try {
      const patch: Record<string, unknown> = { days: (extendTarget.days ?? 0) + days };
      if (extendTarget.activated_at && extendTarget.expires_at) {
        patch.expires_at = new Date(new Date(extendTarget.expires_at).getTime() + days * 86400000).toISOString();
      }
      const { error: updateError } = await supabase.from("tokens").update(patch).eq("id", extendTarget.id);
      if (updateError) throw updateError;
      await logAdminAction(`Jeton prolongé de ${days} jour${days > 1 ? "s" : ""}.`, extendTarget.code);
      setExtendTarget(null);
      await loadData();
    } catch {
      setError("La prolongation a échoué. Réessaie.");
      setExtendTarget(null);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await supabase.from("devices").delete().eq("token_code", deleteTarget.code);
      const { error: deleteError } = await supabase.from("tokens").delete().eq("id", deleteTarget.id);
      if (deleteError) throw deleteError;
      await logAdminAction("Jeton supprimé.", deleteTarget.code);
      setDeleteTarget(null);
      await loadData();
    } catch {
      setError("La suppression a échoué. Réessaie.");
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every((token) => selected.has(token.id));

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (filtered.length > 0 && filtered.every((token) => prev.has(token.id))) {
        filtered.forEach((token) => next.delete(token.id));
      } else {
        filtered.forEach((token) => next.add(token.id));
      }
      return next;
    });
  };

  const bulkSetBlocked = async (blocked: boolean) => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const { error: updateError } = await supabase.from("tokens").update({ blocked }).in("id", ids);
      if (updateError) throw updateError;
      await logAdminActions(
        tokens
          .filter((token) => selected.has(token.id))
          .map((token) => ({
            message: blocked ? "Jeton bloqué (action groupée)." : "Jeton débloqué (action groupée).",
            tokenCode: token.code,
          }))
      );
      await loadData();
    } catch {
      setError("L'opération groupée a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const bulkDelete = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const codes = tokens.filter((token) => selected.has(token.id)).map((token) => token.code);
      if (codes.length > 0) {
        await supabase.from("devices").delete().in("token_code", codes);
      }
      const { error: deleteError } = await supabase.from("tokens").delete().in("id", ids);
      if (deleteError) throw deleteError;
      await logAdminActions(codes.map((code) => ({ message: "Jeton supprimé (action groupée).", tokenCode: code })));
      await loadData();
    } catch {
      setError("La suppression groupée a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">Chargement des jetons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">Jetons d'accès</h2>
          <p className="mt-1 text-sm text-[#8b8b9e]">Génère, suis et gère les jetons d'accès clients.</p>
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

      <Panel title="Générer des jetons" icon="ri-add-circle-line">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <FieldLabel hint="1 à 50">Quantité</FieldLabel>
              <AdminInput
                type="number"
                min={1}
                max={50}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </label>
            <label className="block">
              <FieldLabel hint="jours">Durée</FieldLabel>
              <AdminInput
                type="number"
                min={1}
                max={3650}
                value={form.days}
                onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
              />
            </label>
            <label className="block">
              <FieldLabel hint="appareils">Maximum d'appareils</FieldLabel>
              <AdminInput
                type="number"
                min={1}
                max={100}
                value={form.max_devices}
                onChange={(e) => setForm((f) => ({ ...f, max_devices: e.target.value }))}
              />
            </label>
          </div>
          <label className="block">
            <FieldLabel hint="optionnel">Note</FieldLabel>
            <AdminInput
              value={form.note}
              maxLength={120}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Client Telegram @exemple — offre 3 mois"
            />
          </label>
          {formErr ? (
            <div className="flex items-start gap-2 rounded-md border border-[#ff5470]/40 bg-[#ff5470]/10 px-3 py-2.5">
              <i className="ri-error-warning-line mt-0.5 text-base text-[#ff5470]" />
              <p className="text-xs text-[#ff5470]">{formErr}</p>
            </div>
          ) : null}
          {formMsg ? (
            <div className="flex items-start gap-2 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-3 py-2.5">
              <i className="ri-check-line mt-0.5 text-base text-[#34d399]" />
              <p className="break-all text-xs text-[#34d399]">{formMsg}</p>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#00f0ff] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0a0a0f] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 sm:w-auto cursor-pointer"
          >
            {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-magic-line text-base" />}
            Générer
          </button>
        </form>
      </Panel>

      <Panel
        title={`Liste des jetons (${filtered.length})`}
        icon="ri-coupon-3-line"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <i className="ri-search-line pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[#5a5a6e]" />
              <AdminInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un jeton..."
                className="w-52 pl-8 text-xs"
              />
            </div>
            <AdminSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusKey)}
              className="w-36 text-xs"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status.key} value={status.key} className="bg-[#0d0d14]">
                  {status.label}
                </option>
              ))}
            </AdminSelect>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <i className="ri-coupon-3-line text-2xl text-[#3a3a52]" />
            <p className="mt-2 text-sm text-[#8b8b9e]">
              {tokens.length === 0 ? "Aucun jeton pour l'instant. Génère ton premier jeton." : "Aucun jeton ne correspond à ta recherche."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#232334]">
                  <th className="w-10 px-2 py-2">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      aria-label="Tout sélectionner"
                      className="h-4 w-4 cursor-pointer accent-[#00f0ff]"
                    />
                  </th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Jeton</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Statut</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Durée</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Appareils</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Expiration</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Note</th>
                  <th className="px-2 py-2 text-right font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((token) => {
                  const status = getTokenStatus(token);
                  const used = deviceCounts[token.code] ?? 0;
                  return (
                    <tr
                      key={token.id}
                      className={`adm-row border-b border-[#1b1b28] last:border-0 ${
                        selected.has(token.id) ? "bg-[#00f0ff]/5" : ""
                      }`}
                    >
                      <td className="px-2 py-2.5">
                        <input
                          type="checkbox"
                          checked={selected.has(token.id)}
                          onChange={() => toggleSelect(token.id)}
                          aria-label={`Sélectionner ${token.code}`}
                          className="h-4 w-4 cursor-pointer accent-[#00f0ff]"
                        />
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#e8e8f0]">{token.code}</span>
                          <button
                            type="button"
                            onClick={() => copyCode(token)}
                            title="Copier"
                            className={`${ICON_BTN} h-6 w-6 hover:border-[#00f0ff]/50 hover:text-[#00f0ff]`}
                          >
                            <i className={copiedId === token.id ? "ri-check-line text-sm" : "ri-file-copy-line text-sm"} />
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${status.className}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#c7c7d6]">{token.days} j</td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#c7c7d6]">
                        <span className={used >= (token.max_devices ?? 1) ? "text-[#f5b544]" : ""}>{used}</span>
                        <span className="text-[#5a5a6e]"> / {token.max_devices ?? 1}</span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                        {token.activated_at ? formatDateTime(token.expires_at) : "— (non activé)"}
                      </td>
                      <td className="max-w-[180px] truncate px-2 py-2.5 text-xs text-[#8b8b9e]" title={token.note ?? ""}>
                        {token.note ?? "—"}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleBlock(token)}
                            title={token.blocked ? "Débloquer" : "Bloquer"}
                            className={`${ICON_BTN} hover:border-[#ff5470]/50 hover:text-[#ff5470]`}
                          >
                            <i className={token.blocked ? "ri-lock-unlock-line text-base" : "ri-lock-line text-base"} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExtendTarget(token)}
                            title="Prolonger"
                            className={`${ICON_BTN} hover:border-[#f5b544]/50 hover:text-[#f5b544]`}
                          >
                            <i className="ri-timer-flash-line text-base" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(token)}
                            title="Supprimer"
                            className={`${ICON_BTN} hover:border-[#ff5470]/50 hover:text-[#ff5470]`}
                          >
                            <i className="ri-delete-bin-6-line text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {extendTarget ? (
        <ExtendDaysModal
          tokenCode={extendTarget.code}
          busy={busy}
          onClose={() => setExtendTarget(null)}
          onConfirm={confirmExtend}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title="Supprimer le jeton"
          message={`Le jeton « ${deleteTarget.code} » et ses appareils enregistrés seront définitivement supprimés.`}
          busy={busy}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {selected.size > 0 ? (
        <div className="fixed inset-x-0 bottom-4 z-[100] flex justify-center px-4">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#00f0ff]/30 adm-glass-strong adm-glow-primary adm-fade-up px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#e8e8f0]">
              {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
            </span>
            <span className="mx-1 hidden h-5 w-px bg-[#232334] sm:block" />
            <button
              type="button"
              onClick={() => bulkSetBlocked(true)}
              disabled={busy}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ff5470]/40 bg-[#ff5470]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/20 disabled:opacity-60 cursor-pointer"
            >
              <i className="ri-lock-line text-sm" />
              Bloquer
            </button>
            <button
              type="button"
              onClick={() => bulkSetBlocked(false)}
              disabled={busy}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#34d399]/40 bg-[#34d399]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#34d399] transition-colors hover:bg-[#34d399]/20 disabled:opacity-60 cursor-pointer"
            >
              <i className="ri-lock-unlock-line text-sm" />
              Débloquer
            </button>
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(true)}
              disabled={busy}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ff5470]/50 bg-[#ff5470]/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/25 disabled:opacity-60 cursor-pointer"
            >
              <i className="ri-delete-bin-6-line text-sm" />
              Supprimer
            </button>
            <span className="mx-1 hidden h-5 w-px bg-[#232334] sm:block" />
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#232334] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] cursor-pointer"
            >
              <i className="ri-close-line text-sm" />
              Annuler
            </button>
          </div>
        </div>
      ) : null}

      {bulkDeleteOpen ? (
        <ConfirmDialog
          title="Suppression groupée"
          message={`${selected.size} jeton${selected.size > 1 ? "s" : ""} et leurs appareils enregistrés seront définitivement supprimés.`}
          busy={busy}
          onCancel={() => setBulkDeleteOpen(false)}
          onConfirm={async () => {
            await bulkDelete();
            setBulkDeleteOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}