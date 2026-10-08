import { Link } from "react-router-dom";
import { projects } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";

interface ProjectTheme {
  text: string;
  bg: string;
  border: string;
  glow: string;
  badge: string;
  tagBorder: string;
}

const accentMap: Record<string, ProjectTheme> = {
  primary: {
    text: "text-primary-400",
    bg: "bg-primary-500/12",
    border: "hover:border-primary-500/60",
    glow: "hover:shadow-[0_0_45px_-12px_oklch(var(--primary-500)/0.75)]",
    badge: "border border-primary-500/50 bg-primary-500/15 text-primary-300",
    tagBorder: "border-primary-500/40",
  },
  accent: {
    text: "text-accent-400",
    bg: "bg-accent-500/12",
    border: "hover:border-accent-500/60",
    glow: "hover:shadow-[0_0_45px_-12px_oklch(var(--accent-500)/0.75)]",
    badge: "border border-accent-500/50 bg-accent-500/15 text-accent-300",
    tagBorder: "border-accent-500/40",
  },
  secondary: {
    text: "text-secondary-400",
    bg: "bg-secondary-500/12",
    border: "hover:border-secondary-500/60",
    glow: "hover:shadow-[0_0_45px_-12px_oklch(var(--secondary-500)/0.75)]",
    badge: "border border-secondary-500/50 bg-secondary-500/15 text-secondary-300",
    tagBorder: "border-secondary-500/40",
  },
};

export default function ProjectsGrid() {
  return (
    <section className="relative w-full bg-background-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const theme = accentMap[project.accent] ?? accentMap.primary;
            return (
              <Reveal key={project.id} delay={index * 60}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-background-200/80 bg-background-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] ${theme.border} ${theme.glow}`}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={`${project.title} — ${project.category}`}
                      title={`${project.title} — ${project.category}`}
                      className="h-48 w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-100 via-background-100/20 to-transparent" />
                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${theme.badge}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {project.badge}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <span className="font-mono text-xs uppercase tracking-wider text-foreground-500">
                      {project.category}
                    </span>
                    <h3 className="mt-2 font-heading text-base font-bold text-foreground-950 md:text-lg">
                      {project.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-foreground-600">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${theme.bg} ${theme.text} ${theme.tagBorder}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/contact"
                      className={`mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider ${theme.text} cursor-pointer`}
                    >
                      Discuter d'un projet similaire
                      <i className="ri-arrow-right-up-line transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-12 text-center font-mono text-xs uppercase tracking-[0.18em] text-foreground-500 md:text-sm md:tracking-[0.25em]">
            D'autres projets arrivent. Ce que j'enseigne, je le construis moi-même.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-5 rounded-lg border border-accent-500/40 bg-accent-500/10 p-6 text-center md:flex-row md:justify-between md:p-8 md:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-accent-500/50 bg-accent-500/15">
                <i className="ri-smartphone-line text-2xl text-accent-400" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground-950 md:text-lg">
                  DGM TUNNEL — l'application
                </h3>
                <p className="mt-1 max-w-xl text-sm text-foreground-600">
                  Connecte-toi avec ton jeton et accède à tes configurations, directement depuis ton téléphone.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:justify-end">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-600 cursor-pointer"
              >
                <i className="ri-download-2-line text-base" />
                Télécharger l'application
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-accent-500/60 bg-accent-500/10 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-400 transition-colors hover:bg-accent-500/20 cursor-pointer"
              >
                <i className="ri-smartphone-line text-base" />
                Ouvrir l'application
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}