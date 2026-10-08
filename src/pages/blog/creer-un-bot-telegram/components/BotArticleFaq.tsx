import { useState } from "react";

const faqItems = [
  {
    question: "Un bot Telegram est-il gratuit ?",
    answer:
      "Oui, l'API Telegram est gratuite ; seuls l'hébergement et le temps de développement ont un coût.",
  },
  {
    question: "Faut-il savoir coder pour créer un bot ?",
    answer:
      "Pour un bot basique, des outils sans code existent, mais un bot personnalisé et fiable nécessite de la programmation.",
  },
  {
    question: "Combien de temps faut-il pour créer un bot Telegram ?",
    answer:
      "Un bot simple se fait en quelques heures ; un bot métier complet peut prendre plusieurs jours.",
  },
  {
    question: "Quel langage choisir pour un bot Telegram ?",
    answer:
      "Python est recommandé pour débuter, grâce à sa simplicité et à sa communauté.",
  },
];

export default function BotArticleFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-lg border bg-background-100/60 transition-colors ${
              isOpen ? "border-primary-500/50" : "border-background-200/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className="font-heading text-sm font-semibold text-foreground-950 md:text-base">
                {item.question}
              </span>
              <i
                className={`shrink-0 text-xl text-primary-400 transition-transform duration-300 ${
                  isOpen ? "ri-subtract-line" : "ri-add-line"
                }`}
              />
            </button>
            {isOpen ? (
              <p className="px-5 pb-5 text-sm leading-relaxed text-foreground-600">{item.answer}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}