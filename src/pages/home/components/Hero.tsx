import { Link } from "react-router-dom";
import { heroTypingPhrases, heroTagline, heroBackground, stats, brandMeaning, brandMotto } from "@/mocks/siteData";
import { useTypewriter } from "@/hooks/useTypewriter";
import Counter from "@/components/base/Counter";
import MatrixRain from "./MatrixRain";

export default function Hero() {
  const typed = useTypewriter(heroTypingPhrases);

  return (
    <section
      id="accueil"
      className="relative flex min-h-screen w-full items-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-background-50" />
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="Ambiance cyber de DGM — Dieu Génie du Mal"
          title="DGM Dieu Génie du Mal (Celui Qui Demeure) développeur et formateur"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="absolute inset-0 bg-background-50/80" />
      <div className="cyber-grid absolute inset-0 opacity-40" />
      <MatrixRain />
      <div className="absolute inset-0 bg-gradient-to-b from-background-50/60 via-background-50/75 to-background-50" />

      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary-500/20 blur-[120px]" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent-500/20 blur-[130px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-28 md:px-8 lg:grid-cols-12 lg:gap-8 lg:py-32">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-primary-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
            </span>
            Disponible pour missions &amp; formations
          </span>

          <h1 className="mt-7 font-heading font-extrabold leading-[0.95] tracking-tight">
            <span className="title-neon block text-6xl text-foreground-950 sm:text-7xl lg:text-9xl">
              DGM
            </span>
            <span className="mt-3 block text-base tracking-[0.28em] text-primary-400 sm:text-lg lg:text-xl">
              {brandMeaning}
            </span>
            <span className="mt-2 block text-xs uppercase tracking-[0.35em] text-foreground-500 sm:text-sm">
              {brandMotto}
            </span>
          </h1>

          <div className="mt-7 flex min-h-[2.75rem] items-center font-mono text-lg text-foreground-800 md:text-2xl">
            <span className="mr-2 text-primary-500">&gt;</span>
            <span>{typed}</span>
            <span className="cursor-blink ml-1 inline-block h-6 w-3 bg-primary-500 md:h-7" />
          </div>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground-600 md:text-base">
            {heroTagline}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/formations"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-all duration-300 hover:bg-primary-600 hover:shadow-[0_0_30px_-4px_oklch(var(--primary-500)/0.7)] cursor-pointer"
            >
              <i className="ri-graduation-cap-line text-lg" />
              Découvrir les formations
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-accent-500/50 bg-accent-500/10 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-accent-400 transition-all duration-300 hover:bg-accent-500 hover:text-background-50 cursor-pointer"
            >
              <i className="ri-chat-3-line text-lg" />
              Me contacter
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-background-200/60 pt-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-2xl font-bold text-primary-400 md:text-3xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs text-foreground-600 md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md">
            <div className="float-slow relative rounded-lg border border-background-200/80 bg-background-100/80 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-background-200/70 pb-3">
                <span className="h-3 w-3 rounded-full bg-secondary-500/70" />
                <span className="h-3 w-3 rounded-full bg-primary-500/70" />
                <span className="h-3 w-3 rounded-full bg-accent-500/70" />
                <span className="ml-2 font-mono text-xs text-foreground-600">
                  dgm@celui-qui-demeure: ~
                </span>
              </div>
              <div className="mt-4 space-y-2 font-mono text-xs leading-relaxed md:text-sm">
                <p className="text-foreground-600">
                  <span className="text-accent-400">$</span> whoami
                </p>
                <p className="text-primary-400">développeur &amp; formateur cybersécurité</p>
                <p className="text-foreground-600">
                  <span className="text-accent-400">$</span> ls competences/
                </p>
                <p className="text-foreground-800">
                  web &nbsp; apps &nbsp; bots &nbsp; panels &nbsp; pentest
                </p>
                <p className="text-foreground-600">
                  <span className="text-accent-400">$</span> cat mission.txt
                </p>
                <p className="text-foreground-800">
                  Construire, sécuriser, transmettre le savoir.
                </p>
                <p className="text-foreground-600">
                  <span className="text-accent-400">$</span> status
                  <span className="cursor-blink ml-1 inline-block h-4 w-2 bg-primary-500 align-middle" />
                </p>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 rounded-md border border-accent-500/50 bg-background-50/90 px-3 py-1.5 font-mono text-xs text-accent-400 backdrop-blur-sm">
              &lt;/&gt; secure
            </div>
          </div>
        </div>
      </div>

      <a
        href="#decouvrir"
        aria-label="Défiler vers le bas"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground-500 transition-colors hover:text-primary-400 md:flex cursor-pointer"
      >
        Défiler
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-background-300 p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-primary-500" />
        </span>
      </a>
    </section>
  );
}