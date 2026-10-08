import { useEffect } from "react";

const SITE_URL = "https://dgm-developpeur.com";

interface SeoOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

/**
 * Gère les balises SEO propres à une page (titre, meta description, canonical, JSON-LD)
 * et restaure l'état précédent en quittant la page.
 */
export default function useSeo({ title, description, canonicalPath, jsonLd }: SeoOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionEl?.getAttribute("content") ?? "";
    const previousRobots = document.head
      .querySelector<HTMLMetaElement>('meta[name="robots"]')
      ?.getAttribute("content");

    document.title = title;
    if (descriptionEl) {
      descriptionEl.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", description);
      document.head.appendChild(meta);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? "";
    if (canonicalPath) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", `${SITE_URL}${canonicalPath}`);
    }

    let jsonLdScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.type = "application/ld+json";
      jsonLdScript.id = "page-jsonld";
      jsonLdScript.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionEl) descriptionEl.setAttribute("content", previousDescription);
      if (canonical) canonical.setAttribute("href", previousCanonical);
      if (jsonLdScript && jsonLdScript.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript);
      }
      const robotsEl = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (previousRobots && robotsEl) robotsEl.setAttribute("content", previousRobots);
    };
  }, [title, description, canonicalPath, jsonLd]);
}