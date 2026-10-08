import { useState } from "react";
import { contactChannels, contactInfo, socials } from "@/mocks/siteData";
import Reveal from "@/components/base/Reveal";

const FORM_ID = "db3089uoc082o2i1kkvg";
const SUBMIT_ADDR = "https://readdy.ai/api/form/db3089uoc082o2i1kkvg";

interface StatusState {
  type: "idle" | "submitting" | "success" | "error";
  message: string;
}

const initialForm = {
  name: "",
  email: "",
  subject: "Formation",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });

  const updateField = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);

    const honeypot = String(data.get("website_alt") ?? "").trim();
    if (honeypot) {
      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Merci ! Ton message a bien été envoyé. Je te réponds très vite.",
      });
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Merci de remplir tous les champs obligatoires." });
      return;
    }

    if (form.message.length > 500) {
      setStatus({ type: "error", message: "Ton message ne doit pas dépasser 500 caractères." });
      return;
    }

    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (key === "website_alt") return;
      params.append(key, String(value));
    });

    setStatus({ type: "submitting", message: "Envoi en cours..." });

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
        setForm(initialForm);
        setStatus({
          type: "success",
          message: "Merci ! Ton message a bien été envoyé. Je te réponds très vite.",
        });
      } else {
        setStatus({
          type: "error",
          message: serverMsg || "L'envoi a échoué. Merci de réessayer dans un instant.",
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
    <section className="relative w-full bg-background-100 py-16 md:py-24">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-accent-500/12 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="rounded-lg border border-background-200/80 bg-background-50 p-6 md:p-8">
              <h3 className="font-heading text-lg font-bold text-foreground-950">
                Restons en contact
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                Choisis le moyen qui te convient. Pour les projets urgents, WhatsApp est le plus rapide.
              </p>

              <ul className="mt-7 space-y-5">
                {contactInfo.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-primary-500/30 bg-primary-500/10 text-primary-400">
                      <i className={`${item.icon} text-xl`} />
                    </span>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-foreground-500">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm text-foreground-800">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                {contactChannels.map((channel) => {
                  const glow =
                    channel.accent === "accent"
                      ? "hover:border-accent-500 hover:shadow-[0_0_26px_-6px_oklch(var(--accent-500)/0.8)] text-accent-400"
                      : channel.accent === "secondary"
                        ? "hover:border-secondary-500 hover:shadow-[0_0_26px_-6px_oklch(var(--secondary-500)/0.8)] text-secondary-400"
                        : "hover:border-primary-500 hover:shadow-[0_0_26px_-6px_oklch(var(--primary-500)/0.8)] text-primary-400";
                  return (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex items-center justify-between gap-3 rounded-md border border-background-300 bg-background-100/60 px-4 py-3 transition-all duration-300 cursor-pointer ${glow}`}
                    >
                      <span className="flex items-center gap-3">
                        <i className={`${channel.icon} text-xl`} />
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-widest text-foreground-500">
                            {channel.label}
                          </span>
                          <span className="block text-sm text-foreground-800">{channel.value}</span>
                        </span>
                      </span>
                      <i className="ri-arrow-right-up-line text-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  );
                })}
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-foreground-500">
                  Réseaux sociaux
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-background-300 text-foreground-600 transition-all duration-300 hover:border-accent-500 hover:text-accent-400 hover:shadow-[0_0_20px_-4px_oklch(var(--accent-500)/0.8)] cursor-pointer"
                    >
                      <i className={`${social.icon} text-lg`} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-accent-500/25 bg-accent-500/8 p-5">
                <div className="flex items-center gap-2 text-accent-400">
                  <i className="ri-shield-check-line text-lg" />
                  <span className="font-mono text-xs uppercase tracking-widest">Confidentialité</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground-600">
                  Tes données ne sont jamais partagées. Chaque échange reste strictement privé.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={80}>
            <form
              id={FORM_ID}
              data-readdy-form
              onSubmit={handleSubmit}
              className="rounded-lg border border-background-200/80 bg-background-50 p-6 md:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="dgm-name" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                    Nom complet *
                  </label>
                  <input
                    id="dgm-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Ex : Amina K."
                    className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="dgm-email" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                    Email *
                  </label>
                  <input
                    id="dgm-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="toi@email.com"
                    className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="dgm-subject" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Sujet
                </label>
                <select
                  id="dgm-subject"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="Formation">Rejoindre une formation</option>
                  <option value="Site web">Création d'un site web</option>
                  <option value="Application">Développement d'une application</option>
                  <option value="Bot">Création d'un bot</option>
                  <option value="Audit">Audit &amp; sécurisation</option>
                  <option value="Autre">Autre demande</option>
                </select>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="dgm-message" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Message * <span className="text-foreground-500">({form.message.length}/500)</span>
                </label>
                <textarea
                  id="dgm-message"
                  name="message"
                  rows={5}
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Décris ton besoin, ton niveau ou ta question..."
                  className="resize-none rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
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

              <button
                type="submit"
                disabled={status.type === "submitting"}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-background-50 transition-all duration-300 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto cursor-pointer"
              >
                {status.type === "submitting" ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-lg" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line text-lg" />
                    Envoyer le message
                  </>
                )}
              </button>

              {status.type === "success" ? (
                <p className="mt-4 flex items-center gap-2 rounded-md border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-300">
                  <i className="ri-checkbox-circle-line text-lg" />
                  {status.message}
                </p>
              ) : null}
              {status.type === "error" ? (
                <p className="mt-4 flex items-center gap-2 rounded-md border border-secondary-500/40 bg-secondary-500/10 px-4 py-3 text-sm text-secondary-300">
                  <i className="ri-error-warning-line text-lg" />
                  {status.message}
                </p>
              ) : null}

              <p className="mt-4 text-xs text-foreground-500">
                * Champs obligatoires. Je ne partage jamais tes informations.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}