import { Link } from "react-router-dom";

export default function StoreTopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#232334]/80 bg-[#0a0a0f]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#232334] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
        >
          <i className="ri-arrow-left-line text-base" />
          Retour au site
        </Link>
        <span className="truncate font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#e8e8f0]">
          DGM TUNNEL
        </span>
        <Link
          to="/app"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff] transition-colors hover:bg-[#00f0ff]/20 cursor-pointer"
          aria-label="Ouvrir l'application"
          title="Ouvrir l'application"
        >
          <i className="ri-external-link-line text-base" />
        </Link>
      </div>
    </header>
  );
}