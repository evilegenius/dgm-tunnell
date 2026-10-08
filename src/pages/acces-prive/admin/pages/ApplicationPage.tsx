import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { AppRelease } from "@/pages/acces-prive/types";
import { formatDateTime } from "@/pages/acces-prive/admin/utils";
import { logAdminAction } from "@/pages/acces-prive/admin/logger";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import ConfirmDialog from "@/pages/acces-prive/admin/components/ConfirmDialog";
import { AdminInput, AdminTextarea, FieldLabel } from "@/pages/acces-prive/admin/components/inputs";

const BUCKET = "downloads";
const MAX_APK_BYTES = 300 * 1024 * 1024;
const ICON_BTN =
  "flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors cursor-pointer";

const FUNCTIONS_BASE = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL as string}/functions/v1/app-release`;

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["o", "Ko", "Mo", "Go"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

const EMPTY_FORM = {
  version_name: "",
  version_code: "",
  changelog: "",
  external_url: "",
  is_mandatory: false,
  min_version_code: "0",
};

export default function ApplicationPage() {
  const [releases, setReleases] = useState<AppRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_FORM, is_published: true });
  const [file, setFile] = useState<File | null>(null);
  const [formMsg, setFormMsg] = useState("");
  const [formErr, setFormErr] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppRelease | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: loadError } = await supabase
        .from("app_releases")
        .select("*")
        .order("version_code", { ascending: false });
      if (loadError) throw loadError;
      setReleases((data as AppRelease[]) ?? []);
    } catch {
      setError("Impossible de charger les versions. Vérifie ta connexion puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const published = releases.filter((r) => r.is_published);
    const latest = published[0] ?? releases[0] ?? null;
    return {
      total: releases.length,
      published: published.length,
      latest,
    };
  }, [releases]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormErr("");
    const selected = event.target.files?.[0] ?? null;
    if (selected && !selected.name.toLowerCase().endsWith(".apk")) {
      setFormErr("Le fichier doit être un paquet Android (.apk).");
      setFile(null);
      return;
    }
    if (selected && selected.size > MAX_APK_BYTES) {
      setFormErr("Le fichier dépasse la limite de 300 Mo.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMsg("");
    setFormErr("");

    const versionName = form.version_name.trim();
    const versionCode = Number(form.version_code);
    const minVersionCode = Number(form.min_version_code || "0");
    const externalUrl = form.external_url.trim();

    if (!versionName) {
      setFormErr("Indique un nom de version (ex. 2.1.0).");
      return;
    }
    if (!Number.isInteger(versionCode) || versionCode < 1) {
      setFormErr("Le code de version doit être un nombre entier positif (ex. 210).");
      return;
    }
    if (!Number.isInteger(minVersionCode) || minVersionCode < 0) {
      setFormErr("La version minimale doit être un entier positif ou zéro.");
      return;
    }
    if (!file && !externalUrl) {
      setFormErr("Ajoute un fichier .apk ou renseigne un lien de téléchargement.");
      return;
    }
    if (releases.some((r) => r.version_code === versionCode)) {
      setFormErr("Ce code de version existe déjà. Utilise un numéro plus élevé.");
      return;
    }

    setBusy(true);
    try {
      let filePath: string | null = null;
      let fileName: string | null = null;
      let fileSize: number | null = null;

      if (file) {
        const safeName = `dgm-tunnel-${versionCode}.apk`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(safeName, file, {
          upsert: true,
          contentType: "application/vnd.android.package-archive",
        });
        if (uploadError) throw uploadError;
        filePath = safeName;
        fileName = file.name;
        fileSize = file.size;
      }

      const { error: insertError } = await supabase.from("app_releases").insert({
        version_name: versionName,
        version_code: versionCode,
        changelog: form.changelog.trim() || null,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        external_url: externalUrl || null,
        is_published: form.is_published,
        is_mandatory: form.is_mandatory,
        min_version_code: minVersionCode,
      });
      if (insertError) throw insertError;

      await logAdminAction(`Version ${versionName} (code ${versionCode}) enregistrée.`);

      setForm({ ...EMPTY_FORM, is_published: true });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormMsg(`Version ${versionName} enregistrée avec succès.`);
      await loadData();
    } catch {
      setFormErr("L'enregistrement a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const patchRelease = async (release: AppRelease, patch: Partial<AppRelease>, message: string) => {
    setBusy(true);
    try {
      const { error: updateError } = await supabase.from("app_releases").update(patch).eq("id", release.id);
      if (updateError) throw updateError;
      await logAdminAction(message);
      await loadData();
    } catch {
      setError("L'opération a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      if (deleteTarget.file_path) {
        await supabase.storage.from(BUCKET).remove([deleteTarget.file_path]);
      }
      const { error: deleteError } = await supabase.from("app_releases").delete().eq("id", deleteTarget.id);
      if (deleteError) throw deleteError;
      await logAdminAction(`Version ${deleteTarget.version_name} supprimée.`);
      setDeleteTarget(null);
      await loadData();
    } catch {
      setError("La suppression a échoué. Réessaie.");
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  };

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(FUNCTIONS_BASE);
      setCopiedId(-1);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError("La copie a échoué. Copie le lien manuellement.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">Chargement des versions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">Application</h2>
          <p className="mt-1 text-sm text-[#8b8b9e]">
            Gère le paquet Android (.apk) : versions, publication et mise à jour forcée.
          </p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#232334] bg-[#12121b] p-4 md:p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">Version publiée</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#e8e8f0]">
            {stats.latest ? stats.latest.version_name : "—"}
          </p>
          <p className="mt-1 text-[11px] text-[#5a5a6e]">
            {stats.latest ? `Code ${stats.latest.version_code}` : "Aucune version"}
          </p>
        </div>
        <div className="rounded-xl border border-[#232334] bg-[#12121b] p-4 md:p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">Versions publiées</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#e8e8f0]">{stats.published}</p>
          <p className="mt-1 text-[11px] text-[#5a5a6e]">Visibles par les utilisateurs</p>
        </div>
        <div className="rounded-xl border border-[#232334] bg-[#12121b] p-4 md:p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">Total des versions</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#e8e8f0]">{stats.total}</p>
          <p className="mt-1 text-[11px] text-[#5a5a6e]">Brouillons inclus</p>
        </div>
      </div>

      <Panel title="Publier une nouvelle version" icon="ri-upload-cloud-2-line">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <FieldLabel hint="ex. 2.1.0">Nom de version</FieldLabel>
              <AdminInput
                value={form.version_name}
                maxLength={40}
                onChange={(e) => setForm((f) => ({ ...f, version_name: e.target.value }))}
                placeholder="2.1.0"
              />
            </label>
            <label className="block">
              <FieldLabel hint="entier, ex. 210">Code de version</FieldLabel>
              <AdminInput
                type="number"
                min={1}
                value={form.version_code}
                onChange={(e) => setForm((f) => ({ ...f, version_code: e.target.value }))}
                placeholder="210"
              />
            </label>
            <label className="block">
              <FieldLabel hint="force la mise à jour en dessous">Version minimale</FieldLabel>
              <AdminInput
                type="number"
                min={0}
                value={form.min_version_code}
                onChange={(e) => setForm((f) => ({ ...f, min_version_code: e.target.value }))}
                placeholder="0"
              />
            </label>
          </div>

          <label className="block">
            <FieldLabel hint="optionnel">Notes de version</FieldLabel>
            <AdminTextarea
              rows={3}
              maxLength={1000}
              value={form.changelog}
              onChange={(e) => setForm((f) => ({ ...f, changelog: e.target.value }))}
              placeholder="Nouveautés, corrections, améliorations..."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="block">
              <FieldLabel hint="300 Mo max">Fichier .apk</FieldLabel>
              <div className="flex items-center gap-2 rounded-lg border border-[#232334] bg-[#0d0d14] px-3 py-2.5">
                <i className="ri-android-line text-base text-[#5a5a6e]" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  onChange={handleFileChange}
                  className="w-full text-xs text-[#8b8b9e] file:mr-3 file:whitespace-nowrap file:rounded-md file:border-0 file:bg-[#00f0ff]/15 file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:uppercase file:tracking-wider file:text-[#00f0ff] cursor-pointer"
                />
              </div>
              {file ? (
                <p className="mt-1.5 font-mono text-[11px] text-[#34d399]">
                  {file.name} · {formatBytes(file.size)}
                </p>
              ) : null}
            </div>
            <label className="block">
              <FieldLabel hint="si l'APK est hébergé ailleurs">Ou lien externe</FieldLabel>
              <AdminInput
                value={form.external_url}
                onChange={(e) => setForm((f) => ({ ...f, external_url: e.target.value }))}
                placeholder="https://.../dgm-tunnel.apk"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                className="h-4 w-4 accent-[#00f0ff]"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">Publier tout de suite</span>
            </label>
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.is_mandatory}
                onChange={(e) => setForm((f) => ({ ...f, is_mandatory: e.target.checked }))}
                className="h-4 w-4 accent-[#f5b544]"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">Mise à jour forcée</span>
            </label>
          </div>

          {formErr ? (
            <div className="flex items-start gap-2 rounded-md border border-[#ff5470]/40 bg-[#ff5470]/10 px-3 py-2.5">
              <i className="ri-error-warning-line mt-0.5 text-base text-[#ff5470]" />
              <p className="text-xs text-[#ff5470]">{formErr}</p>
            </div>
          ) : null}
          {formMsg ? (
            <div className="flex items-start gap-2 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-3 py-2.5">
              <i className="ri-check-line mt-0.5 text-base text-[#34d399]" />
              <p className="text-xs text-[#34d399]">{formMsg}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#00f0ff] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0a0a0f] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 sm:w-auto cursor-pointer"
          >
            {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-upload-cloud-2-line text-base" />}
            Enregistrer la version
          </button>
        </form>
      </Panel>

      <Panel
        title={`Historique des versions (${releases.length})`}
        icon="ri-git-branch-line"
        action={
          <button
            type="button"
            onClick={copyEndpoint}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-[#232334] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
          >
            <i className={copiedId === -1 ? "ri-check-line text-sm" : "ri-link text-sm"} />
            Point de contrôle
          </button>
        }
      >
        {releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <i className="ri-android-line text-2xl text-[#3a3a52]" />
            <p className="mt-2 text-sm text-[#8b8b9e]">Aucune version pour l'instant. Publie ta première version.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#232334]">
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Version</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Statut</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Fichier</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Min.</th>
                  <th className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Date</th>
                  <th className="px-2 py-2 text-right font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {releases.map((release) => (
                  <tr key={release.id} className="adm-row border-b border-[#1b1b28] last:border-0">
                    <td className="px-2 py-2.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-[#e8e8f0]">{release.version_name}</span>
                        <span className="font-mono text-[10px] text-[#5a5a6e]">code {release.version_code}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            release.is_published
                              ? "border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]"
                              : "border-[#232334] bg-white/5 text-[#8b8b9e]"
                          }`}
                        >
                          {release.is_published ? "Publiée" : "Brouillon"}
                        </span>
                        {release.is_mandatory ? (
                          <span className="inline-flex whitespace-nowrap rounded-md border border-[#f5b544]/40 bg-[#f5b544]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#f5b544]">
                            Forcée
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                      {release.file_path || release.external_url ? (
                        <span className="text-[#c7c7d6]">{formatBytes(release.file_size)}</span>
                      ) : (
                        <span className="text-[#5a5a6e]">Aucun</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                      {release.min_version_code}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 font-mono text-xs text-[#8b8b9e]">
                      {formatDateTime(release.created_at)}
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            patchRelease(
                              release,
                              { is_published: !release.is_published },
                              release.is_published
                                ? `Version ${release.version_name} dépubliée.`
                                : `Version ${release.version_name} publiée.`
                            )
                          }
                          title={release.is_published ? "Dépublier" : "Publier"}
                          className={`${ICON_BTN} hover:border-[#00f0ff]/50 hover:text-[#00f0ff]`}
                        >
                          <i className={release.is_published ? "ri-eye-off-line text-base" : "ri-eye-line text-base"} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            patchRelease(
                              release,
                              { is_mandatory: !release.is_mandatory },
                              release.is_mandatory
                                ? `Mise à jour forcée désactivée (${release.version_name}).`
                                : `Mise à jour forcée activée (${release.version_name}).`
                            )
                          }
                          title={release.is_mandatory ? "Désactiver la mise à jour forcée" : "Activer la mise à jour forcée"}
                          className={`${ICON_BTN} hover:border-[#f5b544]/50 hover:text-[#f5b544]`}
                        >
                          <i className="ri-flashlight-line text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(release)}
                          title="Supprimer"
                          className={`${ICON_BTN} hover:border-[#ff5470]/50 hover:text-[#ff5470]`}
                        >
                          <i className="ri-delete-bin-6-line text-base" />
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

      <Panel title="Point de contrôle des mises à jour" icon="ri-information-line">
        <p className="text-sm leading-relaxed text-[#8b8b9e]">
          L'application Android vérifie les mises à jour via ce point de contrôle. Il renvoie toujours la dernière
          version publiée, son lien de téléchargement et si la mise à jour est obligatoire.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#232334] bg-[#0d0d14] px-3 py-2.5">
          <i className="ri-links-line text-base text-[#00f0ff]" />
          <code className="truncate font-mono text-[11px] text-[#c7c7d6]">{FUNCTIONS_BASE}</code>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">
          Astuce : ajoute ?current=&lt;code&gt; pour savoir si une mise à jour est disponible.
        </p>
      </Panel>

      {deleteTarget ? (
        <ConfirmDialog
          title="Supprimer la version"
          message={`La version « ${deleteTarget.version_name} » et son fichier seront définitivement supprimés.`}
          busy={busy}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  );
}