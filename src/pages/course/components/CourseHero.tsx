import { Link } from "react-router-dom";
import { courses } from "@/mocks/siteData";

type Course = (typeof courses)[number];

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="relative w-full overflow-hidden border-b border-background-200/60 bg-background-50 pt-28 md:pt-32">
      <div className="cyber-grid absolute inset-0 opacity-40" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary-500/15 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent-500/15 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground-500">
          <Link to="/" className="transition-colors hover:text-primary-400 cursor-pointer">
            Accueil
          </Link>
          <i className="ri-arrow-right-s-line" />
          <Link to="/formations" className="transition-colors hover:text-primary-400 cursor-pointer">
            Formations
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="text-foreground-700">{course.category}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-primary-400">
                <i className={`${course.icon}`} />
                {course.category}
              </span>
              {course.popular ? (
                <span className="rounded-full bg-accent-500/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-400">
                  Populaire
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground-600 md:text-base">
              {course.description}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-background-200/80 bg-background-100/60 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">Niveau</p>
                <p className="mt-1 text-sm font-semibold text-foreground-900">{course.level}</p>
              </div>
              <div className="rounded-lg border border-background-200/80 bg-background-100/60 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">Durée</p>
                <p className="mt-1 text-sm font-semibold text-foreground-900">{course.duration}</p>
              </div>
              <div className="rounded-lg border border-primary-500/30 bg-primary-500/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary-400">Prix</p>
                <p className="mt-1 text-sm font-semibold text-primary-300">{course.price}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#inscription"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-all duration-300 hover:bg-primary-600 cursor-pointer"
              >
                <i className="ri-user-add-line text-lg" />
                S'inscrire à cette formation
              </a>
              <Link
                to="/formations"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-100/60 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-foreground-900 transition-all duration-300 hover:border-accent-500 hover:text-accent-400 cursor-pointer"
              >
                <i className="ri-arrow-left-line text-lg" />
                Toutes les formations
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="neon-frame overflow-hidden rounded-lg">
              <img
                src={course.cover}
                alt={`Aperçu de la formation ${course.title}`}
                title={`Formation ${course.title} — DGM Dieu Génie du Mal`}
                className="h-[260px] w-full rounded-lg object-cover object-top md:h-[340px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}