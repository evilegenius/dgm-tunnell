import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { VpnConfig } from "@/pages/acces-prive/types";
import { CONFIG_TYPES } from "@/pages/acces-prive/types";
import { AdminInput, AdminSelect, AdminTextarea, FieldLabel } from "@/pages/acces-prive/admin/components/inputs";
import { logAdminAction } from "@/pages/acces-prive/admin/logger";

interface ConfigEditModalProps {
  config: VpnConfig;
  onClose: () => void;
  onSaved: () => void;
}

export default function ConfigEditModal({ config, onClose, onSaved }: ConfigEditModalProps) {
  const [name, setName] = useState(config.name);
  const [type, setType] = useState(config.type);
  const [content, setContent] = useState(config.content ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(config.name);
    setType(config.type);
    setContent(config.content ?? "");
  }, [config]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Le nom de la configuration est requis.");
      return;
    }
    setBusy(true);
    try {
      const { error: updateError } = await supabase
        .from("configs")
        .update({ name: name.trim(), type, content: content.trim() || null, updated_at: new Date().toISOString() })
        .eq("id", config.id);
      if (updateError) throw updateError;
      await logAdminAction(`Configuration modifiée : ${name.trim()} (${type}).`);
      onSaved();
    } catch {
      setError("La mise à jour a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#232334] bg-[#12121b]">
        <header className="flex items-center justify-between gap-3 border-b border-[#232334] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10">
              <i className="ri-edit-line text-lg text-[#00f0ff]" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold uppercase tracking-wide text-[#e8e8f0]">
                Modifier la configuration
              </h3>
              <p className="font-mono text-[11px] text-[#5a5a6e]">{config.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <label className="block">
            <FieldLabel>Type</FieldLabel>
            <AdminSelect value={type} onChange={(e) => setType(e.target.value)}>
              {CONFIG_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#0d0d14]">
                  {t}
                </option>
              ))}
            </AdminSelect>
          </label>

          <label className="block">
            <FieldLabel>Nom</FieldLabel>
            <AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Paris Premium" />
          </label>

          <label className="block">
            <FieldLabel hint={content.length + " caractères"}>Contenu</FieldLabel>
            <AdminTextarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="vless://..."
              className="font-mono text-xs"
            />
          </label>

          {error ? (
            <div className="flex items-start gap-2 rounded-md border border-[#ff5470]/40 bg-[#ff5470]/10 px-3 py-2.5">
              <i className="ri-error-warning-line mt-0.5 text-base text-[#ff5470]" />
              <p className="text-xs text-[#ff5470]">{error}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="whitespace-nowrap rounded-md border border-[#232334] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#00f0ff] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0a0a0f] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 cursor-pointer"
            >
              {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-3-line" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}