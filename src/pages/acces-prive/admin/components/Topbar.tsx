import NotificationsMenu from "@/pages/acces-prive/admin/components/NotificationsMenu";

interface TopbarProps {
  title: string;
  email: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export default function Topbar({ title, email, onLogout, onToggleSidebar, onOpenSearch }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#232334] adm-glass px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#232334] text-[#e8e8f0] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] lg:hidden cursor-pointer"
        >
          <i className="ri-menu-line text-lg" />
        </button>
        <h1 className="truncate font-heading text-base font-bold uppercase tracking-wider text-[#e8e8f0] md:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden items-center gap-2 whitespace-nowrap rounded-lg border border-[#232334] bg-[#0d0d14] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] sm:flex cursor-pointer"
        >
          <i className="ri-search-line text-base" />
          Rechercher
          <kbd className="rounded border border-[#232334] px-1.5 py-0.5 text-[9px] text-[#5a5a6e]">Ctrl K</kbd>
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Rechercher"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#232334] text-[#c3c3d4] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] sm:hidden cursor-pointer"
        >
          <i className="ri-search-line text-lg" />
        </button>

        <NotificationsMenu />

        <div className="hidden items-center gap-2 rounded-full border border-[#232334] bg-[#12121b] px-3 py-1.5 lg:flex">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b5cf6]/15">
            <i className="ri-user-3-line text-xs text-[#a78bfa]" />
          </span>
          <span className="max-w-[180px] truncate font-mono text-[11px] text-[#c7c7d6]">{email}</span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#232334] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#ff5470]/50 hover:text-[#ff5470] cursor-pointer"
        >
          <i className="ri-logout-box-r-line text-base" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}