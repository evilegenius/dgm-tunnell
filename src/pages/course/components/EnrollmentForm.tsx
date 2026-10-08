import { useState } from "react";
import { courses, contactInfo } from "@/mocks/siteData";

type Course = (typeof courses)[number];

interface EnrollmentFormProps {
  course: Course;
}

const FORM_ID = "db30chpggrtvtk1bh6f0";
const SUBMIT_ADDR = "https://readdy.ai/api/form/db30chpggrtvtk1bh6f0";

interface StatusState {
  type: "idle" | "submitting" | "success" | "error";
  message: string;
}

export default function EnrollmentForm({ course }: EnrollmentFormProps) {
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [messageLength, setMessageLength] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);

    const honeypot = String(data.get("company_alt") ?? "").trim();
    if (honeypot) {
      formEl.reset();
      setMessageLength(0);
      setStatus({
        type: "success",
        message: "Merci ! Ta demande d'inscription a bien été envoyée. Je te recontacte très vite.",
      });
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus({ type: "error", message: "Merci de remplir tous les champs obligatoires." });
      return;
    }

    if (message.length > 500) {
      setStatus({ type: "error", message: "Ton message ne doit pas dépasser 500 caractères." });
      return;
    }

    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (key === "company_alt") return;
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
        formEl.reset();
        setMessageLength(0);
        setStatus({
          type: "success",
          message: "Merci ! Ta demande d'inscription a bien été envoyée. Je te recontacte très vite.",
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
    <section id="inscription" className="relative w-full bg-background-50 py-16 md:py-24">
      <div className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
              <span className="h-px w-6 bg-primary-500" />
              Inscription
            </span>
            <h2 className="mt-4 font-heading text-xl font-bold leading-tight text-foreground-950 md:text-3xl">
              Réserve ta place
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground-600 md:text-base">
              Remplis le formulaire et je te recontacte pour valider ton inscription, les dates et le
              format (en ligne ou personnalisé).
            </p>

            <div className="mt-7 rounded-lg border border-background-200/80 bg-background-100/60 p-5">
              <div className="flex items-center gap-2 text-accent-400">
                <i className={`${course.icon} text-lg`} />
                <span className="font-mono text-xs uppercase tracking-widest">Formation choisie</span>
              </div>
              <p className="mt-3 font-heading text-sm font-bold text-foreground-950">{course.title}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary-500/12 px-3 py-1 text-xs text-secondary-300">
                  {course.level}
                </span>
                <span className="rounded-md bg-background-200/70 px-3 py-1 text-xs text-foreground-700">
                  {course.duration}
                </span>
                <span className="rounded-md bg-primary-500/12 px-3 py-1 text-xs text-primary-300">
                  {course.price}
                </span>
              </div>
            </div>

            <ul className="mt-7 space-y-4">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-primary-500/30 bg-primary-500/10 text-primary-400">
                    <i className={`${item.icon} text-lg`} />
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
          </div>

          <div className="lg:col-span-7">
            <form
              id={FORM_ID}
              data-readdy-form
              onSubmit={handleSubmit}
              className="rounded-lg border border-background-200/80 bg-background-100/60 p-6 md:p-8"
            >
              <input type="hidden" name="course" value={course.title} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="enroll-name" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                    Nom complet *
                  </label>
                  <input
                    id="enroll-name"
                    name="name"
                    type="text"
                    placeholder="Ex : Amina K."
                    className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="enroll-email" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                    Email *
                  </label>
                  <input
                    id="enroll-email"
                    name="email"
                    type="email"
                    placeholder="toi@email.com"
                    className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="enroll-phone" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Téléphone / WhatsApp
                </label>
                <input
                  id="enroll-phone"
                  name="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  className="rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="enroll-message" className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Ton objectif * <span className="text-foreground-500">({messageLength}/500)</span>
                </label>
                <textarea
                  id="enroll-message"
                  name="message"
                  rows={5}
                  maxLength={500}
                  onChange={(e) => setMessageLength(e.target.value.length)}
                  placeholder="Parle-moi de ton niveau actuel et de ce que tu veux accomplir..."
                  className="resize-none rounded-md border border-background-300 bg-background-100/60 px-4 py-3 text-sm text-foreground-950 placeholder:text-foreground-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

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
                    Valider mon inscription
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
                * Champs obligatoires. Tes informations restent strictement confidentielles.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}