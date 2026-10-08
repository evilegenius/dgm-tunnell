import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const glyphs = "01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF#$%&";
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];
    let animationId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -40);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.10)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns; i += 1) {
        const char = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.96 ? "rgba(0, 240, 255, 0.85)" : "rgba(139, 92, 246, 0.35)";
        ctx.fillText(char, x, y);

        if (y > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }

      animationId = window.requestAnimationFrame(draw);
    };

    resize();
    if (prefersReduced) {
      ctx.fillStyle = "rgba(10, 10, 15, 1)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    } else {
      draw();
    }

    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
    />
  );
}