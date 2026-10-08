import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallPlatform = "ios" | "android" | "desktop";
export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const displayMode = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return displayMode || iosStandalone;
}

/**
 * Gère l'installation de l'application sur le téléphone (PWA).
 * - `canInstall` : le navigateur propose une installation native en un clic.
 * - `installed` : l'application tourne déjà en mode installé (plein écran).
 * - `platform` : sert à afficher les bonnes instructions manuelles.
 */
export function usePwaInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState<boolean>(detectStandalone());
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else if (/android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");
  }, []);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferred) return "unavailable";
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === "accepted") {
        setInstalled(true);
        return "accepted";
      }
      return "dismissed";
    } catch {
      return "unavailable";
    }
  }, [deferred]);

  return { canInstall: deferred !== null, installed, platform, promptInstall };
}