import { useMemo, useState } from "react";
import { webSites } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";

const categoryLabels: Record<string, string> = {
  "E-commerce": "E-commerce",
  "Site personnel": "Personnel",
  "Site académique": "Académique",
  "Revue scientifique": "Revue",
  "Site institutionnel": "Institutionnel",
  "Site corporate": "Corporate",
};

const categoryOrder = Object.keys(categoryLabels);

interface SiteTheme {
  border: string;
  glow: string;
  overlay: string;
  btn: string;
  titleHover: string;
}

const accentMap: Record<string, SiteTheme> = {
  primary: {
    border: "hover:border-primary-500/60",
    glow: "hover:shadow-[0_0_45px_-14px_oklch(var(--primary-500)/0.7)]",
    overlay: "from-primary-500/55 via-primary-500/15 to-transparent",
    btn: "bg-primary-500 text-background-50 hover:bg-primary-600",
    titleHover: "group-hover:text-primary-500",
  },
  accent: {
    border: "hover:border-accent-500/60",
    glow: "hover:shadow-[0_0_45px_-14px_oklch(var(--accent-500)/0.7)]",
    overlay: "from-accent-500/55 via-accent-500/15 to-transparent",
    btn: "bg-accent-500 text-background-50 hover:bg-accent-600",
    titleHover: "group-hover:text-accent-500",
  },
  secondary: {
    border: "hover:border-secondary-500/60",
    glow: "hover:shadow-[0_0_45px_-14px_oklch(var(--secondary-500)/0.7)]",
    overlay: "from-secondary-500/55 via-secondary-500/15 to-transparent",
    btn: "bg-secondary-500 text-background-50 hover:bg-secondary-600",
    titleHover: "group-hover:text-secondary-500",
  },
};

export default function SitesGrid() {
  const [filter, setFilter] = useState<string>("tous");

  const filters = useMemo(() => {
    const present = new Set(webSites.map((site) => site.category));
    return [
      { key: "tous", label: "Tous" },
      ...categoryOrder
        .filter((category) => present.has(category))
        .map((category) => ({ key: category, label: categoryLabels[category] })),
    ];
  }, []);

  const countFor = (key: string) =>
    key === "tous"
      ? webSites.length
      : webSites.filter((site) => site.category === key).length;

  const visible = useMemo(
    () => (filter === "tous" ? webSites : webSites.filter((site) => site.category === filter)),
    [filter],
  );

  return (
    <section id="plateformes" className="relative w-full overflow-hidden bg-background-50 py-16 md:py-24">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-500/10 blur-[130px]" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/10 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
              <i className="ri-global-line" />
              Écosystème digital
            </span>
            <h2 className="mt-5 font-heading text-2xl font-black leading-tight text-foreground-950 md:text-4xl">
              Nos plateformes en ligne
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground-600 md:text-base">
              Des sites pensés pour faciliter la vie : boutiques en ligne, sites corporate,
              institutionnels et académiques, conçus, développés et mis en ligne par mes soins.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex flex-col gap-4 border-b border-background-200/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-background-200/80 bg-background-100/70 p-1">
              {filters.map((item) => {
                const active = filter === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilter(item.key)}
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      active
                        ? "bg-primary-500 text-background-50"
                        : "text-foreground-600 hover:text-primary-500"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active
                          ? "bg-background-50/25 text-background-50"
                          : "bg-background-200/80 text-foreground-600"
                      }`}
                    >
                      {countFor(item.key)}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-foreground-500">
              {visible.length} site{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {visible.map((site, index) => {
            const theme = accentMap[site.accent] ?? accentMap.primary;
            return (
              <Reveal key={site.id} delay={index * 60}>
                <article
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-background-200/80 bg-background-100/60 transition-all duration-300 hover:-translate-y-1.5 ${theme.border} ${theme.glow}`}
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={site.image}
                      alt={`${site.name} — ${site.category}`}
                      title={`${site.name} — ${site.category}`}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-foreground-950/70" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.overlay}`} />

                    <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-background-50/30 bg-background-50/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-background-50 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                      {site.status}
                    </span>
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-background-50/25 bg-foreground-950/25 px-3 py-1 font-mono text-[10px] font-semibold text-background-50/90 backdrop-blur-sm">
                      <i className="ri-global-line" />
                      {site.domain}
                    </span>

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-background-50/25 bg-background-50/12 font-heading text-lg font-black text-background-50 backdrop-blur-sm">
                          {site.initials}
                        </span>
                        <div className="text-center sm:text-left">
                          <p className="font-heading text-lg font-black leading-none text-background-50">
                            {site.name}
                          </p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-background-50/70">
                            {site.eyebrow}
                          </p>
                        </div>
                      </div>
                      <div className="grid w-full grid-cols-4 gap-2">
                        {site.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-lg border border-background-50/15 bg-background-50/10 px-1 py-2 text-center backdrop-blur-sm"
                          >
                            <p className="font-heading text-sm font-black leading-none text-background-50">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-[9px] uppercase tracking-wide text-background-50/70">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-center gap-2 border-t border-background-50/15 bg-foreground-950/40 px-4 py-2.5 backdrop-blur-sm">
                      {site.highlights.map((item) => (
                        <span
                          key={item}
                          className="rounded px-2 py-0.5 text-[10px] font-semibold text-background-50/85"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 md:p-7">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-foreground-500">
                      {site.eyebrow}
                    </p>
                    <h3
                      className={`mt-1.5 font-heading text-lg font-black text-foreground-950 transition-colors md:text-xl ${theme.titleHover}`}
                    >
                      {site.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-600">
                      {site.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {site.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-background-200/70 px-3 py-1 text-xs font-semibold text-foreground-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-6 py-3 text-sm font-bold transition-all duration-300 cursor-pointer ${theme.btn}`}
                    >
                      <i className="ri-external-link-line" />
                      Visiter le site
                      <span className="text-[11px] font-normal opacity-70">— {site.domain}</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}