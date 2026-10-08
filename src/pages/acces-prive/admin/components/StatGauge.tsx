interface StatGaugeProps {
  percent: number;
  value: string;
  label: string;
  icon: string;
  color: string;
}

/** Jauge circulaire (conic-gradient, sans SVG) pour visualiser un ratio. */
export default function StatGauge({ percent, value, label, icon, color }: StatGaugeProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-700"
        style={{ background: `conic-gradient(${color} ${clamped * 3.6}deg, rgba(255,255,255,0.06) 0deg)` }}
      >
        <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-[#0f0f17]">
          <i className={`${icon} text-base`} style={{ color }} />
          <span className="mt-1 font-heading text-lg font-bold text-[#e8e8f0]">{value}</span>
        </div>
      </div>
      <span className="max-w-[7rem] text-center font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e]">
        {label}
      </span>
    </div>
  );
}