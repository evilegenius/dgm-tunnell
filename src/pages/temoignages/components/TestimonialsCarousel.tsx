import { useEffect, useState } from "react";
import { testimonials } from "@/mocks/siteData";

const AUTOPLAY_MS = 5000;

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  useEffect(() => {
    if (paused || total <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const goTo = (next: number) => setIndex((next + total) % total);

  return (
    <section className="relative w-full overflow-hidden bg-background-100 py-16 md:py-24">
      <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-primary-500/10 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent-500/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-4xl px-4 md:px-8">
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((item) => (
                <figure key={item.name} className="w-full flex-shrink-0 px-1">
                  <div className="relative mx-auto flex h-full max-w-2xl flex-col items-center rounded-lg border border-background-200/80 bg-background-50 p-7 text-center md:p-10">
                    <span className="absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-accent-500/40 bg-background-50 text-accent-400">
                      <i className="ri-double-quotes-l text-sm" />
                    </span>

                    <div className="flex items-center gap-1 text-primary-500">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <i key={i} className="ri-star-fill text-sm" />
                      ))}
                    </div>

                    <blockquote className="mt-5 text-sm leading-relaxed text-foreground-700 md:text-base">
                      "{item.text}"
                    </blockquote>

                    <figcaption className="mt-6 flex items-center gap-3">
                      <span className="h-12 w-12 overflow-hidden rounded-full border border-primary-500/40">
                        <img
                          src={item.photo}
                          alt={`Portrait de ${item.name}`}
                          title={`${item.name} — ${item.role}`}
                          className="h-12 w-12 object-cover object-top"
                        />
                      </span>
                      <div className="text-left">
                        <p className="font-heading text-sm font-bold text-foreground-950">{item.name}</p>
                        <p className="text-xs text-foreground-600">{item.role}</p>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Témoignage précédent"
              onClick={() => goTo(index - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-background-300 text-foreground-700 transition-all duration-300 hover:border-primary-500 hover:text-primary-400 cursor-pointer"
            >
              <i className="ri-arrow-left-line text-lg" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Aller au témoignage ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index ? "w-7 bg-primary-500" : "w-2 bg-background-300 hover:bg-primary-500/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Témoignage suivant"
              onClick={() => goTo(index + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-background-300 text-foreground-700 transition-all duration-300 hover:border-primary-500 hover:text-primary-400 cursor-pointer"
            >
              <i className="ri-arrow-right-line text-lg" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}