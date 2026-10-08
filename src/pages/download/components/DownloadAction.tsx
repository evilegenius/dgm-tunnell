import InstallAppButton from "@/components/feature/InstallAppButton";

interface DownloadActionProps {
  downloadUrl: string | null;
  size?: "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

/**
 * Bouton principal de la fiche : télécharge le vrai paquet Android (.apk) quand
 * une version est publiée, sinon propose l'installation de l'application web (PWA).
 */
export default function DownloadAction({
  downloadUrl,
  size = "lg",
  fullWidth = false,
  className = "",
}: DownloadActionProps) {
  const dims = size === "lg" ? "px-6 py-3.5 text-sm" : "px-5 py-3 text-xs";
  const shape = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${dims} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (downloadUrl) {
    return (
      <a href={downloadUrl} download className={`${shape} bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#33f3ff]`}>
        <i className="ri-android-line text-base" />
        Télécharger l'application
      </a>
    );
  }

  return <InstallAppButton size={size} fullWidth={fullWidth} label="Installer l'application" className={className} />;
}