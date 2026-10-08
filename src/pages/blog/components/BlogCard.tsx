import { Link } from "react-router-dom";
import type { BlogPost } from "@/mocks/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-background-200/80 bg-background-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-500/60 hover:shadow-[0_0_45px_-12px_oklch(var(--primary-500)/0.7)]">
      <Link to={post.path} className="relative block h-52 w-full overflow-hidden cursor-pointer">
        <img
          src={post.cover}
          alt={post.title}
          title={`${post.title} — DGM blog`}
          className="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-100 via-background-100/20 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary-500/50 bg-primary-500/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary-300 backdrop-blur-sm">
          <i className="ri-robot-2-line text-xs" />
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-foreground-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-calendar-line text-primary-500" />
            {post.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-time-line text-accent-400" />
            {post.readingTime}
          </span>
        </div>

        <h2 className="mt-3 font-heading text-lg font-bold leading-snug text-foreground-950">
          <Link to={post.path} className="transition-colors hover:text-primary-400 cursor-pointer">
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-600">{post.excerpt}</p>

        <Link
          to={post.path}
          className="mt-5 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary-400 cursor-pointer"
        >
          Lire l'article
          <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}