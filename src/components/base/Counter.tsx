import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function Counter({ value, suffix = "", duration = 1800, className = "" }: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}