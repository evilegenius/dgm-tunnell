import { useState } from "react";
import type { FormEvent } from "react";

const SUBMIT_URL = "https://readdy.ai/api/form/db322bj2asjjtt1slhr0";

const DISTRIBUTION = [
  { stars: 5, percent: 88 },
  { stars: 4, percent: 9 },
  { stars: 3, percent: 2 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

interface Review {
  name: string;
  initials: string;
  date: string;
  text: string;
  accent: string;
}

const REVIEWS: Review[] = [
  {
    name: "Aminata O.",
    initials: "AO",
    date: "26/09/2026",
    text: "Application très propre. La connexion est rapide, le bouton principal est clair et je retrouve mes configs sans chercher partout dans les menus.",
    accent: "#00f0ff",
  },
  {
    name: "Idrissa S.",
    initials: "IS",
    date: "24/09/2026",
    text: "Très bonne application. J'aime la simplicité : la sélection du pays, l'affichage des jours restants et le bouton « Copier la configuration » qui me fait gagner du temps.",
    accent: "#8b5cf6",
  },
  {
    name: "Grâce N.",
    initials: "GN",
    date: "21/09/2026",
    text: "Bonne expérience. L'appli est stable, le bouton de mise à jour me confirme toujours que mon accès est valide, et l'installation sur le téléphone se fait en un clic.",
    accent: "#f5b544",
  },
];

export default function ReviewsSection() {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Champ anti-spam : rempli uniquement par les robots.
    const honeypot = String(formData.get("company_alt") ?? "").trim();
    if (honeypot) {
      setStatus("success");
      setFormError("");
      form.reset();
      setRating(0);
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();

    if (!name || !comment) {
      setStatus("error");
      setFormError("Merci de renseigner ton nom et ton commentaire.");
      return;
    }
    if (rating < 1) {
      setStatus("error");
      setFormError("Choisis une note de 1 à 5 étoiles.");
      return;
    }

    formData.delete("company_alt");
    formData.set("rating", String(rating));

    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, String(value));
    });

    setStatus("sending");
    setFormError("");

    try {
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const responseText = await response.text();
      let parsed: {
        code?: string;
        message?: string;
        meta?: { message?: string; detail?: string };
      } | null = null;
      try {
        parsed = responseText ? JSON.parse(responseText) : null;
      } catch {
        parsed = null;
      }

      const serverMessage =
        parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText || "";
      const isSpam = String(serverMessage).toLowerCase().includes("spam");

      if (response.ok && parsed?.code === "OK" && !isSpam) {
        setStatus("success");
        setFormError("");
        form.reset();
        setRating(0);
        return;
      }

      setStatus("error");
      setFormError(serverMessage || "L'envoi a échoué. Réessaie dans un instant.");
    } catch {
      setStatus("error");
      setFormError("Connexion impossible. Vérifie ta connexion puis réessaie.");
    }
  };

  return (
    <section className="mt-10" id="avis">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#e8e8f0] md:text-lg">
          Notes et avis
        </h2>
        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">
          <i className="ri-star-line" />
          {REVIEWS.length} avis
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-xl border border-[#232334] bg-[#12121b] p-5 sm:grid-cols-[auto_1fr]">
        <div className="text-center sm:pr-6 sm:text-left">
          <p className="font-heading text-5xl font-extrabold text-[#e8e8f0]">4,9</p>
          <div className="mt-2 flex justify-center gap-0.5 sm:justify-start">
            {[1, 2, 3, 4, 5].map((star) => (
              <i key={star} className="ri-star-fill text-sm text-[#f5b544]" />
            ))}
          </div>
          <p className="mt-2 max-w-[9rem] text-[11px] leading-relaxed text-[#8b8b9e] sm:max-w-[10rem]">
            Avis publiés par les utilisateurs de DGM TUNNEL.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {DISTRIBUTION.map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="w-3 font-mono text-[11px] text-[#8b8b9e]">{row.stars}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#232334]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#00f0ff]"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="w-9 text-right font-mono text-[11px] text-[#8b8b9e]">{row.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {REVIEWS.map((review) => (
          <article key={review.name} className="rounded-xl border border-[#232334] bg-[#12121b] p-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs font-bold"
                style={{ borderColor: `${review.accent}66`, backgroundColor: `${review.accent}1f`, color: review.accent }}
              >
                {review.initials}
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-[#e8e8f0]">{review.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e]">{review.date}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className="ri-star-fill text-xs text-[#f5b544]" />
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#b8b8ca]">{review.text}</p>
          </article>
        ))}
      </div>

      <form
        id="dgm-review-form"
        data-readdy-form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-[#232334] bg-[#12121b] p-5 md:p-6"
      >
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e8e8f0]">Laisser un avis</h3>
        <p className="mt-1 text-[13px] text-[#8b8b9e]">
          Donne ta note et partage ton expérience avec DGM TUNNEL.
        </p>

        <label className="mt-4 block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">Ton nom</span>
          <input
            name="name"
            type="text"
            maxLength={50}
            autoComplete="name"
            placeholder="Ex. Adama Traoré"
            className="w-full rounded-lg border border-[#232334] bg-[#0d0d14] px-3.5 py-3 text-sm text-[#e8e8f0] outline-none transition-colors placeholder:text-[#5a5a6e] focus:border-[#00f0ff]"
          />
        </label>

        <div className="mt-4">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">
            Ta note
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                onClick={() => {
                  setRating(star);
                  if (status === "error") {
                    setStatus("idle");
                    setFormError("");
                  }
                }}
                className="cursor-pointer p-0.5 text-2xl leading-none transition-transform hover:scale-110"
              >
                <i className={star <= rating ? "ri-star-fill text-[#f5b544]" : "ri-star-line text-[#3a3a52]"} />
              </button>
            ))}
            {rating > 0 ? (
              <span className="ml-2 self-center font-mono text-[11px] text-[#8b8b9e]">{rating}/5</span>
            ) : null}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">
            Ton commentaire
          </span>
          <textarea
            name="comment"
            maxLength={500}
            rows={4}
            placeholder="Parle de ton expérience avec DGM TUNNEL"
            className="w-full resize-none rounded-lg border border-[#232334] bg-[#0d0d14] px-3.5 py-3 text-sm text-[#e8e8f0] outline-none transition-colors placeholder:text-[#5a5a6e] focus:border-[#00f0ff]"
          />
        </label>

        <input
          type="text"
          name="company_alt"
          className="form-alt-field"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          readOnly
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#00f0ff] px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-[#0a0a0f] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 cursor-pointer"
        >
          {status === "sending" ? <i className="ri-loader-4-line animate-spin text-base" /> : <i className="ri-send-plane-line text-base" />}
          Publier l'avis
        </button>

        {status === "success" ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-[#34d399]">
            <i className="ri-checkbox-circle-line text-base" />
            Merci ! Ton avis a bien été envoyé.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-[#ff5470]">
            <i className="ri-error-warning-line text-base" />
            {formError}
          </p>
        ) : null}
      </form>
    </section>
  );
}