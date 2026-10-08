import { courses } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";

type Course = (typeof courses)[number];

interface CourseProgramProps {
  course: Course;
}

export default function CourseProgram({ course }: CourseProgramProps) {
  return (
    <section className="relative w-full border-b border-background-200/60 bg-background-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
              <span className="h-px w-6 bg-primary-500" />
              Programme complet
            </span>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
              Le déroulé de la formation
            </h2>

            <div className="mt-8 space-y-5">
              {course.program.map((block, index) => (
                <Reveal key={block.title} delay={index * 60}>
                  <div className="rounded-lg border border-background-200/80 bg-background-100/60 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500/15 font-mono text-xs font-bold text-primary-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading text-base font-bold text-foreground-950">
                        {block.title}
                      </h3>
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-foreground-700">
                          <i className="ri-checkbox-circle-line mt-0.5 text-primary-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            {course.result ? (
              <Reveal>
                <div className="mt-5 rounded-lg border border-primary-500/40 bg-primary-500/10 p-5 md:p-6">
                  <div className="flex items-center gap-2 text-primary-400">
                    <i className="ri-flag-2-line text-lg" />
                    <h3 className="font-mono text-xs uppercase tracking-widest">Résultat</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-700">{course.result}</p>
                </div>
              </Reveal>
            ) : null}
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-lg border border-background-200/80 bg-background-100/60 p-6">
                <div className="flex items-center gap-2 text-accent-400">
                  <i className="ri-lock-2-line text-lg" />
                  <h3 className="font-mono text-xs uppercase tracking-widest">Prérequis</h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {course.prerequisites.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-700">
                      <i className="ri-arrow-right-s-line mt-0.5 text-accent-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-primary-500/30 bg-primary-500/8 p-6">
                <div className="flex items-center gap-2 text-primary-400">
                  <i className="ri-trophy-line text-lg" />
                  <h3 className="font-mono text-xs uppercase tracking-widest">Ce que tu sauras faire</h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {course.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-700">
                      <i className="ri-check-double-line mt-0.5 text-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-background-200/80 bg-background-100/60 p-6">
                <div className="flex items-center gap-2 text-secondary-300">
                  <i className="ri-user-star-line text-lg" />
                  <h3 className="font-mono text-xs uppercase tracking-widest">Formateur</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground-600">{course.trainer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}