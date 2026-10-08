import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AppReleaseInfo {
  versionName: string;
  versionCode: number;
  changelog: string;
  fileName: string | null;
  fileSize: number | null;
  publishedAt: string | null;
  downloadUrl: string | null;
}

interface AppReleaseResponse {
  available: boolean;
  release: (Omit<AppReleaseInfo, "downloadUrl"> & { downloadUrl: string | null }) | null;
  downloadUrl: string | null;
}

/**
 * Récupère la dernière version publiée de l'application via le point de contrôle.
 * La page n'accède jamais aux tables directement.
 */
export function useAppRelease() {
  const [release, setRelease] = useState<AppReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke<AppReleaseResponse>("app-release");
        if (fnError) throw fnError;
        if (!active) return;
        const info = data?.release ?? null;
        setRelease(info ? { ...info, downloadUrl: data?.downloadUrl ?? info.downloadUrl ?? null } : null);
      } catch {
        if (active) setError("Impossible de charger la version de l'application.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { release, loading, error };
}