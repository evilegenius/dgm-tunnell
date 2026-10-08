import { useCallback, useEffect, useState } from "react";

interface IpFinderScreenProps {
  onBack: () => void;
}

export default function IpFinderScreen({ onBack }: IpFinderScreenProps) {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) throw new Error("bad status");
      const data = (await response.json()) as { ip?: string };
      if (!data.ip) throw new Error("no ip");
      setIp(data.ip);
    } catch {
      setError("Impossible de détecter ton IP. Vérifie ta connexion puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#f7cfe3] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#9b6b86] transition-colors hover:border-[#e6007e]/50 hover:text-[#e6007e] cursor-pointer"
        >
          <i className="ri-arrow-left-line text-base" />
          Retour
        </button>
        <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wider text-[#3a0a26]">
          <i className="ri-map-pin-user-line text-base text-[#e6007e]" />
          IP Finder
        </h2>
      </div>

      <div className="rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e6007e]/30 bg-[#e6007e]/10">
          <i className="ri-global-line text-3xl text-[#e6007e]" />
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Ton adresse IP publique</p>

        {loading ? (
          <p className="mt-2 flex items-center justify-center gap-2 font-heading text-2xl font-bold text-[#3a0a26]">
            <i className="ri-loader-4-line animate-spin text-xl text-[#e6007e]" />
            Détection...
          </p>
        ) : error ? (
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#dc2626]">{error}</p>
        ) : (
          <p className="mt-2 font-heading text-3xl font-extrabold tabular-nums text-[#3a0a26]">{ip || "—"}</p>
        )}

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="mt-5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#e6007e] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#ffffff] transition-colors hover:bg-[#ff3da0] disabled:opacity-60 cursor-pointer"
        >
          {loading ? <i className="ri-loader-4-line animate-spin text-base" /> : <i className="ri-refresh-line text-base" />}
          Actualiser
        </button>
      </div>

      <div className="rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
        <p className="flex items-center gap-2 font-heading text-sm font-bold text-[#3a0a26]">
          <i className="ri-shield-check-line text-base text-[#16a34a]" />
          À quoi ça sert ?
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#8a5a76]">
          L'IP Finder affiche l'adresse que ton réseau voit actuellement. Une fois connecté à un serveur DGM TUNNEL,
          ton adresse affichée change : c'est le signe que ta connexion passe bien par le tunnel.
        </p>
      </div>
    </div>
  );
}