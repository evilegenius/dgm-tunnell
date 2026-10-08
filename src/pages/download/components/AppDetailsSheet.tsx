import { useEffect } from "react";
import type { AppReleaseInfo } from "@/hooks/useAppRelease";

interface AppDetailsSheetProps {
  onClose: () => void;
  release: AppReleaseInfo | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export default function AppDetailsSheet({ onClose, release }: AppDetailsSheetProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Version", value: release?.versionName ?? "—" },
    { label: "OS requis", value: "Android, iOS ou navigateur récent" },
    { label: "Proposé par", value: "DGM — Celui qui demeure" },
    { label: "Date de sortie", value: formatDate(release?.publishedAt ?? null) },
    { label: "Type", value: "Application d'accès sécurisé" },
    { label: "Format", value: release?.downloadUrl ? "APK Android / PWA" : "PWA installable (sans store)" },
    { label: "Identifiant", value: "app.dgm.tunnel" },
    { label: "Autorisations", value: "Réseau uniquement" },
  ];
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Détails de l'application"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[#232334] bg-[#12121b] p-5 md:p-6 sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#2f2f44] sm:hidden" />

        <div className="flex items-center gap-3">
          <img
            src="https://readdy.ai/api/search-image?query=app%20icon%20with%20bold%20glowing%20neon%20letters%20DGM%20in%20cyan%20and%20violet%20on%20pure%20black%20background%2C%20centered%2C%20minimal%2C%20high%20contrast%2C%20clean%20sharp%20edges%2C%20square%20format%2C%20dark%20cyber%20tech%20aesthetic&width=192&height=192&seq=dgm-pwa-icon-192&orientation=squarish"
            alt="DGM TUNNEL — icône"
            title="DGM TUNNEL"
            className="h-12 w-12 rounded-xl border border-[#232334] object-cover"
          />
          <div className="flex-1">
            <h3 className="font-heading text-base font-bold text-[#e8e8f0]">DGM TUNNEL</h3>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">Détails</p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="mt-5 divide-y divide-[#232334] rounded-xl border border-[#232334] bg-[#0d0d14]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">{row.label}</span>
              <span className="text-right text-sm text-[#e8e8f0]">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[#232334] bg-[#0d0d14] p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#a78bfa]">Compatibilité</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <span className="text-sm text-[#8b8b9e]">Appareils</span>
            <span className="text-right text-sm text-[#e8e8f0]">Téléphone, tablette, ordinateur</span>
          </div>
          <div className="mt-2 flex items-start justify-between gap-4">
            <span className="text-sm text-[#8b8b9e]">Architecture</span>
            <span className="text-right text-sm text-[#e8e8f0]">Navigateur web moderne</span>
          </div>
        </div>
      </div>
    </div>
  );
}