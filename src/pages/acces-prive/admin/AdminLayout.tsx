import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Sidebar from "@/pages/acces-prive/admin/components/Sidebar";
import Topbar from "@/pages/acces-prive/admin/components/Topbar";
import AdminBackdrop from "@/pages/acces-prive/admin/components/AdminBackdrop";
import CommandPalette from "@/pages/acces-prive/admin/components/CommandPalette";
import { ADMIN_NAV_ITEMS } from "@/pages/acces-prive/admin/navItems";

interface AdminLayoutProps {
  session: Session;
  onLogout: () => void;
}

export default function AdminLayout({ session, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();

  const title = useMemo(() => {
    const sorted = [...ADMIN_NAV_ITEMS].sort((a, b) => b.to.length - a.to.length);
    const match = sorted.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0f] text-[#e8e8f0]">
      <AdminBackdrop />
      <div className="relative z-10">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-64">
          <Topbar
            title={title}
            email={session.user.email ?? ""}
            onLogout={onLogout}
            onToggleSidebar={() => setSidebarOpen(true)}
            onOpenSearch={() => setPaletteOpen(true)}
          />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <div key={pathname} className="adm-fade-up">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}