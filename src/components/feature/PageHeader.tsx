import { Link } from "react-router-dom";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative w-full overflow-hidden border-b border-background-200/60 bg-background-100 pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="cyber-grid absolute inset-0 opacity-35" />
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary-500/15 blur-[120px]" />
      <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent-500/15 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground-500">
          <Link to="/" className="transition-colors hover:text-primary-400 cursor-pointer">
            Accueil
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="text-primary-400">{eyebrow}</span>
        </nav>

        <span className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
          <span className="h-px w-6 bg-primary-500" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-foreground-950 md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground-600 md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}