import { useState } from "react";
import { ADMIN_EMAIL, supabase } from "@/lib/supabase";
import MatrixRain from "@/pages/acces-prive/admin/components/MatrixRain";

const SECURITY_BADGES = [
  { icon: "ri-lock-2-line", label: "TLS chiffré" },
  { icon: "ri-shield-check-line", label: "Accès vérifié" },
  { icon: "ri-fingerprint-line", label: "Admin unique" },
];

export default function LoginGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      setError("Accès réservé. Cet email n'est pas autorisé.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      }
    } catch {
      setError("Une erreur est survenue. Réessaie dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-16">
      {/* Pluie de caractères façon salle des machines */}
      <MatrixRain className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />

      {/* Halos + grille */}
      <div className="pointer-events-none absolute inset-0 adm-grid-bg opacity-50" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#8b5cf6]/20 blur-[130px] adm-float" />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-[#00f0ff]/15 blur-[130px] adm-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,rgba(10,10,15,0.85)_100%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 adm-glow-primary">
            <span className="absolute inset-0 rounded-2xl bg-[#00f0ff]/10 adm-ping" />
            <i className="ri-shield-keyhole-line text-3xl text-[#00f0ff]" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#a78bfa]">DGM TUNNEL</p>
          <h1 className="mt-2 font-heading text-2xl font-bold uppercase tracking-wider text-[#e8e8f0]">
            Console <span className="adm-gradient-text">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-[#8b8b9e]">Accès strictement réservé à l'administrateur.</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {SECURITY_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#232334] bg-[#0d0d14]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]"
              >
                <i className={`${badge.icon} text-[#34d399]`} />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-2xl border border-[#232334] adm-glass-strong adm-glow-primary adm-fade-up p-6 md:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />

          <label className="mb-4 block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">
              Email administrateur
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-[#232334] bg-[#0d0d14] px-3 py-2.5 transition-colors focus-within:border-[#00f0ff] focus-within:shadow-[0_0_0_3px_rgba(0,240,255,0.12)]">
              <i className="ri-mail-line text-base text-[#5a5a6e]" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full bg-transparent text-sm text-[#e8e8f0] outline-none placeholder:text-[#5a5a6e]"
              />
            </div>
          </label>

          <label className="mb-4 block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">
              Mot de passe
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-[#232334] bg-[#0d0d14] px-3 py-2.5 transition-colors focus-within:border-[#00f0ff] focus-within:shadow-[0_0_0_3px_rgba(0,240,255,0.12)]">
              <i className="ri-lock-2-line text-base text-[#5a5a6e]" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-[#e8e8f0] outline-none placeholder:text-[#5a5a6e]"
              />
            </div>
          </label>

          {error ? (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#ff5470]/40 bg-[#ff5470]/10 px-3 py-2.5">
              <i className="ri-error-warning-line mt-0.5 text-base text-[#ff5470]" />
              <p className="text-xs text-[#ff5470]">{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#00f0ff] px-5 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-[#0a0a0f] transition-all hover:bg-[#33f3ff] hover:shadow-[0_0_30px_-6px_rgba(0,240,255,0.8)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {submitting ? <i className="ri-loader-4-line animate-spin text-lg" /> : <i className="ri-fingerprint-line text-lg" />}
            Accéder au panel
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-[#5a5a6e]">
            Aucune inscription publique. Un seul compte administrateur existe.
          </p>
        </form>
      </div>
    </div>
  );
}