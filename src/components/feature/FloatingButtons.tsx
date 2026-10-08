import { useEffect, useState } from "react";
import { whatsappUrl } from "@/mocks/siteData";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Discuter sur WhatsApp"
        className="group fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-background-50 shadow-[0_0_28px_-4px_oklch(var(--primary-500)/0.85)] transition-all duration-300 hover:scale-110 hover:bg-primary-600 cursor-pointer"
      >
        <i className="ri-whatsapp-fill text-2xl" />
        <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-md border border-background-300 bg-background-100 px-3 py-1.5 font-mono text-xs text-foreground-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Discutons sur WhatsApp
        </span>
      </a>

      <button
        type="button"
        aria-label="Retour en haut"
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-primary-500/50 bg-background-100/90 text-primary-400 backdrop-blur-sm transition-all duration-300 hover:bg-primary-500 hover:text-background-50 cursor-pointer ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <i className="ri-arrow-up-line text-2xl" />
      </button>
    </>
  );
}