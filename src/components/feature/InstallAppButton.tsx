import { useState } from "react";
import { Link } from "react-router-dom";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import type { InstallPlatform } from "@/hooks/usePwaInstall";

interface InstallAppButtonProps {
  variant?: "primary" | "outline";
  size?: "md" | "lg";
  fullWidth?: boolean;
  label?: string;
  className?: string;
}

const PLATFORM_HINTS: Record<InstallPlatform, { title: string; steps: string[] }> = {
  ios: {
    title: "Installer sur iPhone / iPad",
    steps: [
      "Ouvre cette page dans Safari.",
      "Touche l'icône Partager (le carré avec une flèche vers le haut).",
      "Choisis « Sur l'écran d'accueil ».",
      "Valide avec « Ajouter » : l'icône DGM apparaît sur ton écran.",
    ],
  },
  android: {
    title: "Installer sur Android",
    steps: [
      "Ouvre cette page dans Chrome.",
      "Touche le menu (les trois points en haut à droite).",
      "Choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ».",
      "Valide : l'icône DGM est ajoutée à ton téléphone.",
    ],
  },
  desktop: {
    title: "Installer sur ordinateur",
    steps: [
      "Ouvre cette page dans Chrome, Edge ou Brave.",
      "Clique sur l'icône d'installation dans la barre d'adresse.",
      "Ou ouvre le menu du navigateur puis « Installer DGM TUNNEL ».",
    ],
  },
};

export default function InstallAppButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  label = "Installer l'application",
  className = "",
}: InstallAppButtonProps) {
  const { canInstall, installed, platform, promptInstall } = usePwaInstall();
  const [hintOpen, setHintOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const tone =
    variant === "primary"
      ? "bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#33f3ff]"
      : "border border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20";

  const dims = size === "lg" ? "px-6 py-3.5 text-sm" : "px-5 py-3 text-xs";
  const shape = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${dims} ${tone} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (installed) {
    return (
      <Link to="/app" className={shape}>
        <i className="ri-external-link-line text-base" />
        Ouvrir l'application
      </Link>
    );
  }

  const handleClick = async () => {
    if (!canInstall) {
      setHintOpen(true);
      return;
    }
    setWorking(true);
    const outcome = await promptInstall();
    setWorking(false);
    if (outcome === "unavailable") setHintOpen(true);
  };

  const hint = PLATFORM_HINTS[platform];

  return (
    <>
      <button type="button" onClick={handleClick} disabled={working} className={shape}>
        {working ? (
          <i className="ri-loader-4-line animate-spin text-base" />
        ) : (
          <i className="ri-download-2-line text-base" />
        )}
        {label}
      </button>

      {hintOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={hint.title}
          onClick={() => setHintOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#232334] bg-[#12121b] p-5 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10">
                  <i className="ri-smartphone-line text-xl text-[#00f0ff]" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#e8e8f0]">{hint.title}</h3>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setHintOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#232334] text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] cursor-pointer"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <ol className="mt-4 space-y-3">
              {hint.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/15 font-mono text-[11px] font-bold text-[#a78bfa]">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-[#c3c3d4]">{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-5 rounded-lg border border-[#232334] bg-[#0d0d14] px-3.5 py-3 text-[12px] leading-relaxed text-[#8b8b9e]">
              Une fois installée, DGM TUNNEL s'ouvre en plein écran comme une vraie application, sans barre de
              navigateur.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}