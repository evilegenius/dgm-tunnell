export interface BlogPost {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readingTime: string;
  category: string;
  cover: string;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "creer-un-bot-telegram",
    path: "/blog/creer-un-bot-telegram",
    title: "Comment créer un bot Telegram : le guide complet pour débutants",
    seoTitle: "Créer un bot Telegram : guide complet pour débutants",
    metaDescription:
      "Apprenez à créer un bot Telegram étape par étape : BotFather, choix du langage, hébergement et bonnes pratiques pour automatiser votre activité.",
    excerpt:
      "BotFather, choix du langage, hébergement et bonnes pratiques : le guide pas à pas pour créer un bot Telegram fiable, même quand on part de zéro.",
    date: "2026-10-07",
    dateLabel: "7 octobre 2026",
    readingTime: "8 min de lecture",
    category: "Bots & automatisation",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20futuristic%20chatbot%20interface%20with%20glowing%20message%20bubbles%20in%20cyan%20and%20violet%20neon%20on%20pure%20black%20background%2C%20cyberpunk%20network%20aesthetic%2C%20high%20detail%2C%20clean%20composition&width=1600&height=900&seq=dgm-blog-bot-telegram&orientation=landscape",
    author: "DGM — Dieu Génie du Mal",
  },
];