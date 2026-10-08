import { aboutParagraphs, aboutQuote, aboutPortrait, skills, values } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";
import SkillBar from "@/components/base/SkillBar";

export default function AboutContent() {
  return (
    <section className="relative w-full bg-background-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="neon-frame glitch-soft relative overflow-hidden rounded-lg">
                <div className="scanline pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-primary-500/25 to-transparent" />
                <img
                  src={aboutPortrait}
                  alt="DGM, 'Dieu Génie du Mal', développeur et formateur"
                  title="DGM Dieu Génie du Mal (Celui Qui Demeure) développeur et formateur"
                  className="h-[440px] w-full rounded-lg object-cover object-top md:h-[540px]"
                />
              </div>
              <div className="absolute -bottom-5 left-5 right-5 rounded-lg border border-primary-500/30 bg-background-100/95 p-4 backdrop-blur-md md:left-8 md:right-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-500/15 text-primary-400">
                    <i className="ri-terminal-box-line text-2xl" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground-950">
                      8+ ans d'expertise
                    </p>
                    <p className="text-xs text-foreground-600">Code, sécurité &amp; transmission</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="space-y-4">
              {aboutParagraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index * 60}>
                  <p className="text-sm leading-relaxed text-foreground-600 md:text-base">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <blockquote className="relative mt-8 overflow-hidden rounded-lg border border-accent-500/30 bg-accent-500/8 p-6 md:p-8">
                <i className="ri-double-quotes-l absolute -top-2 left-4 text-6xl text-accent-500/15" />
                <p className="relative font-heading text-lg font-bold leading-snug text-foreground-950 md:text-xl">
                  « {aboutQuote.text} »
                </p>
                <footer className="relative mt-3 font-mono text-xs uppercase tracking-widest text-accent-400">
                  {aboutQuote.author}
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="mt-16 grid grid-cols-1 gap-10 rounded-lg border border-background-200/80 bg-background-100/50 p-6 md:p-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
                <span className="h-px w-6 bg-primary-500" />
                Compétences
              </span>
              <h3 className="mt-4 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                Les technologies que je maîtrise
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-600">
                Un socle technique large, affûté par des projets réels et transmis avec méthode.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 lg:col-span-8">
              {skills.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
              <span className="h-px w-6 bg-primary-500" />
              Mes valeurs
            </span>
            <h3 className="mt-4 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
              Ce qui guide chaque projet
            </h3>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 80}>
                <div className="value-card group h-full rounded-lg border border-background-200/80 bg-background-100/60 p-6 hover:border-accent-500/50">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-500/12 text-accent-400 transition-colors duration-300 group-hover:bg-accent-500/20">
                    <i className={`${value.icon} text-2xl`} />
                  </span>
                  <h4 className="mt-5 font-heading text-lg font-bold text-foreground-950">
                    {value.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground-600">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}