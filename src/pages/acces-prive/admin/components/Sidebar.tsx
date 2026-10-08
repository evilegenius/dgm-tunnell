import { NavLink } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "@/pages/acces-prive/admin/navItems";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#232334] adm-glass-strong transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex items-center justify-between gap-3 overflow-hidden border-b border-[#232334] px-4 py-4">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#00f0ff]/10 blur-[70px]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 adm-glow-primary">
              <i className="ri-shield-keyhole-line text-xl text-[#00f0ff]" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-wider text-[#e8e8f0]">
                DGM <span className="adm-gradient-text">TUNNEL</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a78bfa]">Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#232334] text-[#8b8b9e] transition-colors hover:text-[#e8e8f0] lg:hidden cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <nav className="adm-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#00f0ff]/10 text-[#00f0ff] adm-glow-primary"
                    : "text-[#8b8b9e] hover:bg-white/5 hover:text-[#e8e8f0]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#00f0ff] to-[#8b5cf6]" />
                  ) : null}
                  <i className={`${item.icon} text-base transition-transform duration-200 group-hover:scale-110`} />
                  <span className="truncate">{item.label}</span>
                  {isActive ? <i className="ri-arrow-right-s-line ml-auto text-sm" /> : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#232334] px-4 py-4">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#232334] bg-[#0d0d14] px-3 py-2.5">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 rounded-full bg-[#34d399]/60 animate-ping" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#34d399]">Système opérationnel</p>
              <p className="font-mono text-[9px] text-[#5a5a6e]">Console de gestion sécurisée</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}