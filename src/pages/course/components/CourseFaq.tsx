import { useState } from "react";
import { courses } from "@/mocks/siteData";

type Course = (typeof courses)[number];

interface CourseFaqProps {
  course: Course;
}

export default function CourseFaq({ course }: CourseFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full border-b border-background-200/60 bg-background-100 py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 md:px-8">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
          <span className="h-px w-6 bg-primary-500" />
          FAQ
        </span>
        <h2 className="mt-4 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
          Questions fréquentes sur cette formation
        </h2>

        <div className="mt-8 space-y-3">
          {course.faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-lg border bg-background-50 transition-colors duration-300 ${
                  isOpen ? "border-primary-500/50" : "border-background-200/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer md:px-6"
                >
                  <span className="font-heading text-sm font-semibold text-foreground-950">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-all duration-300 ${
                      isOpen
                        ? "bg-primary-500 text-background-50"
                        : "bg-background-200/70 text-foreground-700"
                    }`}
                  >
                    <i className={isOpen ? "ri-subtract-line" : "ri-add-line"} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-foreground-600 md:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}