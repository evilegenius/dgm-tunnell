import { useCallback, useEffect, useState } from "react";
import type { TunnelData } from "@/pages/tunnel/lib";
import { clearSavedToken, getSavedToken, loginWithToken, saveToken } from "@/pages/tunnel/lib";
import LoginScreen from "@/pages/tunnel/components/LoginScreen";
import AppShell from "@/pages/tunnel/components/AppShell";
import TunnelBackdrop from "@/pages/tunnel/components/TunnelBackdrop";

export default function TunnelPage() {
  const [data, setData] = useState<TunnelData | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");

  // Titre + couleur de thème propres à l'application (PWA).
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "DGM TUNNEL — Celui qui demeure";

    const meta = document.querySelector('meta[name="theme-color"]');
    const previousColor = meta ? meta.getAttribute("content") : null;
    if (meta) meta.setAttribute("content", "#e6007e");

    return () => {
      document.title = previousTitle;
      if (meta && previousColor) meta.setAttribute("content", previousColor);
    };
  }, []);

  // Reconnexion automatique si un jeton est mémorisé.
  useEffect(() => {
    let active = true;
    const saved = getSavedToken();
    if (!saved) {
      setBooting(false);
      return () => {
        active = false;
      };
    }
    (async () => {
      const result = await loginWithToken(saved);
      if (!active) return;
      if (result.ok) {
        setData(result.data);
      } else {
        clearSavedToken();
        setError(result.message);
      }
      setBooting(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleConnect = useCallback(async (code: string): Promise<boolean> => {
    setConnecting(true);
    setError("");
    const result = await loginWithToken(code);
    setConnecting(false);
    if (!result.ok) {
      setError(result.message);
      return false;
    }
    saveToken(code);
    setData(result.data);
    return true;
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!data) return;
    setUpdating(true);
    const result = await loginWithToken(data.token.code);
    setUpdating(false);
    if (!result.ok) {
      // Jeton expiré ou bloqué : retour à l'écran de connexion avec le message.
      clearSavedToken();
      setData(null);
      setError(result.message);
      return;
    }
    setData(result.data);
  }, [data]);

  const handleQuit = useCallback(() => {
    clearSavedToken();
    setData(null);
    setError("");
  }, []);

  if (booting) {
    return (
      <TunnelBackdrop>
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[#e6007e]/10 blur-2xl" aria-hidden="true" />
            <img
              src="https://readdy.ai/api/search-image?query=app%20icon%20with%20bold%20glowing%20neon%20letters%20DGM%20in%20cyan%20and%20violet%20on%20pure%20black%20background%2C%20centered%2C%20minimal%2C%20high%20contrast%2C%20clean%20sharp%20edges%2C%20square%20format%2C%20dark%20cyber%20tech%20aesthetic&width=512&height=512&seq=dgm-pwa-icon-512&orientation=squarish"
              alt="DGM TUNNEL"
              title="DGM TUNNEL"
              className="relative h-24 w-24 rounded-3xl border border-[#f7cfe3] object-cover"
            />
          </div>

          <h1 className="mt-6 font-heading text-2xl font-extrabold uppercase tracking-wider text-[#3a0a26]">
            DGM <span className="text-[#e6007e]">TUNNEL</span>
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#d63384]">
            Celui qui demeure
          </p>

          <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-[#f7cfe3]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#c026d3] to-[#e6007e]" />
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#9b6b86]">
            <i className="ri-loader-4-line animate-spin text-sm text-[#e6007e]" />
            Vérification du jeton...
          </p>
        </div>
      </TunnelBackdrop>
    );
  }

  if (!data) {
    return <LoginScreen onConnect={handleConnect} connecting={connecting} error={error} />;
  }

  return (
    <TunnelBackdrop>
      <AppShell data={data} updating={updating} onUpdate={handleUpdate} onQuit={handleQuit} />
    </TunnelBackdrop>
  );
}