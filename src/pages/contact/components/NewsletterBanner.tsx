import { useState } from "react";
import { newsletterPerks } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";

const FORM_ID = "db30elpggrtvtk1bh6fg";
const SUBMIT_ADDR = "https://readdy.ai/api/form/db30elpggrtvtk1bh6fg";

interface StatusState {
  type: "idle" | "submitting" | "success" | "error";
  message: string;
}

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const honeypot = String(data.get("website_alt") ?? "").trim();
    if (honeypot) {
      setEmail("");
      setStatus({
        type: "success",
        message: "Merci ! Vérifie ta boîte mail pour confirmer ton inscription.",
      });
      return;
    }

    if (!email.trim()) {
      setStatus({ type: "error", message: "Merci d'indiquer ton adresse email." });
      return;
    }

    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (key === "website_alt") return;
      params.append(key, String(value));
    });

    setStatus({ type: "submitting", message: "Inscription en cours..." });

    try {
      const response = await fetch(SUBMIT_ADDR, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      const responseText = await response.text();
      let parsed: { code?: string; message?: string; meta?: { message?: string; detail?: string } } | null =
        null;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }

      const serverMsg =
        parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText || "";
      const isSpam = typeof serverMsg === "string" && serverMsg.toLowerCase().includes("spam");

      if (response.ok && parsed?.code === "OK" && !isSpam) {
        setEmail("");
        setStatus({
          type: "success",
          message: "Merci ! Vérifie ta boîte mail pour confirmer ton inscription.",
        });
      } else {
        setStatus({
          type: "error",
          message: serverMsg || "L'inscription a échoué. Merci de réessayer dans un instant.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Une erreur réseau est survenue. Vérifie ta connexion et réessaie.",
      });
    }
  };

  return (
    <section className="relative w-full border-t border-background-200/60 bg-background-50 py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-primary-500/30 bg-gradient-to-r from-accent-500/12 via-background-100 to-primary-500/12 p-7 md:p-10">
            <div className="cyber-grid absolute inset-0 opacity-20" />
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-500/15 blur-[100px]" />

            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-400">
                  <i className="ri-mail-star-line text-base" />
                  Newsletter
                </span>
                <h3 className="mt-4 font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-3xl">
                  Reçois mes astuces gratuites
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-600 md:text-base">
                  Chaque semaine, je partage des conseils concrets sur le code, la sécurité et
                  l'automatisation — directement dans ta boîte mail.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {newsletterPerks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5 text-sm text-foreground-700">
                      <i className="ri-checkbox-circle-line text-primary-500" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <form
                id={FORM_ID}
                data-readdy-form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 rounded-lg border border-background-200/80 bg-background-50/80 p-5 backdrop-blur-sm md:p-6"
              >
                <label
                  htmlFor="newsletter-email"
                  className="font-mono text-xs uppercase tracking-wider text-foreground-600"
                >
                  Ton adresse email
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="toi@email.com"
                    className="w-full rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={status.type === "submitting"}
                    className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-all duration-300 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                  >
                    {status.type === "submitting" ? (
                      <>
                        <i className="ri-loader-4-line animate-spin text-lg" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line text-lg" />
                        S'abonner
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="text"
                  name="website_alt"
                  className="form-alt-field"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  readOnly
                />

                {status.type === "success" ? (
                  <p className="flex items-center gap-2 rounded-md border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-300">
                    <i className="ri-checkbox-circle-line text-lg" />
                    {status.message}
                  </p>
                ) : null}
                {status.type === "error" ? (
                  <p className="flex items-center gap-2 rounded-md border border-secondary-500/40 bg-secondary-500/10 px-4 py-3 text-sm text-secondary-300">
                    <i className="ri-error-warning-line text-lg" />
                    {status.message}
                  </p>
                ) : null}

                <p className="text-xs text-foreground-500">
                  En t'inscrivant, tu acceptes de recevoir mes emails. Désinscription en un clic.
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}