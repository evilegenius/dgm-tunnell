import { legalSections } from "@/mocks/siteData";

export default function Legal() {
  return (
    <>
      <section className="relative w-full overflow-hidden border-b border-background-200/60 bg-background-100 pt-28 pb-14 md:pt-36 md:pb-20">
        <div className="cyber-grid absolute inset-0 opacity-25" />
        <div className="absolute left-1/2 top-1/2 h-56 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/12 blur-[120px]" />
        <div className="relative mx-auto w-full max-w-4xl px-4 text-center md:px-8">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
            <span className="h-px w-6 bg-primary-500" />
            Informations légales
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground-950 md:text-5xl">
            Mentions légales &amp; Conditions d'utilisation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground-600 md:text-base">
            Transparence totale sur l'édition du site, l'utilisation des données et les règles
            d'usage des formations.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-14 md:px-8 md:py-20">
        <div className="rounded-lg border border-secondary-500/30 bg-secondary-500/8 p-6">
          <div className="flex items-center gap-2 text-secondary-400">
            <i className="ri-shield-check-line text-xl" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Usage strictement légal &amp; éthique
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground-700">
            Les formations liées à la sécurité (hacking éthique, cybersécurité, tests d'intrusion)
            sont destinées <strong>exclusivement à un usage légal, éthique et autorisé</strong>. Toute
            technique doit être appliquée uniquement sur des systèmes dont tu es propriétaire ou pour
            lesquels tu disposes d'une autorisation écrite.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {legalSections.map((section, index) => (
            <article key={section.title}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500/12 font-mono text-xs font-bold text-primary-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
                  {section.title}
                </h2>
              </div>
              <div className="mt-4 space-y-3 pl-0 md:pl-11">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-foreground-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 font-mono text-xs text-foreground-500">
          Dernière mise à jour : octobre 2026
        </p>
      </section>
    </>
  );
}