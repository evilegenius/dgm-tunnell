import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Country, VpnConfig } from "@/pages/acces-prive/types";
import { CONFIG_TYPES } from "@/pages/acces-prive/types";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import TypeBadge from "@/pages/acces-prive/admin/components/TypeBadge";
import ConfirmDialog from "@/pages/acces-prive/admin/components/ConfirmDialog";
import ConfigEditModal from "@/pages/acces-prive/admin/components/ConfigEditModal";
import { logAdminAction } from "@/pages/acces-prive/admin/logger";
import { AdminInput, AdminSelect, AdminTextarea, FieldLabel } from "@/pages/acces-prive/admin/components/inputs";

type DeleteTarget =
  | { kind: "country"; id: number; label: string; count: number }
  | { kind: "config"; id: number; label: string }
  | null;

const ICON_BTN =
  "flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors cursor-pointer";

export default function CountriesConfigsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [configs, setConfigs] = useState<VpnConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [countryForm, setCountryForm] = useState({ name: "", flag: "" });
  const [countryMsg, setCountryMsg] = useState("");
  const [countryErr, setCountryErr] = useState("");

  const [configForm, setConfigForm] = useState({ country_id: "", type: "VLESS", name: "", content: "" });
  const [configMsg, setConfigMsg] = useState("");
  const [configErr, setConfigErr] = useState("");

  const [editingConfig, setEditingConfig] = useState<VpnConfig | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [countriesRes, configsRes] = await Promise.all([
        supabase.from("countries").select("*").order("name", { ascending: true }),
        supabase.from("configs").select("*").order("name", { ascending: true }),
      ]);
      if (countriesRes.error) throw countriesRes.error;
      if (configsRes.error) throw configsRes.error;
      setCountries((countriesRes.data as Country[]) ?? []);
      setConfigs((configsRes.data as VpnConfig[]) ?? []);
    } catch {
      setError("Impossible de charger les données. Vérifie ta connexion puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const configsByCountry = useMemo(() => {
    const map = new Map<number, VpnConfig[]>();
    configs.forEach((c) => {
      const list = map.get(c.country_id) ?? [];
      list.push(c);
      map.set(c.country_id, list);
    });
    return map;
  }, [configs]);

  const addCountry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCountryMsg("");
    setCountryErr("");
    if (!countryForm.name.trim()) {
      setCountryErr("Le nom du pays est requis.");
      return;
    }
    setBusy(true);
    try {
      const { error: insertError } = await supabase.from("countries").insert({
        name: countryForm.name.trim(),
        flag: countryForm.flag.trim() || null,
        active: true,
      });
      if (insertError) throw insertError;
      await logAdminAction(`Pays ajouté : ${countryForm.name.trim()}.`);
      setCountryForm({ name: "", flag: "" });
      setCountryMsg("Pays ajouté.");
      await loadData();
    } catch {
      setCountryErr("L'ajout du pays a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const addConfig = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfigMsg("");
    setConfigErr("");
    if (!configForm.country_id) {
      setConfigErr("Sélectionne un pays.");
      return;
    }
    if (!configForm.name.trim()) {
      setConfigErr("Le nom de la configuration est requis.");
      return;
    }
    setBusy(true);
    try {
      const { error: insertError } = await supabase.from("configs").insert({
        country_id: Number(configForm.country_id),
        type: configForm.type,
        name: configForm.name.trim(),
        content: configForm.content.trim() || null,
        active: true,
      });
      if (insertError) throw insertError;
      await logAdminAction(`Configuration ajoutée : ${configForm.name.trim()} (${configForm.type}).`);
      setConfigForm({ country_id: "", type: "VLESS", name: "", content: "" });
      setConfigMsg("Configuration ajoutée.");
      await loadData();
    } catch {
      setConfigErr("L'ajout de la configuration a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const toggleConfig = async (config: VpnConfig) => {
    await supabase.from("configs").update({ active: !config.active }).eq("id", config.id);
    await logAdminAction(`Configuration ${config.active ? "masquée" : "affichée"} : ${config.name}.`);
    loadData();
  };

  const toggleCountry = async (country: Country) => {
    await supabase.from("countries").update({ active: !country.active }).eq("id", country.id);
    await logAdminAction(`Pays ${country.active ? "désactivé" : "activé"} : ${country.name}.`);
    loadData();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      if (deleteTarget.kind === "country") {
        await supabase.from("configs").delete().eq("country_id", deleteTarget.id);
        const { error: delError } = await supabase.from("countries").delete().eq("id", deleteTarget.id);
        if (delError) throw delError;
      } else {
        const { error: delError } = await supabase.from("configs").delete().eq("id", deleteTarget.id);
        if (delError) throw delError;
      }
      await logAdminAction(
        deleteTarget.kind === "country" ? `Pays supprimé : ${deleteTarget.label}.` : `Configuration supprimée : ${deleteTarget.label}.`
      );
      setDeleteTarget(null);
      await loadData();
    } catch {
      setError("La suppression a échoué. Réessaie.");
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">Pays et configurations</h2>
          <p className="mt-1 text-sm text-[#8b8b9e]">Gère les destinations et leurs configurations de connexion.</p>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Ajouter un pays" icon="ri-add-circle-line">
          <form onSubmit={addCountry} className="space-y-4">
            <label className="block">
              <FieldLabel>Nom du pays</FieldLabel>
              <AdminInput
                value={countryForm.name}
                onChange={(e) => setCountryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="France"
              />
            </label>
            <label className="block">
              <FieldLabel hint="emoji">Drapeau</FieldLabel>
              <AdminInput
                value={countryForm.flag}
                onChange={(e) => setCountryForm((f) => ({ ...f, flag: e.target.value }))}
                placeholder="🇫🇷"
                maxLength={8}
              />
            </label>
            {countryErr ? <p className="text-xs text-[#ff5470]">{countryErr}</p> : null}
            {countryMsg ? <p className="text-xs text-[#34d399]">{countryMsg}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#00f0ff] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0a0a0f] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              <i className="ri-add-line text-base" />
              Ajouter le pays
            </button>
          </form>
        </Panel>

        <Panel title="Ajouter une configuration" icon="ri-add-circle-line">
          <form onSubmit={addConfig} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Pays</FieldLabel>
                <AdminSelect
                  value={configForm.country_id}
                  onChange={(e) => setConfigForm((f) => ({ ...f, country_id: e.target.value }))}
                >
                  <option value="" className="bg-[#0d0d14]">
                    — Choisir —
                  </option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0d0d14]">
                      {c.flag ? `${c.flag} ` : ""}
                      {c.name}
                    </option>
                  ))}
                </AdminSelect>
              </label>
              <label className="block">
                <FieldLabel>Type</FieldLabel>
                <AdminSelect
                  value={configForm.type}
                  onChange={(e) => setConfigForm((f) => ({ ...f, type: e.target.value }))}
                >
                  {CONFIG_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-[#0d0d14]">
                      {t}
                    </option>
                  ))}
                </AdminSelect>
              </label>
            </div>
            <label className="block">
              <FieldLabel>Nom de la configuration</FieldLabel>
              <AdminInput
                value={configForm.name}
                onChange={(e) => setConfigForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Paris Premium"
              />
            </label>
            <label className="block">
              <FieldLabel hint={`${configForm.content.length} caractères`}>Contenu</FieldLabel>
              <AdminTextarea
                rows={4}
                value={configForm.content}
                onChange={(e) => setConfigForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="vless://..."
                className="font-mono text-xs"
              />
            </label>
            {configErr ? <p className="text-xs text-[#ff5470]">{configErr}</p> : null}
            {configMsg ? <p className="text-xs text-[#34d399]">{configMsg}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#8b5cf6] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#7c4ef0] disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              <i className="ri-add-line text-base" />
              Ajouter la configuration
            </button>
          </form>
        </Panel>
      </div>

      <Panel title="Liste des pays et configurations" icon="ri-list-check-2">
        {countries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <i className="ri-global-line text-2xl text-[#3a3a52]" />
            <p className="mt-2 text-sm text-[#8b8b9e]">Aucun pays pour l'instant. Ajoute ton premier pays.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {countries.map((country) => {
              const list = configsByCountry.get(country.id) ?? [];
              return (
                <div key={country.id} className="rounded-lg border border-[#232334] bg-[#0d0d14]">
                  <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{country.flag || "🏳️"}</span>
                      <div>
                        <p className="font-heading text-sm font-bold text-[#e8e8f0]">{country.name}</p>
                        <p className="font-mono text-[11px] text-[#5a5a6e]">
                          {list.length} configuration{list.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCountry(country)}
                        title={country.active ? "Désactiver le pays" : "Activer le pays"}
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                          country.active
                            ? "border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]"
                            : "border-[#232334] bg-white/5 text-[#8b8b9e]"
                        }`}
                      >
                        <i className={country.active ? "ri-eye-line" : "ri-eye-off-line"} />
                        {country.active ? "Actif" : "Inactif"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ kind: "country", id: country.id, label: country.name, count: list.length })
                        }
                        title="Supprimer le pays"
                        className={`${ICON_BTN} hover:border-[#ff5470]/50 hover:text-[#ff5470]`}
                      >
                        <i className="ri-delete-bin-6-line text-base" />
                      </button>
                    </div>
                  </header>

                  <div className="space-y-2 border-t border-[#232334] p-3">
                    {list.length === 0 ? (
                      <p className="px-1 py-2 text-xs text-[#5a5a6e]">Aucune configuration pour ce pays.</p>
                    ) : (
                      list.map((config) => (
                        <div
                          key={config.id}
                          className="flex flex-col gap-3 rounded-lg border border-[#232334] bg-[#12121b] p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <TypeBadge type={config.type} />
                              <p className="truncate font-heading text-sm font-semibold text-[#e8e8f0]">{config.name}</p>
                              {!config.active ? (
                                <span className="inline-flex whitespace-nowrap rounded-md border border-[#232334] bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">
                                  Masquée
                                </span>
                              ) : null}
                            </div>
                            {config.content ? (
                              <p className="mt-1.5 truncate font-mono text-[11px] text-[#5a5a6e]">{config.content}</p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleConfig(config)}
                              title={config.active ? "Masquer" : "Afficher"}
                              className={`${ICON_BTN} hover:border-[#00f0ff]/50 hover:text-[#00f0ff]`}
                            >
                              <i className={config.active ? "ri-eye-off-line text-base" : "ri-eye-line text-base"} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingConfig(config)}
                              title="Modifier"
                              className={`${ICON_BTN} hover:border-[#8b5cf6]/50 hover:text-[#a78bfa]`}
                            >
                              <i className="ri-pencil-line text-base" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ kind: "config", id: config.id, label: config.name })}
                              title="Supprimer"
                              className={`${ICON_BTN} hover:border-[#ff5470]/50 hover:text-[#ff5470]`}
                            >
                              <i className="ri-delete-bin-6-line text-base" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {editingConfig ? (
        <ConfigEditModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
          onSaved={() => {
            setEditingConfig(null);
            loadData();
          }}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title="Confirmer la suppression"
          message={
            deleteTarget.kind === "country"
              ? `Le pays « ${deleteTarget.label} » et ses ${deleteTarget.count} configuration(s) seront définitivement supprimés.`
              : `La configuration « ${deleteTarget.label} » sera définitivement supprimée.`
          }
          busy={busy}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  );
}