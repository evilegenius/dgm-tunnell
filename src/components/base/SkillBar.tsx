import { useInView } from "@/hooks/useInView";

interface SkillBarProps {
  name: string;
  level: number;
}

export default function SkillBar({ name, level }: SkillBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-foreground-700 md:text-sm">
          {name}
        </span>
        <span className="font-mono text-xs text-primary-400">{level}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background-200/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000 ease-out"
          style={{ width: inView ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  );
}