import { Link } from "react-router-dom";
import { navLinks, socials, brandMeaning } from "@/mocks/siteData";

const serviceLinks = [
  { label: "Création de sites web", href: "/services" },
  { label: "Applications web & mobile", href: "/services" },
  { label: "Audit & sécurisation", href: "/services" },
  { label: "Bots & automatisation", href: "/services" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-background-200/70 bg-background-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary-500/50 bg-primary-500/10 font-heading text-xs font-bold text-primary-400">
                DGM
              </span>
              <span className="font-heading text-sm font-bold uppercase tracking-widest text-foreground-950">
                {brandMeaning}
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-foreground-600">
              Développeur &amp; formateur tech. Je construis des solutions digitales et je transmets les
              compétences pour maîtriser le code, la sécurité et l'automatisation.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-background-300 text-foreground-600 transition-all duration-300 hover:border-primary-500 hover:text-primary-400 cursor-pointer"
                >
                  <i className={`${social.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground-950">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-600 transition-colors hover:text-primary-400 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground-950">
              Services
            </h4>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-600 transition-colors hover:text-primary-400 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground-950">
              Contact
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground-600">
              <li className="flex items-start gap-3">
                <i className="ri-mail-send-line mt-0.5 text-primary-500" />
                <span>contact@dgm-developpeur.com</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-phone-line mt-0.5 text-primary-500" />
                <span>+33 6 12 34 56 78</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-map-pin-line mt-0.5 text-primary-500" />
                <span>Paris, France</span>
              </li>
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-background-50 transition-colors hover:bg-primary-600 cursor-pointer"
            >
              Démarrer un projet
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-background-200/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:text-left md:px-8">
          <p className="font-mono text-xs text-foreground-600">
            © {year} DGM — Dieu Génie du Mal · Celui Qui Demeure. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              to="/mentions-legales"
              className="font-mono text-xs text-foreground-600 transition-colors hover:text-primary-400 cursor-pointer"
            >
              Mentions légales &amp; CGU
            </Link>
            <span className="font-mono text-xs text-foreground-500">Conçu &amp; codé avec expertise.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}