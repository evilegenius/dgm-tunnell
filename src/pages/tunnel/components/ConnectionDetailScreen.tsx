import type { TunnelConfig } from "@/pages/tunnel/lib";
import type { VpnServer } from "@/hooks/useVpnConnection";

interface ConnectionDetailScreenProps {
  server: VpnServer | null;
  config: TunnelConfig | null;
  connected: boolean;
  onBack: () => void;
}

export default function ConnectionDetailScreen(props: ConnectionDetailScreenProps) {
  const { server, connected, onBack } = props;

  const rows: { key: string; label: string; value: string; icon: string }[] = [
    {
      key: "location",
      label: "Localisation",
      value: server ? `${server.flag} ${server.country}` : "—",
      icon: "ri-map-pin-line",
    },
    {
      key: "protocol",
      label: "Protocole",
      value: server?.type ?? "—",
      icon: "ri-shield-keyhole-line",
    },
  ];

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
          <i className="ri-information-line text-base text-[#e6007e]" />
          Détails de connexion
        </h2>
      </div>

      <div
        className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
          connected ? "border-[#16a34a]/40 bg-[#16a34a]/10" : "border-[#f7cfe3] bg-[#fff5fa]"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              connected
                ? "border-[#16a34a]/40 bg-[#16a34a]/15 text-[#16a34a]"
                : "border-[#f7cfe3] bg-black/5 text-[#9b6b86]"
            }`}
          >
            <i className={`${connected ? "ri-shield-check-line" : "ri-shield-line"} text-xl`} />
          </span>
          <div>
            <p className={`font-heading text-sm font-bold uppercase tracking-wider ${connected ? "text-[#16a34a]" : "text-[#9b6b86]"}`}>
              {connected ? "Sécurisé" : "Non sécurisé"}
            </p>
            <p className="font-mono text-[10px] text-[#b98aa6]">
              {connected ? "Ta connexion est chiffrée" : "Le tunnel n'est pas actif"}
            </p>
          </div>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${connected ? "animate-pulse bg-[#16a34a]" : "bg-[#edb8d3]"}`} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#f7cfe3] bg-[#fff5fa]">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-center gap-3 px-4 py-3.5 ${index > 0 ? "border-t border-[#f7cfe3]" : ""}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#f7cfe3] bg-black/5 text-[#6b3651]">
              <i className={`${row.icon} text-base`} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">{row.label}</p>
              <p className="truncate font-heading text-sm font-semibold text-[#3a0a26]">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">
          <i className="ri-lock-2-line text-sm" />
          Configuration protégée
        </p>
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-[#f7cfe3] bg-[#ffffff] p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e6007e]/30 bg-[#e6007e]/10 text-[#e6007e]">
            <i className="ri-shield-keyhole-line text-lg" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-sm tracking-[0.3em] text-[#9b6b86]">••••••••••••••••</p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-[#b98aa6]">
              L'adresse et le lien de configuration sont masqués et non copiables. Ta connexion reste sécurisée via ton
              jeton.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}