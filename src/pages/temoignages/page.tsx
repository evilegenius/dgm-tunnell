import PageHeader from "@/components/feature/PageHeader";
import TestimonialsCarousel from "./components/TestimonialsCarousel";

const ratingStats = [
  { icon: "ri-star-smile-line", value: "4.9/5", label: "Note moyenne" },
  { icon: "ri-chat-smile-2-line", value: "120+", label: "Avis élèves & clients" },
  { icon: "ri-award-line", value: "95%", label: "Recommandent DGM" },
];

export default function Testimonials() {
  return (
    <>
      <PageHeader
        eyebrow="Témoignages"
        title="Ils ont franchi le pas avec DGM"
        description="Élèves, entrepreneurs et équipes techniques partagent leur expérience après une formation ou un projet réalisé ensemble."
      />

      <section className="w-full border-b border-background-200/60 bg-background-50 py-12 md:py-14">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 md:px-8">
          {ratingStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-lg border border-background-200/80 bg-background-100/60 p-5"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-accent-500/30 bg-accent-500/10 text-accent-400">
                <i className={`${stat.icon} text-xl`} />
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-foreground-950">{stat.value}</p>
                <p className="text-xs text-foreground-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsCarousel />
    </>
  );
}