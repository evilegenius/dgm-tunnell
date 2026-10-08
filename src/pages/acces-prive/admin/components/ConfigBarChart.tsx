import { useEffect, useState } from "react";

interface BarDatum {
  type: string;
  value: number;
}

interface ConfigBarChartProps {
  data: BarDatum[];
}

export default function ConfigBarChart({ data }: ConfigBarChartProps) {
  const [mounted, setMounted] = useState(false);
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    setMounted(false);
    const timer = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, [data]);

  if (total === 0) {
    return (
      <div className="flex h-52 flex-col items-center justify-center text-center">
        <i className="ri-bar-chart-2-line text-2xl text-[#3a3a52]" />
        <p className="mt-2 text-sm text-[#8b8b9e]">Aucune configuration active pour l'instant.</p>
      </div>
    );
  }

  return (
    <div className="flex h-52 items-end gap-2 sm:gap-3">
      {data.map((d, index) => {
        const height = Math.round((d.value / max) * 100);
        const isMax = d.value === max && d.value > 0;
        return (
          <div key={d.type} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className={`font-mono text-xs font-semibold ${isMax ? "text-[#00f0ff]" : "text-[#e8e8f0]"}`}>
              {d.value}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                  isMax
                    ? "bg-gradient-to-t from-[#8b5cf6]/70 to-[#00f0ff] shadow-[0_0_18px_-4px_rgba(0,240,255,0.7)]"
                    : "bg-gradient-to-t from-[#8b5cf6]/50 to-[#00f0ff]/70"
                }`}
                style={{
                  height: `${mounted ? Math.max(height, d.value === 0 ? 2 : 6) : 0}%`,
                  transitionDelay: `${index * 60}ms`,
                }}
                title={`${d.type} : ${d.value}`}
              />
            </div>
            <span className="w-full truncate text-center font-mono text-[9px] uppercase tracking-wide text-[#8b8b9e]" title={d.type}>
              {d.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}