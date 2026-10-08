import { Link } from "react-router-dom";
import { courses } from "@/mocks/siteData";
import SectionHeading from "@/components/base/SectionHeading";
import Reveal from "@/components/base/Reveal";

export default function HomeCoursesPreview() {
  const featured = [...courses.filter((course) => course.popular), ...courses.filter((course) => !course.popular)].slice(
    0,
    3,
  );

  return (
    <section
      id="decouvrir"
      className="relative w-full border-t border-background-200/60 bg-background-50 py-20 md:py-28"
    >
      <div className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Formations"
          title="Des parcours pour passer de zéro à opérationnel"
          description="Des programmes progressifs, orientés pratique, avec des projets réels et un accompagnement personnalisé jusqu'à l'autonomie."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((course, index) => (
            <Reveal key={course.id} delay={index * 60}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-background-200/80 bg-background-100/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/50 hover:bg-background-100">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-500/0 blur-3xl transition-all duration-500 group-hover:bg-primary-500/20" />

                <div className="relative flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md border border-primary-500/30 bg-primary-500/10 text-primary-400">
                    <i className={`${course.icon} text-2xl`} />
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    {course.popular ? (
                      <span className="rounded-full bg-accent-500/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-400">
                        Populaire
                      </span>
                    ) : null}
                    <span className="rounded-full bg-secondary-500/12 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary-300">
                      {course.category}
                    </span>
                  </div>
                </div>

                <Link to={`/formations/${course.id}`} className="relative mt-5 block cursor-pointer">
                  <h3 className="font-heading text-lg font-bold text-foreground-950 transition-colors group-hover:text-primary-400">
                    {course.title}
                  </h3>
                </Link>
                <p className="relative mt-2 text-sm leading-relaxed text-foreground-600">
                  {course.description}
                </p>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-secondary-500/12 px-3 py-1 text-xs text-secondary-300">
                    <i className="ri-stack-line" />
                    {course.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-background-200/70 px-3 py-1 text-xs text-foreground-700">
                    <i className="ri-time-line" />
                    {course.duration}
                  </span>
                </div>

                <div className="relative mt-auto flex items-end justify-between gap-3 border-t border-background-200/70 pt-5">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">
                      À partir de
                    </span>
                    <p className="font-heading text-lg font-bold text-primary-400">{course.price}</p>
                  </div>
                  <Link
                    to={`/formations/${course.id}`}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-primary-500/50 bg-primary-500/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-400 transition-all duration-300 hover:bg-primary-500 hover:text-background-50 cursor-pointer"
                  >
                    Détails
                    <i className="ri-arrow-right-line" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <Link
              to="/formations"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-500/50 bg-primary-500/10 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-primary-400 transition-all duration-300 hover:bg-primary-500 hover:text-background-50 cursor-pointer"
            >
              Voir toutes les formations
              <i className="ri-arrow-right-line text-lg" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}