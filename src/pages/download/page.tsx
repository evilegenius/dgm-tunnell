import { useEffect } from "react";
import { Link } from "react-router-dom";
import StoreTopBar from "@/pages/download/components/StoreTopBar";
import AppHero from "@/pages/download/components/AppHero";
import ScreenshotsRail from "@/pages/download/components/ScreenshotsRail";
import AboutSection from "@/pages/download/components/AboutSection";
import SafetySection from "@/pages/download/components/SafetySection";
import ReviewsSection from "@/pages/download/components/ReviewsSection";
import DownloadAction from "@/pages/download/components/DownloadAction";
import { useAppRelease } from "@/hooks/useAppRelease";

export default function DownloadPage() {
  const { release } = useAppRelease();
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "DGM TUNNEL — Télécharger l'application";

    const meta = document.querySelector('meta[name="theme-color"]');
    const previousColor = meta ? meta.getAttribute("content") : null;
    if (meta) meta.setAttribute("content", "#0a0a0f");

    return () => {
      document.title = previousTitle;
      if (meta && previousColor) meta.setAttribute("content", previousColor);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0f] text-[#e8e8f0]">
      <div className="pointer-events-none fixed inset-0 cyber-grid opacity-40" aria-hidden="true" />

      <div className="relative z-10">
        <StoreTopBar />

        <main className="mx-auto w-full max-w-3xl px-4 pb-32 pt-20 md:px-6 md:pb-28">
          <AppHero release={release} />
          <ScreenshotsRail />
          <AboutSection release={release} />
          <SafetySection />
          <ReviewsSection />

          <footer className="mt-12 border-t border-[#232334] pt-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#3a3a52]">
              DGM TUNNEL — Celui qui demeure · Application sécurisée
            </p>
            <Link
              to="/"
              className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e] transition-colors hover:text-[#00f0ff] cursor-pointer"
            >
              Retour au site DGM
            </Link>
          </footer>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#232334]/80 bg-[#0a0a0f]/90 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-6">
            <div className="hidden flex-1 sm:block">
              <p className="font-heading text-sm font-bold text-[#e8e8f0]">DGM TUNNEL</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">
                Installation gratuite · sans store
              </p>
            </div>
            <div className="flex-1 sm:flex-none">
              <DownloadAction downloadUrl={release?.downloadUrl ?? null} size="lg" fullWidth />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}