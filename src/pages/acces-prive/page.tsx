import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/lib/supabase";
import LoginGate from "@/pages/acces-prive/components/LoginGate";
import AdminLayout from "@/pages/acces-prive/admin/AdminLayout";

export default function AccesPrive() {
  const { loading, session, isAdmin } = useAdminAuth();

  // Page cachée : jamais indexée par les moteurs de recherche.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "DGM TUNNEL Admin";

    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow, noarchive");
    meta.setAttribute("data-admin-noindex", "true");
    document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center">
          <i className="ri-loader-4-line animate-spin text-3xl text-[#00f0ff]" />
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#8b8b9e]">
            Vérification de l'accès...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginGate />;
  }

  if (!isAdmin) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.12),transparent_60%)]" />
        <div className="relative w-full max-w-md rounded-xl border border-[#ff5470]/40 bg-[#12121b] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#ff5470]/40 bg-[#ff5470]/10">
            <i className="ri-forbid-2-line text-2xl text-[#ff5470]" />
          </div>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wide text-[#e8e8f0]">
            Accès refusé
          </h1>
          <p className="mt-2 text-sm text-[#8b8b9e]">
            Cette zone est strictement réservée. Ton compte n'est pas autorisé à accéder au panel.
          </p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="mt-6 inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[#ff5470]/50 bg-[#ff5470]/15 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/25 cursor-pointer"
          >
            <i className="ri-logout-box-r-line text-base" />
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return <AdminLayout session={session} onLogout={() => supabase.auth.signOut()} />;
}