import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "@/pages/acces-prive/admin/navItems";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ADMIN_NAV_ITEMS;
    return ADMIN_NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        item.to.toLowerCase().includes(term)
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const go = (to: string) => {
    navigate(to);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) go(target.to);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[#232334] adm-glass-strong adm-glow-primary adm-fade-up">
        <div className="flex items-center gap-3 border-b border-[#232334] px-4 py-3.5">
          <i className="ri-search-line text-lg text-[#00f0ff]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une section, une action..."
            className="w-full bg-transparent text-sm text-[#e8e8f0] outline-none placeholder:text-[#5a5a6e]"
          />
          <kbd className="hidden whitespace-nowrap rounded-md border border-[#232334] bg-[#0d0d14] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#5a5a6e] sm:block">
            Échap
          </kbd>
        </div>

        <div className="adm-scroll max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <i className="ri-search-eye-line text-2xl text-[#3a3a52]" />
              <p className="mt-2 text-sm text-[#8b8b9e]">Aucune section trouvée.</p>
            </div>
          ) : (
            results.map((item, index) => (
              <button
                key={item.to}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(item.to)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  index === activeIndex ? "bg-[#00f0ff]/10" : "hover:bg-white/5"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    index === activeIndex
                      ? "border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]"
                      : "border-[#232334] bg-white/5 text-[#c3c3d4]"
                  }`}
                >
                  <i className={`${item.icon} text-base`} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-sm font-semibold text-[#e8e8f0]">{item.label}</span>
                  <span className="block font-mono text-[10px] text-[#5a5a6e]">{item.to}</span>
                </span>
                <i className="ri-arrow-right-line text-sm text-[#5a5a6e]" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}