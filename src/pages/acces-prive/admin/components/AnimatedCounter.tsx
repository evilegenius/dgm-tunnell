import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

/** Compteur qui s'anime vers sa valeur cible (easing cubique). */
export default function AnimatedCounter({ value, duration = 900, className = "", format }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = fromRef.current;
    const diff = value - from;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + diff * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const shown = Number.isInteger(value) ? Math.round(display) : Math.round(display * 10) / 10;
  return <span className={className}>{format ? format(shown) : shown}</span>;
}