import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navLinks, brandLogo, brandMeaning } from "@/mocks/siteData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative whitespace-nowrap font-mono text-[11px] uppercase tracking-wide transition-colors cursor-pointer xl:text-xs xl:tracking-wider ${
      isActive ? "text-primary-400" : "text-foreground-600 hover:text-primary-400"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-3 font-mono text-sm uppercase tracking-wider transition-colors cursor-pointer ${
      isActive
        ? "bg-primary-500/15 text-primary-400"
        : "text-foreground-700 hover:bg-primary-500/10 hover:text-primary-400"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-background-200/70 bg-background-50/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full items-center justify-between px-4 md:h-20 md:px-8">
        <Link to="/" className="group flex items-center gap-3 cursor-pointer">
          <img
            src={brandLogo}
            alt="DGM — Dieu Génie du Mal"
            title="DGM Dieu Génie du Mal — logo"
            className="h-10 w-10 rounded-full object-cover ring-1 ring-primary-500/50 transition-transform duration-300 group-hover:scale-105 md:h-11 md:w-11"
          />
          <span className="hidden font-heading text-sm font-bold uppercase tracking-widest text-foreground-950 xl:block">
            {brandMeaning}
          </span>
        </Link>

        <ul className="hidden items-center gap-2.5 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink to={link.href} end={link.href === "/"} className={linkClass}>
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary-500 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="hidden items-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-accent-600 md:inline-flex cursor-pointer"
          >
            <i className="ri-smartphone-line text-sm" />
            Application
          </Link>
          <Link
            to="/formations"
            className="hidden whitespace-nowrap rounded-md border border-primary-500/60 bg-primary-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-400 transition-all duration-300 hover:bg-primary-500 hover:text-background-50 md:inline-flex cursor-pointer"
          >
            Rejoindre une formation
          </Link>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-background-300 text-foreground-900 transition-colors hover:border-primary-500 hover:text-primary-400 lg:hidden cursor-pointer"
          >
            <i className={menuOpen ? "ri-close-line text-xl" : "ri-menu-line text-xl"} />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="border-t border-background-200/70 bg-background-50/98 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  end={link.href === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 px-1">
              <Link
                to="/app"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-accent-500/60 bg-accent-500/10 px-4 py-3 text-center font-mono text-sm font-semibold uppercase tracking-wider text-accent-400 cursor-pointer"
              >
                <i className="ri-smartphone-line text-base" />
                Application
              </Link>
            </li>
            <li className="mt-2 px-1">
              <Link
                to="/formations"
                onClick={() => setMenuOpen(false)}
                className="block whitespace-nowrap rounded-md bg-primary-500 px-4 py-3 text-center font-mono text-sm font-semibold uppercase tracking-wider text-background-50 cursor-pointer"
              >
                Rejoindre une formation
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}