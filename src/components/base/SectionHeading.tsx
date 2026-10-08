interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} max-w-2xl`}>
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-primary-500">
        <span className="h-px w-6 bg-primary-500" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-foreground-600 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}