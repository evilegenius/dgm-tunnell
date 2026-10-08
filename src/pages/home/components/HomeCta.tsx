import { Link } from "react-router-dom";
import Reveal from "@/components/base/Reveal";

export default function HomeCta() {
  return (
    <section className="relative w-full overflow-hidden border-t border-background-200/60 bg-background-100 py-16 md:py-20">
      <div className="cyber-grid absolute inset-0 opacity-30" />
      <div className="absolute left-1/2 top-1/2 h-56 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/12 blur-[120px]" />
      <Reveal>
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-8">
          <h2 className="font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-4xl">
            Prêt à maîtriser la technologie ?
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground-600 md:text-base">
            Une formation pour changer de carrière, un site pour lancer ton activité, un bot pour
            automatiser ton quotidien — le premier pas, c'est de m'écrire.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/formations"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-all duration-300 hover:bg-primary-600 cursor-pointer"
            >
              <i className="ri-graduation-cap-line text-lg" />
              Rejoindre une formation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-accent-500/50 bg-accent-500/10 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-accent-400 transition-all duration-300 hover:bg-accent-500 hover:text-background-50 cursor-pointer"
            >
              <i className="ri-chat-3-line text-lg" />
              Me contacter
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}