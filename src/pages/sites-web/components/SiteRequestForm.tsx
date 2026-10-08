import { useState } from "react";
import Reveal from "@/components/base/Reveal";

const FORM_ID = "db31d2moc082o2i1kl70";
const SUBMIT_ADDR = "https://readdy.ai/api/form/db31d2moc082o2i1kl70";

interface StatusState {
  type: "idle" | "submitting" | "success" | "error";
  message: string;
}

const perks = [
  {
    icon: "ri-palette-line",
    title: "Design sur-mesure",
    description: "Interface moderne et unique, adaptée à ton image de marque.",
  },
  {
    icon: "ri-smartphone-line",
    title: "100% responsive",
    description: "Parfaitement lisible sur mobile, tablette et ordinateur.",
  },
  {
    icon: "ri-rocket-2-line",
    title: "Rapide & performant",
    description: "Optimisé pour la vitesse et le référencement Google.",
  },
  {
    icon: "ri-customer-service-2-line",
    title: "Suivi personnalisé",
    description: "Un accompagnement de A à Z, de la conception à la mise en ligne.",
  },
  {
    icon: "ri-map-pin-2-line",
    title: "Disponible à distance",
    description: "Une équipe réactive, où que tu sois dans le monde.",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  siteType: "",
  budget: "",
  message: "",
};

export default function SiteRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });

  const updateField = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);

    const honeypot = String(data.get("contact_alt") ?? "").trim();
    if (honeypot) {
      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Merci ! Ta demande a bien été envoyée. Je te réponds sous 24h.",
      });
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.message.trim() || !form.siteType) {
      setStatus({ type: "error", message: "Merci de remplir tous les champs obligatoires." });
      return;
    }

    if (form.message.length > 500) {
      setStatus({ type: "error", message: "Ta description ne doit pas dépasser 500 caractères." });
      return;
    }

    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (key === "contact_alt") return;
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
          message: "Merci ! Ta demande a bien été envoyée. Je te réponds sous 24h.",
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
    <section id="demande-site" className="relative w-full overflow-hidden bg-background-100 py-16 md:py-24">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-600">
              <i className="ri-rocket-2-line" />
              Création de sites web
            </span>
            <h2 className="mt-5 font-heading text-2xl font-black leading-tight text-foreground-950 md:text-4xl">
              Tu veux un site web ?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground-600 md:text-base">
              Confie-moi ton projet : je crée des plateformes digitales performantes, modernes et
              sur-mesure pour ton activité.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="space-y-4">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-start gap-4 rounded-2xl border border-background-200/80 bg-background-50 p-4"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/12 text-primary-500">
                    <i className={`${perk.icon} text-base`} />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground-950">{perk.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-foreground-600">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={80}>
            <form
              id={FORM_ID}
              data-readdy-form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-2xl border border-background-200/80 bg-background-50"
            >
              <div className="flex items-center gap-3 bg-primary-500 px-6 py-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-50/20 text-background-50">
                  <i className="ri-mail-send-line text-lg" />
                </span>
                <div>
                  <p className="font-heading font-black text-background-50">Décris ton projet</p>
                  <p className="text-xs text-background-50/80">Réponse sous 24h garantie</p>
                </div>
              </div>

              <div className="space-y-5 p-6 md:p-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="site-name" className="font-mono text-xs font-bold uppercase tracking-wider text-foreground-600">
                      Nom complet *
                    </label>
                    <input
                      id="site-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Ex : Gradi Lapika"
                      className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="site-email" className="font-mono text-xs font-bold uppercase tracking-wider text-foreground-600">
                      Email *
                    </label>
                    <input
                      id="site-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="toi@email.com"
                      className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="site-phone" className="font-mono text-xs font-bold uppercase tracking-wider text-foreground-600">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    id="site-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="site-type" className="font-mono text-xs font-bold uppercase tracking-wider text-foreground-600">
                      Type de site *
                    </label>
                    <select
                      id="site-type"
                      name="site_type"
                      value={form.siteType}
                      onChange={(e) => updateField("siteType", e.target.value)}
                      className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                    >
                      <option value="">Choisir...</option>
                      <option value="Site vitrine">Site vitrine</option>
                      <option value="E-commerce / Boutique">E-commerce / Boutique</option>
                      <option value="Site institutionnel">Site institutionnel</option>
                      <option value="Application web">Application web</option>
                      <option value="Blog / Média">Blog / Média</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="site-budget" className="font-mono text-xs font-bold uppercase tracking-wider text-foreground-600">
                      Budget estimé
                    </label>
                    <select
                      id="site-budget"
                      name="budget"
                      value={form.budget}
                      onChange={(e) => updateField("budget", e.target.value)}
                      className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                    >
                      <option value="">Non défini</option>
                      <option value="Moins de 500 €">Moins de 500 €</option>
                      <option value="500 € – 1 000 €">500 € – 1 000 €</option>
                      <option value="1 000 € – 3 000 €">1 000 € – 3 000 €</option>
                      <option value="3 000 € – 10 000 €">3 000 € – 10 000 €</option>
                      <option value="Plus de 10 000 €">Plus de 10 000 €</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="site-message" className="font-mono text-xs font-bold uppercase tracking-wider text-foreground-600">
                    Décris ton projet * <span className="text-foreground-500">({form.message.length}/500)</span>
                  </label>
                  <textarea
                    id="site-message"
                    name="message"
                    rows={4}
                    maxLength={500}
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Explique ton activité, tes objectifs et les fonctionnalités souhaitées..."
                    className="resize-none rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <input
                  type="text"
                  name="contact_alt"
                  className="form-alt-field"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  readOnly
                />

                <button
                  type="submit"
                  disabled={status.type === "submitting"}
                  className="inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-md bg-primary-500 px-6 py-4 font-heading text-base font-black text-background-50 transition-all duration-300 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                  {status.type === "submitting" ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-xl" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-2-line text-xl" />
                      Envoyer ma demande
                    </>
                  )}
                </button>

                {status.type === "success" ? (
                  <p className="flex items-center gap-2 rounded-md border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-600">
                    <i className="ri-checkbox-circle-line text-lg" />
                    {status.message}
                  </p>
                ) : null}
                {status.type === "error" ? (
                  <p className="flex items-center gap-2 rounded-md border border-secondary-500/40 bg-secondary-500/10 px-4 py-3 text-sm text-secondary-600">
                    <i className="ri-error-warning-line text-lg" />
                    {status.message}
                  </p>
                ) : null}

                <p className="text-center text-xs text-foreground-500">
                  <i className="ri-lock-line mr-1" />
                  Tes données sont confidentielles et ne seront jamais partagées.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}