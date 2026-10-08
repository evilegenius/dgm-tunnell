import { useState } from "react";

interface Screenshot {
  src: string;
  alt: string;
  caption: string;
}

const SCREENSHOTS: Screenshot[] = [
  {
    src: "https://readdy.ai/api/search-image?query=dark%20mobile%20app%20login%20screen%20mockup%20with%20a%20token%20input%20field%20and%20glowing%20cyan%20connect%20button%2C%20violet%20accent%2C%20black%20background%2C%20neon%20cyber%20ui%2C%20clean%20vertical%20phone%20layout&width=540&height=1130&seq=dgm-store-screen-1&orientation=portrait",
    alt: "Écran de connexion par jeton de DGM TUNNEL",
    caption: "Connexion par jeton",
  },
  {
    src: "https://readdy.ai/api/search-image?query=dark%20mobile%20app%20dashboard%20mockup%20with%20three%20neon%20stat%20tiles%20and%20a%20glowing%20update%20button%2C%20cyan%20and%20violet%20accents%2C%20black%20background%2C%20futuristic%20vpn%20control%20panel%2C%20phone%20layout&width=540&height=1130&seq=dgm-store-screen-2&orientation=portrait",
    alt: "Tableau de bord de DGM TUNNEL avec jours restants et pays",
    caption: "Tableau de bord",
  },
  {
    src: "https://readdy.ai/api/search-image?query=dark%20mobile%20app%20country%20list%20mockup%20with%20flag%20icons%20and%20neon%20type%20filter%20chips%2C%20cyan%20violet%20accents%2C%20black%20background%2C%20secure%20tunnel%20servers%20list%2C%20phone%20layout&width=540&height=1130&seq=dgm-store-screen-3&orientation=portrait",
    alt: "Liste des pays et filtres par type dans DGM TUNNEL",
    caption: "Pays & configs",
  },
  {
    src: "https://readdy.ai/api/search-image?query=dark%20mobile%20app%20configuration%20card%20mockup%20with%20copy%20to%20clipboard%20button%2C%20glowing%20neon%20border%2C%20cyan%20and%20violet%20accents%2C%20black%20background%2C%20secure%20connection%20detail%20view%2C%20phone%20layout&width=540&height=1130&seq=dgm-store-screen-4&orientation=portrait",
    alt: "Carte de configuration avec bouton copier dans DGM TUNNEL",
    caption: "Copier la config",
  },
];

export default function ScreenshotsRail() {
  const [zoom, setZoom] = useState<Screenshot | null>(null);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#e8e8f0] md:text-lg">
          Captures d'écran
        </h2>
        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">
          <i className="ri-zoom-in-line" />
          Touche pour agrandir
        </span>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
        {SCREENSHOTS.map((shot) => (
          <figure key={shot.src} className="w-40 shrink-0 snap-start md:w-52">
            <button
              type="button"
              onClick={() => setZoom(shot)}
              aria-label={`Agrandir : ${shot.caption}`}
              className="block h-72 w-full overflow-hidden rounded-2xl border border-[#232334] bg-[#0d0d14] transition-colors hover:border-[#00f0ff]/50 md:h-[420px] cursor-pointer"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                title={`DGM TUNNEL — ${shot.caption}`}
                className="h-full w-full object-cover object-top"
              />
            </button>
            <figcaption className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {zoom ? (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={zoom.caption}
          onClick={() => setZoom(null)}
        >
          <div className="relative max-h-[88dvh]" onClick={(event) => event.stopPropagation()}>
            <img
              src={zoom.src}
              alt={zoom.alt}
              title={`DGM TUNNEL — ${zoom.caption}`}
              className="max-h-[82dvh] w-auto rounded-2xl border border-[#232334] object-contain"
            />
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">
              {zoom.caption}
            </p>
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setZoom(null)}
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#232334] bg-[#0d0d14] text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] cursor-pointer"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}