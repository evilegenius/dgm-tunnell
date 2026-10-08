import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
}

/** Effet "pluie de caractères" façon salle des machines (canvas). */
export default function MatrixRain({ className = "" }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = "0123456789ABCDEF<>/\\|@#$%&*+=アカサタナ".split("");
    const fontSize = 16;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = new Array(columns).fill(0).map(() => Math.random() * -60);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 58) return;
      last = now;

      ctx.fillStyle = "rgba(10, 10, 15, 0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.965 ? "#a78bfa" : "#00f0ff";
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}