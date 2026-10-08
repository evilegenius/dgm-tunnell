import { Link } from "react-router-dom";
import type { TunnelData } from "@/pages/tunnel/lib";
import { formatDate } from "@/pages/tunnel/lib";

interface SubscriptionScreenProps {
  data: TunnelData;
  onBack: () => void;
}

export default function SubscriptionScreen({ data, onBack }: SubscriptionScreenProps) {
  const remainingDays = data.token.remaining_days;
  const expired = remainingDays !== null && remainingDays <= 0;

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
          <i className="ri-vip-crown-2-line text-base text-[#e6007e]" />
          Abonnement
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#f7cfe3] bg-[#fff5fa]">
        <div className="border-b border-[#f7cfe3] bg-gradient-to-r from-[#c026d3]/15 to-[#e6007e]/15 p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#d63384]">Statut de ton accès</p>
          <p className={`mt-1 font-heading text-2xl font-extrabold ${expired ? "text-[#dc2626]" : "text-[#e6007e]"}`}>
            {expired ? "Expiré" : remainingDays === null ? "Illimité" : "Actif"}
          </p>
        </div>

        <div className="divide-y divide-[#f7cfe3]">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Jeton</span>
            <span className="font-mono text-sm text-[#3a0a26]">{data.token.code}</span>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Jours restants</span>
            <span className="font-heading text-sm font-bold text-[#3a0a26]">
              {remainingDays === null ? "Illimité" : `${remainingDays} jour${remainingDays > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Date d'expiration</span>
            <span className="font-heading text-sm font-bold text-[#3a0a26]">{formatDate(data.expires_at)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Serveurs inclus</span>
            <span className="font-heading text-sm font-bold text-[#3a0a26]">{data.countries.length} pays</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#c026d3]/30 bg-[#c026d3]/10 p-4">
        <p className="flex items-center gap-2 font-heading text-sm font-bold text-[#3a0a26]">
          <i className="ri-information-line text-base text-[#d63384]" />
          Renouveler ton accès
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#6b3651]">
          Pour prolonger ou réactiver ton jeton, contacte le support. Indique ton jeton actuel pour un renouvellement
          rapide.
        </p>
        <Link
          to="/contact"
          className="mt-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#e6007e] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#ffffff] transition-colors hover:bg-[#ff3da0] cursor-pointer"
        >
          <i className="ri-customer-service-2-line text-base" />
          Contacter le support
        </Link>
      </div>
    </div>
  );
}