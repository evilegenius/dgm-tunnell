import { useState } from "react";
import { AdminInput, FieldLabel } from "@/pages/acces-prive/admin/components/inputs";

interface ExtendDaysModalProps {
  tokenCode: string;
  onClose: () => void;
  onConfirm: (days: number) => void;
  busy?: boolean;
}

const PRESETS = [7, 15, 30, 90];

export default function ExtendDaysModal({ tokenCode, onClose, onConfirm, busy = false }: ExtendDaysModalProps) {
  const [days, setDays] = useState("30");
  const [error, setError] = useState("");

  const submit = () => {
    const value = Number(days);
    if (!Number.isInteger(value) || value < 1 || value > 3650) {
      setError("Indique un nombre de jours entre 1 et 3650.");
      return;
    }
    onConfirm(value);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-[#232334] bg-[#12121b] p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-[#f5b544]/40 bg-[#f5b544]/10">
          <i className="ri-timer-flash-line text-lg text-[#f5b544]" />
        </div>
        <h3 className="font-heading text-base font-bold uppercase tracking-wide text-[#e8e8f0]">
          Prolonger le jeton
        </h3>
        <p className="mt-1 font-mono text-[11px] text-[#5a5a6e]">{tokenCode}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setDays(String(preset));
                setError("");
              }}
              className={`whitespace-nowrap rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                days === String(preset)
                  ? "border-[#00f0ff]/60 bg-[#00f0ff]/10 text-[#00f0ff]"
                  : "border-[#232334] text-[#8b8b9e] hover:border-[#3a3a52] hover:text-[#e8e8f0]"
              }`}
            >
              +{preset} j
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <FieldLabel>Nombre de jours à ajouter</FieldLabel>
          <AdminInput
            type="number"
            min={1}
            max={3650}
            value={days}
            onChange={(e) => {
              setDays(e.target.value);
              setError("");
            }}
          />
        </label>

        {error ? <p className="mt-2 text-xs text-[#ff5470]">{error}</p> : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="whitespace-nowrap rounded-md border border-[#232334] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#3a3a52] hover:text-[#e8e8f0] cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#f5b544]/50 bg-[#f5b544]/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#f5b544] transition-colors hover:bg-[#f5b544]/25 disabled:opacity-60 cursor-pointer"
          >
            {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-timer-flash-line" />}
            Prolonger
          </button>
        </div>
      </div>
    </div>
  );
}