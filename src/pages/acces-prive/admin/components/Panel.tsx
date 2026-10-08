import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Panel({ title, icon, action, children, className = "", bodyClassName = "" }: PanelProps) {
  return (
    <section className={`adm-lift group/panel relative overflow-hidden rounded-2xl border border-[#232334] adm-glass hover:border-[#00f0ff]/30 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover/panel:opacity-100" />
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-[#232334] px-4 py-3.5 md:px-5">
          <div className="flex items-center gap-2.5">
            {icon ? (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10">
                <i className={`${icon} text-base text-[#00f0ff]`} />
              </span>
            ) : null}
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e8e8f0]">{title}</h2>
          </div>
          {action}
        </header>
      ) : null}
      <div className={`p-4 md:p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}