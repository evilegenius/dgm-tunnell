import { Link } from "react-router-dom";
import Reveal from "@/components/base/Reveal";

export default function SitesCta() {
  return (
    <section className="relative w-full overflow-hidden bg-background-50 py-16 md:py-24">
      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-foreground-950 px-6 py-14 text-center md:px-10 md:py-20">
            <div className="cyber-grid absolute inset-0 opacity-30" />
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-500/25 blur-[120px]" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent-500/25 blur-[120px]" />

            <div className="relative">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-500/40 bg-primary-500/15 text-primary-300">
                <i className="ri-rocket-2-line text-3xl" />
              </span>
              <h2 className="mt-7 font-heading text-2xl font-black leading-tight text-background-50 md:text-4xl">
                L'écosystème s'agrandit
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-background-50/70 md:text-base">
                De nouvelles plateformes arrivent bientôt. Reste connecté pour découvrir les
                prochaines nouveautés digitales — ou lance ton propre projet dès maintenant.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#demande-site"
                  className="inline-flex items-center gap-3 whitespace-nowrap rounded-2xl bg-background-50 px-8 py-4 font-heading text-base font-black text-foreground-950 transition-all duration-300 hover:bg-primary-100 cursor-pointer"
                >
                  <i className="ri-rocket-2-line text-xl text-primary-500" />
                  Démarrer mon projet
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border border-background-50/25 px-8 py-4 font-heading text-base font-bold text-background-50 transition-all duration-300 hover:bg-background-50/10 cursor-pointer"
                >
                  <i className="ri-chat-3-line text-xl" />
                  Me contacter
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}