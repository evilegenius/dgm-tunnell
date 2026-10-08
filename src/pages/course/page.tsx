import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { courses } from "@/mocks/siteData";
import CourseHero from "./components/CourseHero";
import CourseProgram from "./components/CourseProgram";
import CourseFaq from "./components/CourseFaq";
import EnrollmentForm from "./components/EnrollmentForm";

export default function CourseDetail() {
  const { id } = useParams();
  const location = useLocation();
  const course = courses.find((item) => item.id === id);

  useEffect(() => {
    if (location.hash === "#inscription") {
      const target = document.getElementById("inscription");
      if (target) {
        window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [location.hash, id]);

  if (!course) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-primary-500/40 bg-primary-500/10 text-primary-400">
          <i className="ri-error-warning-line text-3xl" />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
          Formation introuvable
        </h1>
        <p className="mt-3 max-w-xl text-sm text-foreground-600 md:text-base">
          Cette formation n'existe pas ou a été déplacée. Découvre toutes les formations disponibles.
        </p>
        <Link
          to="/formations"
          className="mt-8 inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-colors hover:bg-primary-600 cursor-pointer"
        >
          <i className="ri-arrow-left-line" />
          Retour aux formations
        </Link>
      </div>
    );
  }

  return (
    <>
      <CourseHero course={course} />
      <CourseProgram course={course} />
      <CourseFaq course={course} />
      <EnrollmentForm course={course} />
      {course.legalNote ? (
        <section className="w-full border-t border-background-200/60 bg-background-100 py-10 md:py-12">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
            <div className="flex items-start gap-4 rounded-lg border border-accent-500/40 bg-accent-500/8 p-5 md:p-6">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-accent-500/15 text-accent-400">
                <i className="ri-shield-check-line text-2xl" />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent-400">
                  Usage légal et éthique
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground-700">{course.legalNote}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}