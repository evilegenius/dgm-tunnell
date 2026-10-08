import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Remet automatiquement la page en haut lors d'un changement de route.
 * Le comportement "instant" évite un défilement visible pendant la transition.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}