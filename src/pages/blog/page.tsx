import { Link } from "react-router-dom";
import PageHeader from "@/components/feature/PageHeader";
import Reveal from "@/components/base/Reveal";
import useSeo from "@/hooks/useSeo";
import { blogPosts } from "@/mocks/blog";
import BlogCard from "./components/BlogCard";

export default function Blog() {
  useSeo({
    title: "Blog — Conseils dev, cybersécurité & bots | DGM",
    description:
      "Guides pratiques sur le développement web, les bots Telegram & Discord, la cybersécurité et l'automatisation, par DGM — développeur et formateur.",
    canonicalPath: "/blog",
  });

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Guides, astuces et coulisses du code"
        description="Des articles concrets pour apprendre à coder, sécuriser et automatiser — écrits par un développeur, pas par une machine à contenu."
      />

      <section className="relative w-full bg-background-50 py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 60}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-t border-background-200/60 bg-background-100 py-14 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 text-center md:px-8">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
            <span className="h-px w-6 bg-primary-500" />
            Besoin d'aller plus loin
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            Un projet de bot ou d'automatisation en tête ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground-600 md:text-base">
            Je conçois des bots Telegram, Discord et WhatsApp sur mesure, connectés à vos outils et à
            vos paiements. Décris-moi ton besoin et on en discute.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background-50 transition-colors hover:bg-primary-600 cursor-pointer"
            >
              <i className="ri-mail-send-line text-base" />
              Me contacter
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-primary-500/60 bg-primary-500/10 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-400 transition-colors hover:bg-primary-500/20 cursor-pointer"
            >
              <i className="ri-tools-line text-base" />
              Voir les services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}