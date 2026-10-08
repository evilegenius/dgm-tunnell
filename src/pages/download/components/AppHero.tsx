import { Link } from "react-router-dom";
import type { AppReleaseInfo } from "@/hooks/useAppRelease";
import DownloadAction from "@/pages/download/components/DownloadAction";

const BANNER =
  "https://readdy.ai/api/search-image?query=abstract%20dark%20cyber%20tunnel%20made%20of%20glowing%20cyan%20and%20violet%20light%20lines%20and%20network%20nodes%2C%20deep%20black%20background%2C%20futuristic%20secure%20data%20flow%2C%20cinematic%2C%20minimal%2C%20high%20contrast%2C%20wide%20banner&width=1600&height=900&seq=dgm-store-banner-2026&orientation=landscape";
const APP_ICON =
  "https://readdy.ai/api/search-image?query=app%20icon%20with%20bold%20glowing%20neon%20letters%20DGM%20in%20cyan%20and%20violet%20on%20pure%20black%20background%2C%20centered%2C%20minimal%2C%20high%20contrast%2C%20clean%20sharp%20edges%2C%20square%20format%2C%20dark%20cyber%20tech%20aesthetic&width=512&height=512&seq=dgm-pwa-icon-512&orientation=squarish";

interface AppHeroProps {
  release: AppReleaseInfo | null;
}

export default function AppHero({ release }: AppHeroProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#232334] bg-[#12121b]">
      <div className="relative h-44 w-full overflow-hidden md:h-60">
        <img
          src={BANNER}
          alt="DGM TUNNEL — bannière"
          title="DGM TUNNEL — application d'accès sécurisé"
          className="h-44 w-full object-cover object-top md:h-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121b] via-[#12121b]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 md:px-6">
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-wider text-[#e8e8f0] md:text-3xl">
            DGM <span className="text-[#00f0ff] title-neon">TUNNEL</span>
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#a78bfa]">
              DGM — Celui qui demeure
            </span>
            <i className="ri-verified-badge-fill text-base text-[#00f0ff]" />
          </div>
        </div>
      </div>

      <div className="px-4 pb-5 md:px-6 md:pb-6">
        <div className="-mt-8 flex items-end gap-4 md:-mt-10">
          <img
            src={APP_ICON}
            alt="DGM TUNNEL — icône de l'application"
            title="DGM TUNNEL — icône"
            className="h-20 w-20 shrink-0 rounded-2xl border border-[#232334] bg-[#0a0a0f] object-cover md:h-24 md:w-24"
          />
          <div className="pb-1">
            <h1 className="font-heading text-xl font-extrabold uppercase tracking-wider text-[#e8e8f0] md:text-2xl">
              DGM <span className="text-[#00f0ff] title-neon">TUNNEL</span>
            </h1>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8b8b9e]">
              Celui qui demeure
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-[#232334] rounded-xl border border-[#232334] bg-[#0d0d14]">
          <div className="px-3 py-3 text-center">
            <p className="flex items-center justify-center gap-1 font-heading text-base font-bold text-[#e8e8f0]">
              4,9 <i className="ri-star-fill text-sm text-[#f5b544]" />
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">Avis</p>
          </div>
          <div className="px-3 py-3 text-center">
            <p className="font-heading text-base font-bold text-[#e8e8f0]">Mobile &amp; PC</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">Compatibilité</p>
          </div>
          <div className="px-3 py-3 text-center">
            <p className="font-heading text-base font-bold text-[#e8e8f0]">PWA</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">Installation</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[#b8b8ca]">
          Accès simple, rapide et sécurisé à tes configurations. Connecte-toi avec ton jeton et retrouve tes pays et
          tes tunnels directement depuis ton téléphone, en plein écran.
        </p>

        {release ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#00f0ff]">
              <i className="ri-checkbox-circle-line text-xs" />
              Version {release.versionName}
            </span>
            {release.downloadUrl ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#232334] bg-[#0d0d14] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">
                <i className="ri-android-line text-xs" />
                APK Android
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <DownloadAction downloadUrl={release?.downloadUrl ?? null} size="lg" fullWidth className="sm:w-auto" />
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#8b5cf6]/50 bg-[#8b5cf6]/10 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-[#a78bfa] transition-colors hover:bg-[#8b5cf6]/20 cursor-pointer"
          >
            <i className="ri-play-circle-line text-base" />
            Utiliser dans le navigateur
          </Link>
        </div>
      </div>
    </section>
  );
}