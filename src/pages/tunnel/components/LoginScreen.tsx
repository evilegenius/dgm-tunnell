import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import TunnelBackdrop from "@/pages/tunnel/components/TunnelBackdrop";
import InstallAppButton from "@/components/feature/InstallAppButton";

interface LoginScreenProps {
  onConnect: (code: string) => Promise<boolean>;
  connecting: boolean;
  error: string;
}

export default function LoginScreen({ onConnect, connecting, error }: LoginScreenProps) {
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setLocalError("Saisis ton jeton pour continuer.");
      return;
    }
    await onConnect(trimmed);
  };

  return (
    <TunnelBackdrop>
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e6007e]/40 bg-[#e6007e]/10">
              <i className="ri-shield-keyhole-line text-3xl text-[#e6007e]" />
            </div>
            <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wider text-[#3a0a26]">
              DGM <span className="text-[#e6007e]">TUNNEL</span>
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#d63384]">
              Celui qui demeure
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-[#f7cfe3] bg-[#fff5fa]/90 p-5 backdrop-blur-sm"
          >
            <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#b98aa6]">
              Entre ton jeton d'accès pour continuer
            </p>

            <label className="block">
              <span className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">
                Ton jeton
              </span>
              <div className="relative">
                <i className="ri-key-2-line pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#b98aa6]" />
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="DGM-XXXXXX-CREDIT"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-lg border border-[#f7cfe3] bg-[#ffffff] py-3.5 pl-11 pr-4 font-mono text-sm uppercase tracking-wider text-[#3a0a26] outline-none transition-colors placeholder:text-[#b98aa6] focus:border-[#e6007e]"
                />
              </div>
            </label>

            {localError || error ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#dc2626]/40 bg-[#dc2626]/10 px-3.5 py-3">
                <i className="ri-error-warning-line mt-0.5 text-base text-[#dc2626]" />
                <p className="text-sm text-[#dc2626]">{localError || error}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={connecting}
              className="mt-5 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#e6007e] px-4 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-[#ffffff] transition-colors hover:bg-[#ff3da0] disabled:opacity-60 cursor-pointer"
            >
              {connecting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-base" />
                  Connexion...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line text-base" />
                  Connecter
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#b98aa6]">
              <i className="ri-lock-2-line" />
              Ton jeton est mémorisé pour te reconnecter automatiquement.
            </p>
          </form>

          <div className="mt-4 rounded-2xl border border-[#f7cfe3] bg-[#fff5fa]/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c026d3]/40 bg-[#c026d3]/10">
                <i className="ri-smartphone-line text-lg text-[#d63384]" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-[#3a0a26]">Installe l'application</p>
                <p className="text-[12px] leading-relaxed text-[#9b6b86]">
                  Ajoute DGM TUNNEL à ton écran d'accueil et ouvre-la en plein écran, comme une vraie appli.
                </p>
              </div>
            </div>
            <InstallAppButton variant="outline" fullWidth className="mt-3" label="Installer sur mon téléphone" />
            <Link
              to="/download"
              className="mt-3 block text-center font-mono text-[10px] uppercase tracking-wider text-[#b98aa6] transition-colors hover:text-[#e6007e] cursor-pointer"
            >
              Voir la fiche de l'application
            </Link>
          </div>
        </div>
      </div>
    </TunnelBackdrop>
  );
}