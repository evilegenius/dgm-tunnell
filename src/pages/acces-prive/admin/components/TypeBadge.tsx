const TYPE_STYLES: Record<string, string> = {
  VLESS: "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]",
  VMess: "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#a78bfa]",
  Trojan: "border-[#ff5470]/40 bg-[#ff5470]/10 text-[#ff5470]",
  SSH: "border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]",
  DNS: "border-[#f5b544]/40 bg-[#f5b544]/10 text-[#f5b544]",
  Shadowsocks: "border-[#2dd4bf]/40 bg-[#2dd4bf]/10 text-[#2dd4bf]",
  Hysteria2: "border-[#d946ef]/40 bg-[#d946ef]/10 text-[#d946ef]",
  Autre: "border-[#232334] bg-white/5 text-[#8b8b9e]",
};

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.Autre;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${style}`}>
      {type}
    </span>
  );
}