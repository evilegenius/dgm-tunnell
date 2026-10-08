import { useState } from "react";
import type { AppReleaseInfo } from "@/hooks/useAppRelease";
import AppDetailsSheet from "@/pages/download/components/AppDetailsSheet";

interface AboutSectionProps {
  release: AppReleaseInfo | null;
}

export default function AboutSection({ release }: AboutSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#e8e8f0] md:text-lg">
          À propos de cette application
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Voir les détails de l'application"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#232334] text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
        >
          <i className="ri-arrow-right-line text-lg" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-[#232334] bg-[#12121b] p-5 text-left transition-colors hover:border-[#00f0ff]/40 cursor-pointer"
      >
        <p className="text-sm leading-relaxed text-[#b8b8ca]">
          Application d'accès sécurisé, pensée pour être claire, rapide et directe. Connecte-toi avec ton jeton,
          consulte tes pays et tes configurations, et copie ta config en un geste — sans jamais te perdre dans les
          menus.
        </p>
        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00f0ff]">
          Voir les détails
          <i className="ri-arrow-right-s-line text-base" />
        </span>
      </button>

      {open ? <AppDetailsSheet onClose={() => setOpen(false)} release={release} /> : null}
    </section>
  );
}