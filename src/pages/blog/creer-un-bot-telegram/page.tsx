import { useMemo } from "react";
import { Link } from "react-router-dom";
import useSeo from "@/hooks/useSeo";
import { blogPosts } from "@/mocks/blog";
import BotArticleBody from "./components/BotArticleBody";
import BotArticleFaq from "./components/BotArticleFaq";

export default function BotTelegramArticle() {
  const post = blogPosts[0];

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Comment créer un bot Telegram : le guide complet pour débutants",
      description:
        "Apprenez à créer un bot Telegram étape par étape : BotFather, choix du langage, hébergement et bonnes pratiques pour automatiser votre activité.",
      datePublished: "2026-10-07",
      author: {
        "@type": "Person",
        name: "DGM — Dieu Génie du Mal",
      },
    }),
    [],
  );

  useSeo({
    title: "Créer un bot Telegram : guide complet pour débutants",
    description:
      "Apprenez à créer un bot Telegram étape par étape : BotFather, choix du langage, hébergement et bonnes pratiques pour automatiser votre activité.",
    canonicalPath: "/blog/creer-un-bot-telegram",
    jsonLd,
  });

  return (
    <>
      <section className="relative w-full overflow-hidden border-b border-background-200/60 bg-background-100 pt-28 pb-14 md:pt-36 md:pb-20">
        <div className="cyber-grid absolute inset-0 opacity-35" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary-500/15 blur-[120px]" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent-500/15 blur-[120px]" />

        <div className="relative mx-auto w-full max-w-4xl px-4 md:px-8">
          <nav className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground-500">
            <Link to="/" className="transition-colors hover:text-primary-400 cursor-pointer">
              Accueil
            </Link>
            <i className="ri-arrow-right-s-line" />
            <Link to="/blog" className="transition-colors hover:text-primary-400 cursor-pointer">
              Blog
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-primary-400">Bots</span>
          </nav>

          <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary-500/50 bg-primary-500/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary-300">
            <i className="ri-robot-2-line text-sm" />
            {post.category}
          </span>

          <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-foreground-950 md:text-5xl">
            Comment créer un bot Telegram : le guide complet pour débutants
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-foreground-500">
            <span className="inline-flex items-center gap-2">
              <i className="ri-user-3-line text-primary-500" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="ri-calendar-line text-primary-500" />
              {post.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="ri-time-line text-accent-400" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-background-50 py-14 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
          <div className="overflow-hidden rounded-lg border border-background-200/80">
            <img
              src={post.cover}
              alt="Comment créer un bot Telegram — guide DGM"
              title="Créer un bot Telegram — guide complet DGM"
              className="h-56 w-full object-cover object-top md:h-80"
            />
          </div>

          <div className="mt-12">
            <BotArticleBody />
          </div>

          <div className="mt-14">
            <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
              Questions fréquentes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-600">
              Les réponses aux questions les plus posées avant de se lancer dans la création d'un bot
              Telegram.
            </p>
            <div className="mt-6">
              <BotArticleFaq />
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start gap-5 rounded-lg border border-primary-500/40 bg-primary-500/10 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
                DGM construit ton bot Telegram sur mesure
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-600">
                Automatisation, paiements, connexion à tes outils : on conçoit un bot robuste, sécurisé
                et prêt à tourner 24h/24.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background-50 transition-colors hover:bg-primary-600 cursor-pointer"
              >
                <i className="ri-mail-send-line text-base" />
                Demander un devis
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-primary-500/60 bg-primary-500/10 px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-400 transition-colors hover:bg-primary-500/20 cursor-pointer"
              >
                <i className="ri-arrow-left-line text-base" />
                Tous les articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}