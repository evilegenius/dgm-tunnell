import { Link } from "react-router-dom";
import { services } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";

export default function ServicesGrid() {
  return (
    <section className="relative w-full bg-background-100 py-16 md:py-24">
      <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-accent-500/12 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 70}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-background-200/80 bg-background-50 p-6 transition-all duration-300 hover:border-accent-500/60 hover:-translate-y-1 hover:shadow-[0_0_40px_-14px_oklch(var(--accent-500)/0.7)]">
                <span className="absolute right-5 top-5 font-mono text-3xl font-bold text-background-300/50 transition-colors duration-300 group-hover:text-accent-500/25">
                  0{index + 1}
                </span>

                <span className="relative flex h-12 w-12 items-center justify-center rounded-md border border-primary-500/40 bg-primary-500/12 text-primary-400 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-background-50 group-hover:shadow-[0_0_22px_-4px_oklch(var(--primary-500)/0.9)]">
                  <i className={`${service.icon} text-2xl`} />
                </span>

                <h3 className="mt-5 font-heading text-base font-bold text-foreground-950 md:text-lg">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground-600">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-xs text-foreground-700">
                      <i className="ri-checkbox-circle-line text-accent-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-background-200/70 pt-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">
                      À partir de
                    </p>
                    <p className="font-heading text-lg font-bold text-primary-400">{service.price}</p>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-primary-500/50 bg-primary-500/10 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary-400 transition-all duration-300 hover:bg-primary-500 hover:text-background-50 cursor-pointer"
                  >
                    Demander un devis
                    <i className="ri-arrow-right-line text-sm" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="relative mt-14 overflow-hidden rounded-lg border border-primary-500/30 bg-gradient-to-r from-primary-500/12 via-background-50 to-accent-500/12 p-7 md:p-10">
            <div className="cyber-grid absolute inset-0 opacity-20" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent-400">
                  Passe à l'action
                </span>
                <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-3xl">
                  Un projet en tête ? Parlons-en.
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground-600 md:text-base">
                  Décris-moi ton idée en quelques lignes. Je te réponds avec une estimation claire et
                  un délai réaliste — sans engagement.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-all duration-300 hover:bg-primary-600 hover:shadow-[0_0_30px_-4px_oklch(var(--primary-500)/0.8)] cursor-pointer"
              >
                <i className="ri-send-plane-line text-lg" />
                Demander un devis
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}