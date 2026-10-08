import { useState } from "react";
import { faqs } from "@/mocks/siteData";
import SectionHeading from "@/components/base/SectionHeading";
import Reveal from "@/components/base/Reveal";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full border-t border-background-200/60 bg-background-100 py-20 md:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Questions fréquentes"
          title="Tout ce que tu veux savoir avant de commencer"
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 60}>
                <div
                  className={`overflow-hidden rounded-lg border bg-background-50 transition-colors duration-300 ${
                    isOpen ? "border-primary-500/50" : "border-background-200/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer md:px-6"
                  >
                    <h4 className="font-heading text-sm font-semibold text-foreground-950 md:text-base">
                      {faq.question}
                    </h4>
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-all duration-300 ${
                        isOpen ? "bg-primary-500 text-background-50" : "bg-background-200/70 text-foreground-700"
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
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}