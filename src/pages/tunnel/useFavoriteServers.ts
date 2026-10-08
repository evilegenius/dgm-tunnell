import { useCallback, useState } from "react";

const KEY = "dgm_tunnel_favorites";

function readFavorites(): number[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => typeof value === "number");
  } catch {
    return [];
  }
}

function writeFavorites(ids: number[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Ignoré.
  }
}

/**
 * Serveurs favoris (épinglés en haut de la liste). Persistance locale à
 * l'appareil, comme une préférence d'application.
 */
export function useFavoriteServers() {
  const [favorites, setFavorites] = useState<number[]>(() => readFavorites());

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id];
      writeFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}