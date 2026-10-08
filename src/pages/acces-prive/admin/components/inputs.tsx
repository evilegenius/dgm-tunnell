import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const BASE =
  "w-full rounded-lg border border-[#232334] bg-[#0d0d14] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none transition-colors placeholder:text-[#5a5a6e] focus:border-[#00f0ff]";

interface FieldLabelProps {
  children: ReactNode;
  hint?: string;
}

export function FieldLabel({ children, hint }: FieldLabelProps) {
  return (
    <span className="mb-1.5 flex items-center justify-between gap-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-[#8b8b9e]">{children}</span>
      {hint ? <span className="text-[10px] text-[#5a5a6e]">{hint}</span> : null}
    </span>
  );
}

export function AdminInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${BASE} ${className}`} {...props} />;
}

export function AdminTextarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${BASE} resize-y ${className}`} {...props} />;
}

export function AdminSelect({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${BASE} appearance-none ${className}`} {...props}>
      {children}
    </select>
  );
}