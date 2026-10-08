import AnimatedCounter from "@/pages/acces-prive/admin/components/AnimatedCounter";

export type StatTone = "cyan" | "violet" | "amber" | "rose" | "emerald" | "neutral";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  tone?: StatTone;
  hint?: string;
}

const TONES: Record<StatTone, { text: string; bg: string; border: string; bar: string; glow: string }> = {
  cyan: {
    text: "text-[#00f0ff]",
    bg: "bg-[#00f0ff]/10",
    border: "border-[#00f0ff]/30",
    bar: "from-[#00f0ff] to-[#8b5cf6]",
    glow: "hover:border-[#00f0ff]/40",
  },
  violet: {
    text: "text-[#a78bfa]",
    bg: "bg-[#8b5cf6]/10",
    border: "border-[#8b5cf6]/30",
    bar: "from-[#8b5cf6] to-[#d946ef]",
    glow: "hover:border-[#8b5cf6]/40",
  },
  amber: {
    text: "text-[#f5b544]",
    bg: "bg-[#f5b544]/10",
    border: "border-[#f5b544]/30",
    bar: "from-[#f5b544] to-[#ff5470]",
    glow: "hover:border-[#f5b544]/40",
  },
  rose: {
    text: "text-[#ff5470]",
    bg: "bg-[#ff5470]/10",
    border: "border-[#ff5470]/30",
    bar: "from-[#ff5470] to-[#8b5cf6]",
    glow: "hover:border-[#ff5470]/40",
  },
  emerald: {
    text: "text-[#34d399]",
    bg: "bg-[#34d399]/10",
    border: "border-[#34d399]/30",
    bar: "from-[#34d399] to-[#00f0ff]",
    glow: "hover:border-[#34d399]/40",
  },
  neutral: {
    text: "text-[#c3c3d4]",
    bg: "bg-white/5",
    border: "border-[#232334]",
    bar: "from-[#5a5a6e] to-[#8b8b9e]",
    glow: "hover:border-[#3a3a52]",
  },
};

export default function StatCard({ label, value, icon, tone = "cyan", hint }: StatCardProps) {
  const t = TONES[tone];
  const numeric = typeof value === "number";

  return (
    <div className={`adm-lift group/stat relative overflow-hidden rounded-2xl border border-[#232334] adm-glass p-4 md:p-5 ${t.glow}`}>
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${t.bar} opacity-70`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">{label}</p>
          <p className="mt-2 font-heading text-2xl font-bold text-[#e8e8f0] md:text-3xl">
            {numeric ? <AnimatedCounter value={value as number} /> : value}
          </p>
          {hint ? <p className="mt-1 truncate text-[11px] text-[#5a5a6e]">{hint}</p> : null}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/stat:scale-110 ${t.border} ${t.bg}`}
        >
          <i className={`${icon} text-xl ${t.text}`} />
        </div>
      </div>
    </div>
  );
}