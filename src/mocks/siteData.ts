export const brandLogo =
  "https://static.readdy.ai/image/955995e7a014b9d13b5d3fbb3a5e2aef/245c991ed11877daaebad6c9d6ba21fd.png";

export const aboutPortrait =
  "https://storage.helloreaddy.io/project_files/5a0f2ce3-9f2f-454e-8184-977567c9c3bb/d876b14a-4040-4d2a-b39f-bff4f3c98c18_compressed_4900_11.webp";

export const heroBackground =
  "https://static.readdy.ai/image/955995e7a014b9d13b5d3fbb3a5e2aef/3c4279990bc5202043fb96e8a439ce2d.jpeg";

export const brandName = "DGM";
export const brandMeaning = "Dieu Génie du Mal";
export const brandMotto = "Celui Qui Demeure";

export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Formations", href: "/formations" },
  { label: "Services", href: "/services" },
  { label: "Projets", href: "/projets" },
  { label: "Mes sites web", href: "/sites-web" },
  { label: "Témoignages", href: "/temoignages" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const heroTagline =
  "Je transforme les passionnés en experts. Apprends à coder, sécuriser et créer.";

export const heroTypingPhrases = [
  "Développeur",
  "Formateur",
  "Expert en cybersécurité",
  "Créateur de bots & panels",
];

export const stats = [
  { value: 1200, suffix: "+", label: "Élèves formés" },
  { value: 150, suffix: "+", label: "Projets réalisés" },
  { value: 8, suffix: "", label: "Formations au catalogue" },
  { value: 8, suffix: " ans", label: "D'expérience" },
];

export const skillTags = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "PHP",
  "Laravel",
  "Cybersécurité",
  "Pentest",
  "Bots Discord",
  "Bots Telegram",
  "Panels d'admin",
  "APIs REST",
  "Bases de données",
  "Docker",
  "Linux",
];

export const aboutHighlights = [
  {
    icon: "ri-shield-keyhole-line",
    title: "Hacking éthique",
    description:
      "Tests d'intrusion, audit de vulnérabilités et sécurisation d'applications, en toute légalité et avec rigueur.",
  },
  {
    icon: "ri-code-s-slash-line",
    title: "Développement full-stack",
    description:
      "Sites web, applications et panels d'administration robustes, pensés pour la performance et l'évolutivité.",
  },
  {
    icon: "ri-robot-2-line",
    title: "Bots & automatisation",
    description:
      "Bots intelligents pour Discord, Telegram et autres plateformes, pour automatiser et faire gagner du temps.",
  },
  {
    icon: "ri-graduation-cap-line",
    title: "Formation & transmission",
    description:
      "Des parcours clairs, pratiques et progressifs pour te rendre autonome, du zéro jusqu'au niveau pro.",
  },
];

export const aboutParagraphs = [
  "Je suis DGM — « Dieu Génie du Mal », autrement dit « celui qui demeure ». Ce nom, c'est ma promesse : je ne lâche jamais. Chaque bug, chaque erreur, chaque nuit blanche devant un terminal m'a appris quelque chose.",
  "Je construis mes propres outils : des bots Telegram, des panels d'administration, des applications Android et des systèmes de gestion de serveurs. Je ne suis pas là pour te vendre du rêve, je suis là pour te montrer le chemin réel, étape par étape, avec les vraies erreurs et les vraies solutions.",
  "Ma mission : rendre la programmation et la cybersécurité accessibles à tous, même à ceux qui partent de zéro.",
];

export const aboutQuote = {
  text: "Celui qui demeure finit toujours par construire.",
  author: "DGM — Dieu Génie du Mal · Celui qui demeure",
};

export const skills = [
  { name: "Python", level: 92 },
  { name: "JavaScript", level: 90 },
  { name: "Développement web", level: 95 },
  { name: "Bots Telegram", level: 88 },
  { name: "Panels d'administration", level: 90 },
  { name: "Cybersécurité", level: 85 },
  { name: "Linux / Serveurs", level: 87 },
  { name: "Applications mobiles", level: 80 },
];

export const values = [
  {
    icon: "ri-anchor-line",
    title: "Persévérance",
    description:
      "On apprend en essayant, en échouant, puis en réussissant. Chaque obstacle est une leçon, jamais une fin.",
  },
  {
    icon: "ri-tools-line",
    title: "Pratique avant tout",
    description:
      "Chaque formation se fait sur de vrais projets. On code, on casse, on répare — on ne reste jamais dans la théorie.",
  },
  {
    icon: "ri-shield-check-line",
    title: "Éthique",
    description:
      "La cybersécurité sert à protéger, jamais à nuire. On apprend à défendre, dans le respect de la loi et des autres.",
  },
];

export const courseCategories = [
  "Tous",
  "Programmation",
  "Web",
  "Bots",
  "Sécurité",
  "Mobile",
  "Coaching",
];

export interface ProgramBlock {
  title: string;
  items: string[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: string;
  popular: boolean;
  icon: string;
  description: string;
  cover: string;
  program: ProgramBlock[];
  prerequisites: string[];
  outcomes: string[];
  trainer: string;
  faq: { question: string; answer: string }[];
  result?: string;
  legalNote?: string;
}

export const courses: Course[] = [
  {
    id: "programmation-de-a-a-z",
    title: "Programmation pour débutants (Python)",
    category: "Programmation",
    level: "Débutant",
    duration: "10 semaines",
    price: "390 €",
    popular: true,
    icon: "ri-code-s-slash-line",
    description:
      "Pars de zéro et apprends à programmer en Python, à travers des projets concrets et progressifs, jusqu'à ton premier programme complet.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20abstract%20code%20editor%20screen%20with%20glowing%20cyan%20syntax%20highlighting%20on%20black%20background%20cyberpunk%20developer%20aesthetic%20cinematic%20high%20detail&width=1200&height=700&seq=dgm-cover-programmation&orientation=landscape",
    program: [
      { title: "Installer son environnement (Python, éditeur, terminal)", items: [] },
      { title: "Variables, conditions, boucles", items: [] },
      { title: "Fonctions, listes, dictionnaires", items: [] },
      { title: "Lire et écrire des fichiers, gérer les erreurs", items: [] },
      { title: "Premier mini-projet (ex : un petit programme de gestion)", items: [] },
    ],
    result: "L'élève sait écrire et comprendre un programme complet.",
    prerequisites: ["Aucune connaissance requise", "Un ordinateur standard et une connexion internet", "De la motivation et de la régularité"],
    outcomes: [
      "Écrire des programmes clairs en Python et JavaScript",
      "Résoudre des problèmes par l'algorithmique",
      "Automatiser des tâches du quotidien",
      "Poser des bases solides pour te spécialiser",
    ],
    trainer:
      "DGM — développeur et formateur depuis plus de 8 ans, spécialisé en full-stack, sécurité et automatisation.",
    faq: [
      { question: "Faut-il un ordinateur puissant ?", answer: "Non, un ordinateur récent standard suffit largement pour toute la formation." },
      { question: "Combien d'heures par semaine ?", answer: "Compte environ 5 à 7 heures par semaine pour progresser sereinement." },
      { question: "Y a-t-il une attestation ?", answer: "Oui, une attestation de fin de formation est délivrée après le projet final." },
    ],
  },
  {
    id: "creation-de-sites-web",
    title: "Création de sites web (HTML, CSS, JS, React)",
    category: "Web",
    level: "Débutant à intermédiaire",
    duration: "12 semaines",
    price: "450 €",
    popular: false,
    icon: "ri-global-line",
    description:
      "Conçois des sites modernes, responsives et animés, du design jusqu'à la mise en ligne sur ton propre domaine.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20modern%20website%20design%20mockup%20on%20floating%20screens%20with%20neon%20cyan%20and%20purple%20accents%20black%20background%20cyber%20aesthetic%20high%20detail&width=1200&height=700&seq=dgm-cover-webdev&orientation=landscape",
    program: [
      {
        title: "Les bases du web",
        items: ["HTML sémantique & accessibilité", "CSS moderne & Tailwind CSS", "Flexbox, Grid & responsive design"],
      },
      {
        title: "Interactivité",
        items: ["JavaScript du navigateur", "Animations & transitions fluides", "Formulaires & validation"],
      },
      {
        title: "React",
        items: ["Composants, props & état", "Routing & structure de projet", "Consommation d'API"],
      },
      {
        title: "Mise en ligne",
        items: ["Nom de domaine & hébergement", "Performances & SEO de base", "Projet de site complet en production"],
      },
    ],
    prerequisites: ["Bases de l'informatique", "Aucune expérience en développement nécessaire", "Savoir lire l'anglais technique (niveau basique)"],
    outcomes: [
      "Créer un site complet du design à la mise en ligne",
      "Rendre une interface responsive sur tous les écrans",
      "Construire des composants réutilisables avec React",
      "Publier et maintenir ton site en autonomie",
    ],
    trainer:
      "DGM — plus de 150 sites et applications livrés, avec un focus sur le design et la performance.",
    faq: [
      { question: "Dois-je savoir dessiner ?", answer: "Non, on travaille avec des maquettes et des systèmes de composants simples à reproduire." },
      { question: "Puis-je vendre des sites après ?", answer: "Oui, c'est un objectif courant : à la fin, tu sais créer et facturer des sites clients." },
      { question: "Quel éditeur de code utilise-t-on ?", answer: "Visual Studio Code, le standard du métier, que nous configurons ensemble." },
    ],
  },
  {
    id: "creation-de-bots",
    title: "Création de bots Telegram",
    category: "Bots",
    level: "Débutant à intermédiaire",
    duration: "8 semaines",
    price: "420 €",
    popular: false,
    icon: "ri-robot-2-line",
    description:
      "Apprends à créer, déployer et faire tourner un bot Telegram complet, du premier message jusqu'au service en ligne 24h/24.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20futuristic%20chatbot%20interface%20with%20glowing%20message%20bubbles%20in%20cyan%20and%20purple%20black%20background%20cyberpunk%20network%20aesthetic%20high%20detail&width=1200&height=700&seq=dgm-cover-bots&orientation=landscape",
    program: [
      { title: "Comprendre l'API Telegram et créer son bot via BotFather", items: [] },
      { title: "Python et la bibliothèque python-telegram-bot", items: [] },
      { title: "Menus, boutons et réponses interactives", items: [] },
      { title: "Base de données SQLite (stocker utilisateurs et contenus)", items: [] },
      { title: "Déployer le bot sur un VPS avec un service qui tourne 24h/24", items: [] },
    ],
    result: "L'élève met en ligne son propre bot fonctionnel.",
    prerequisites: ["Bases de JavaScript ou Python", "Notion des API REST", "Un ordinateur et une connexion stable"],
    outcomes: [
      "Créer des bots multi-plateformes fonctionnels",
      "Gérer commandes, boutons et événements",
      "Connecter un bot à une base de données",
      "Héberger et maintenir ton bot 24/7",
    ],
    trainer:
      "DGM — créateur de bots pour des communautés de plusieurs milliers de membres.",
    faq: [
      { question: "Sur quelle plateforme commence-t-on ?", answer: "Telegram, la plus simple et la plus permissive, puis Discord et WhatsApp." },
      { question: "Mon bot peut-il rester en ligne ?", answer: "Oui, on apprend à le déployer sur un serveur pour qu'il tourne en continu." },
      { question: "Faut-il payer pour héberger ?", answer: "Il existe des solutions gratuites pour débuter, puis des VPS abordables pour passer à l'échelle." },
    ],
  },
  {
    id: "panels-administration",
    title: "Création de panels d'administration",
    category: "Programmation",
    level: "Intermédiaire",
    duration: "9 semaines",
    price: "480 €",
    popular: false,
    icon: "ri-dashboard-3-line",
    description:
      "Construis des interfaces d'administration complètes pour piloter utilisateurs, données et services.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20admin%20dashboard%20analytics%20interface%20with%20neon%20cyan%20charts%20and%20graphs%20on%20black%20screen%20cyberpunk%20ui%20high%20detail&width=1200&height=700&seq=dgm-cover-panels&orientation=landscape",
    program: [
      { title: "Les bases d'une API avec FastAPI", items: [] },
      { title: "Base de données et modèles", items: [] },
      { title: "Authentification sécurisée (JWT, rôles admin / utilisateur)", items: [] },
      { title: "Interface en React avec thème sombre", items: [] },
      { title: "Déploiement avec Nginx et nom de domaine", items: [] },
    ],
    result: "Un panel complet avec connexion et gestion des utilisateurs.",
    prerequisites: ["Bases solides en JavaScript", "Notion de React et des API", "Compréhension des bases de données"],
    outcomes: [
      "Concevoir un panel d'administration complet",
      "Mettre en place authentification et rôles",
      "Créer des tableaux de bord avec statistiques",
      "Sécuriser et déployer un back-office",
    ],
    trainer:
      "DGM — auteur de panels d'administration utilisés en production par des équipes et des startups.",
    faq: [
      { question: "Quel type de panel vais-je créer ?", answer: "Un back-office réel avec gestion d'utilisateurs, de données et de statistiques." },
      { question: "Est-ce que je repars du niveau zéro ?", answer: "Non, il faut déjà être à l'aise avec JavaScript et un peu de React." },
      { question: "La sécurité est-elle incluse ?", answer: "Oui, une grande partie est consacrée à la sécurisation de l'accès et des données." },
    ],
  },
  {
    id: "applications-mobiles-android",
    title: "Applications Android",
    category: "Mobile",
    level: "Intermédiaire",
    duration: "10 semaines",
    price: "490 €",
    popular: false,
    icon: "ri-smartphone-line",
    description:
      "Crée des applications mobiles Android, de l'interface aux fonctionnalités natives, et publie-les sur le store.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20smartphone%20mockup%20showing%20mobile%20app%20interface%20with%20neon%20purple%20glow%20on%20black%20background%20cyberpunk%20product%20shot%20high%20detail&width=1200&height=700&seq=dgm-cover-mobile&orientation=landscape",
    program: [
      { title: "Installer Android Studio, découvrir Kotlin", items: [] },
      { title: "Créer des écrans et naviguer entre eux", items: [] },
      { title: "Connecter l'application à une API", items: [] },
      { title: "Stocker des données et gérer la connexion utilisateur", items: [] },
      { title: "Générer l'APK final", items: [] },
    ],
    result: "Une application installable sur téléphone.",
    prerequisites: ["Bases de JavaScript", "Notion des API et du JSON", "Un ordinateur capable de faire tourner l'environnement mobile"],
    outcomes: [
      "Développer une application Android complète",
      "Connecter ton application à des services en ligne",
      "Gérer notifications et stockage local",
      "Compilier et publier ton application",
    ],
    trainer:
      "DGM — développeur d'applications mobiles et web, du prototype à la mise en production.",
    faq: [
      { question: "Android seulement ?", answer: "La formation se concentre sur Android, l'écosystème le plus accessible pour apprendre et publier." },
      { question: "Puis-je publier mon application ?", answer: "Oui, on voit toute la procédure de compilation et de publication sur le store." },
      { question: "Ai-je besoin d'un téléphone ?", answer: "C'est un plus pour tester, mais l'émulateur sur ordinateur suffit pendant la formation." },
    ],
  },
  {
    id: "hacking-ethique-cybersecurite",
    title: "Cybersécurité et hacking éthique",
    category: "Sécurité",
    level: "Intermédiaire",
    duration: "11 semaines",
    price: "540 €",
    popular: true,
    icon: "ri-shield-flash-line",
    description:
      "Sécurise, teste et protège des systèmes : comprends les attaques pour mieux défendre. Usage légal uniquement.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20cybersecurity%20concept%20with%20glowing%20shield%20and%20encrypted%20code%20stream%20in%20cyan%20and%20pink%20on%20black%20background%20cyberpunk%20high%20detail&width=1200&height=700&seq=dgm-cover-cyber&orientation=landscape",
    program: [
      { title: "Les bases du réseau et du web", items: [] },
      { title: "Comprendre les failles courantes (mots de passe faibles, injections, mauvaises configurations)", items: [] },
      { title: "Sécuriser un serveur, un site et un bot", items: [] },
      { title: "Tests sur un environnement de laboratoire personnel", items: [] },
      { title: "Éthique, loi et bonnes pratiques", items: [] },
    ],
    result: "L'élève sait sécuriser, tester et protéger des systèmes, dans un cadre strictement légal.",
    legalNote:
      "Cette formation enseigne la protection des systèmes. Toute utilisation contre des systèmes sans autorisation est illégale et interdite.",
    prerequisites: ["Bases de réseaux et de Linux", "Notion de développement web", "Pratique uniquement sur systèmes autorisés"],
    outcomes: [
      "Comprendre les principales attaques et défenses",
      "Auditer la sécurité d'une application web",
      "Rédiger un rapport d'audit professionnel",
      "Durcir et sécuriser un système réel",
    ],
    trainer:
      "DGM — spécialiste en sécurité offensive et défensive, intervenant en audit pour des entreprises.",
    faq: [
      { question: "Est-ce légal ?", answer: "Oui, dans un cadre autorisé. J'enseigne uniquement des techniques éthiques sur des environnements pour lesquels on a une autorisation." },
      { question: "Est-ce que je pourrai travailler en cybersécurité ?", answer: "La formation pose les bases solides visées par les postes juniors en sécurité et en audit." },
      { question: "Faut-il être développeur ?", answer: "Un minimum de culture technique aide, mais on reprend les bases nécessaires ensemble." },
    ],
  },
  {
    id: "linux-serveurs-deploiement",
    title: "Linux, VPS et déploiement",
    category: "Sécurité",
    level: "Débutant à intermédiaire",
    duration: "7 semaines",
    price: "410 €",
    popular: false,
    icon: "ri-server-line",
    description:
      "Maîtrise Linux et déploie tes projets sur des serveurs réels : VPS, Nginx, services et sécurité.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20server%20room%20with%20neon%20cyan%20and%20purple%20lights%20linux%20terminal%20command%20line%20glowing%20on%20screens%20cyberpunk%20high%20detail&width=1200&height=700&seq=dgm-cover-linux&orientation=landscape",
    program: [
      { title: "Commandes Linux essentielles", items: [] },
      { title: "Louer et configurer un VPS", items: [] },
      { title: "Nginx, noms de domaine et HTTPS", items: [] },
      { title: "Services systemd et sauvegardes", items: [] },
      { title: "Bonnes pratiques de sécurité du serveur", items: [] },
    ],
    result: "L'élève sait héberger et protéger ses propres projets.",
    prerequisites: ["Notions de ligne de commande", "Aucune expérience serveur requise", "Un VPS (des options abordables sont présentées)"],
    outcomes: [
      "Administrer un serveur Linux en autonomie",
      "Déployer un site ou une app sur un VPS",
      "Configurer Nginx, HTTPS et un nom de domaine",
      "Sécuriser et surveiller ton serveur",
    ],
    trainer:
      "DGM — administrateur système et développeur, gérant des serveurs en production au quotidien.",
    faq: [
      { question: "Faut-il payer un serveur ?", answer: "Pour pratiquer en réel, oui, mais des VPS à quelques euros suffisent. Le cours explique comment choisir." },
      { question: "Linux est-il difficile ?", answer: "Non, on part des bases avec une méthode claire et beaucoup de pratique guidée." },
      { question: "Pourquoi systemd ?", answer: "C'est le standard pour faire tourner des services en arrière-plan sur la majorité des serveurs." },
    ],
  },
  {
    id: "coaching-individuel",
    title: "Formation personnalisée & coaching individuel",
    category: "Coaching",
    level: "Tous niveaux",
    duration: "Sur mesure",
    price: "Sur devis",
    popular: false,
    icon: "ri-user-star-line",
    description:
      "Un accompagnement individuel construit autour de tes objectifs : reconversion, projet précis ou remise à niveau.",
    cover:
      "https://readdy.ai/api/search-image?query=dark%20one%20on%20one%20mentoring%20scene%20with%20glowing%20neon%20accents%20laptop%20and%20code%20hologram%20in%20cyan%20purple%20on%20black%20background%20cyberpunk%20high%20detail&width=1200&height=700&seq=dgm-cover-coaching&orientation=landscape",
    program: [
      {
        title: "Cadrage",
        items: ["Bilan de ton niveau actuel", "Définition d'objectifs clairs", "Plan de progression personnalisé"],
      },
      {
        title: "Accompagnement",
        items: ["Sessions individuelles régulières", "Exercices adaptés à ton rythme", "Revue de code & feedback"],
      },
      {
        title: "Projet guidé",
        items: ["Un projet concret choisi ensemble", "Mise en pratique accompagnée", "Déblocage des points difficiles"],
      },
      {
        title: "Suivi",
        items: ["Bilan de progression", "Conseils carrière & portfolio", "Accès à un canal d'entraide"],
      },
    ],
    prerequisites: ["Aucun prérequis de niveau", "Un objectif ou un projet en tête", "De la régularité dans l'engagement"],
    outcomes: [
      "Progresser à ton rythme sur un parcours sur mesure",
      "Mener à bien un projet personnel concret",
      "Recevoir un feedback direct sur ton code",
      "Gagner un temps précieux grâce à un guide dédié",
    ],
    trainer:
      "DGM — formateur et mentor, habitué à adapter chaque parcours au profil et à l'objectif de l'élève.",
    faq: [
      { question: "Comment se déroulent les sessions ?", answer: "En visioconférence individuelle, au rythme que tu choisis, avec un suivi entre les séances." },
      { question: "Le prix est-il fixe ?", answer: "Non, le tarif est établi sur devis selon ton objectif et la durée de l'accompagnement." },
      { question: "Pour qui est-ce le plus utile ?", answer: "Idéal en reconversion, pour un projet précis ou pour débloquer une situation en autonomie." },
    ],
  },
];

export const services = [
  {
    icon: "ri-global-line",
    title: "Création de site web sur mesure",
    description:
      "Sites vitrines, e-commerce et plateformes rapides, responsive et pensés pour convertir tes visiteurs.",
    price: "490 €",
    features: ["Design sur mesure", "Responsive & rapide", "Optimisation SEO"],
  },
  {
    icon: "ri-robot-2-line",
    title: "Bots Telegram / WhatsApp / Discord",
    description:
      "Bots intelligents pour automatiser, modérer et animer tes communautés, en continu et sans effort.",
    price: "350 €",
    features: ["Multicanale", "Commandes & menus", "Base de données"],
  },
  {
    icon: "ri-dashboard-3-line",
    title: "Panels d'administration & gestion",
    description:
      "Back-offices clairs pour piloter utilisateurs, données, rôles et statistiques en toute sécurité.",
    price: "690 €",
    features: ["Gestion des rôles", "Statistiques", "Accès sécurisé"],
  },
  {
    icon: "ri-smartphone-line",
    title: "Développement d'applications Android",
    description:
      "Applications mobiles natives et connectées, du prototype jusqu'à la publication sur le store.",
    price: "900 €",
    features: ["Interface native", "Notifications", "Publication store"],
  },
  {
    icon: "ri-shield-flash-line",
    title: "Audit de sécurité & protection de sites",
    description:
      "Tests d'intrusion et audit complet, avec rapport détaillé et plan de remédiation clair.",
    price: "590 €",
    features: ["Tests d'intrusion", "Rapport détaillé", "Correctifs inclus"],
  },
  {
    icon: "ri-server-line",
    title: "Déploiement & maintenance serveurs (VPS)",
    description:
      "Mise en production sur VPS, configuration Nginx, sécurisation et maintenance continue.",
    price: "240 €",
    features: ["VPS & Nginx", "Sécurisation", "Maintenance"]
  },
];

export const projects = [
  {
    id: "dgm-tunnel-bot",
    title: "DGM TUNNEL BOT",
    category: "Bot Telegram",
    badge: "En production",
    description:
      "Bot Telegram avec menus interactifs, catégories de contenu, gestion de fichiers et affichage de configurations avec bouton « Copier ». Fonctionne 24h/24 sur serveur VPS.",
    tags: ["Python", "python-telegram-bot", "SQLite", "systemd", "Linux"],
    accent: "primary",
    image:
      "https://static.readdy.ai/image/955995e7a014b9d13b5d3fbb3a5e2aef/245c991ed11877daaebad6c9d6ba21fd.png",
  },
  {
    id: "dgm-tunnel-v2",
    title: "DGM TUNNEL V2",
    category: "Application Android",
    badge: "En développement",
    description:
      "Application mobile cliente avec connexion par jeton sécurisé, gestion des appareils et statut de l'abonnement.",
    tags: ["Kotlin", "Android Studio", "API REST"],
    accent: "accent",
    image:
      "https://static.readdy.ai/image/955995e7a014b9d13b5d3fbb3a5e2aef/146b1446fc399299eff5a7847c1bc40c.jpeg",
  },
  {
    id: "dgm-admin-panel",
    title: "Panel d'administration DGM",
    category: "Panel d'admin",
    badge: "En développement",
    description:
      "Interface web sombre pour gérer les utilisateurs, générer et suivre les jetons d'accès, avec authentification sécurisée et API dédiée.",
    tags: ["FastAPI", "SQLAlchemy", "JWT", "React", "Nginx"],
    accent: "secondary",
    image:
      "https://static.readdy.ai/image/955995e7a014b9d13b5d3fbb3a5e2aef/0023714ea5031850fce6a490c05d3dc7.png",
  },
];

export interface SiteStat {
  value: string;
  label: string;
}

export interface WebSite {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: string;
  status: string;
  year: string;
  owner: "perso" | "client";
  initials: string;
  icon: string;
  eyebrow: string;
  stats: SiteStat[];
  highlights: string[];
  tags: string[];
  description: string;
  accent: "primary" | "accent" | "secondary";
  image: string;
}

export const webSites: WebSite[] = [
  {
    id: "lapika-store",
    name: "Lapika Store",
    url: "https://lapikastore.readdy.co",
    domain: "lapikastore.readdy.co",
    category: "E-commerce",
    status: "En ligne",
    year: "2026",
    owner: "client",
    initials: "LS",
    icon: "ri-store-3-line",
    eyebrow: "La boutique en ligne du groupe",
    stats: [
      { value: "500+", label: "Produits" },
      { value: "1000+", label: "Clients" },
      { value: "50+", label: "Pays livrés" },
      { value: "24/7", label: "Support" },
    ],
    highlights: ["High-Tech", "Solaire", "Véhicules", "Mobilier"],
    tags: [
      "High Tech & Smartphones",
      "Énergie Solaire",
      "Véhicules & Motos",
      "Livraison 50+ pays",
      "Prix de gros",
    ],
    description:
      "Plateforme e-commerce d'import-export : high-tech, véhicules, énergie solaire et mobilier. Prix de gros, livraison internationale en Afrique et paiement facilité.",
    accent: "primary",
    image:
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Flapikastore.readdy.co?w=1200&h=750",
  },
  {
    id: "gradi-lapika",
    name: "Gradi Lapika",
    url: "https://gradilapika.readdy.co",
    domain: "gradilapika.readdy.co",
    category: "Site personnel",
    status: "En ligne",
    year: "2026",
    owner: "client",
    initials: "GL",
    icon: "ri-user-star-line",
    eyebrow: "Site personnel & leadership",
    stats: [
      { value: "CEO", label: "Empire Lapika" },
      { value: "10+", label: "Ans d'exp." },
      { value: "2", label: "Continents" },
      { value: "100+", label: "Interventions" },
    ],
    highlights: ["Gestion financière", "Conférences", "Leadership"],
    tags: [
      "CEO & Fondateur",
      "Gestion financière",
      "Autonomisation",
      "Conférences",
      "Kinshasa & USA",
    ],
    description:
      "Site personnel de Gradi Lapika, CEO & fondateur d'Empire Lapika : parcours, conférences et expertise en gestion financière et autonomisation économique.",
    accent: "accent",
    image:
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fgradilapika.readdy.co?w=1200&h=750",
  },
  {
    id: "bruno-lapika",
    name: "Bruno Lapika Dimomfu",
    url: "https://brunolapika.com",
    domain: "brunolapika.com",
    category: "Site académique",
    status: "En ligne",
    year: "2026",
    owner: "client",
    initials: "BL",
    icon: "ri-user-star-line",
    eyebrow: "Site académique & personnel",
    stats: [
      { value: "30+", label: "Ans d'exp." },
      { value: "CERDAS", label: "Directeur" },
      { value: "UNIKIN", label: "Kinshasa" },
      { value: "Expert", label: "Santé publique" },
    ],
    highlights: ["Anthropologue", "Santé publique", "UNIKIN"],
    tags: [
      "Anthropologie médicale",
      "Santé publique",
      "UNIKIN / CERDAS",
      "Publications scientifiques",
    ],
    description:
      "Site biographique du Professeur Bruno Lapika Dimomfu : anthropologue à l'UNIKIN, directeur du CERDAS et expert en santé publique en Afrique centrale.",
    accent: "secondary",
    image:
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fbrunolapika.com?w=1200&h=750",
  },
  {
    id: "rass-hrdc",
    name: "RASSH",
    url: "https://rasshrdc.org",
    domain: "rasshrdc.org",
    category: "Revue scientifique",
    status: "En ligne",
    year: "2026",
    owner: "client",
    initials: "RA",
    icon: "ri-article-line",
    eyebrow: "Revue scientifique en libre accès",
    stats: [
      { value: "113+", label: "Articles" },
      { value: "9", label: "Volumes" },
      { value: "12", label: "Pays" },
      { value: "2009", label: "Depuis" },
    ],
    highlights: ["Open Access", "Anthropologie", "Sociologie"],
    tags: [
      "Open Access",
      "113+ articles",
      "9 volumes depuis 2009",
      "ISSN 2957-8272",
      "Anthropologie & Sociologie",
    ],
    description:
      "Revue Africaine des Sciences Sociales et Humaines (CERDAS / UNIKIN) : articles évalués en double aveugle en anthropologie, sociologie et études africaines, en libre accès.",
    accent: "primary",
    image:
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Frasshrdc.org?w=1200&h=750",
  },
  {
    id: "cerdas-drc",
    name: "CERDAS",
    url: "https://cerdasdrc.org",
    domain: "cerdasdrc.org",
    category: "Site institutionnel",
    status: "En ligne",
    year: "2026",
    owner: "client",
    initials: "CE",
    icon: "ri-building-2-line",
    eyebrow: "Centre de recherche",
    stats: [
      { value: "1972", label: "Fondé" },
      { value: "100+", label: "Chercheurs" },
      { value: "5", label: "Domaines" },
      { value: "UNESCO", label: "Résolution" },
    ],
    highlights: ["Recherche", "Sciences sociales", "Publie la RASSH"],
    tags: [
      "Fondé en 1972",
      "Résolution UNESCO",
      "100+ chercheurs",
      "5 domaines",
      "Publie la RASSH",
    ],
    description:
      "Site du Centre de Coordination des Recherches et de Documentation en Sciences Sociales (CERDAS), institut de recherche affilié à l'UNIKIN et éditeur de la revue RASSH.",
    accent: "accent",
    image:
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fcerdasdrc.org?w=1200&h=750",
  },
  {
    id: "lapika-groupe",
    name: "Lapika Groupe",
    url: "https://lapikagroup.com",
    domain: "lapikagroup.com",
    category: "Site corporate",
    status: "En ligne",
    year: "2026",
    owner: "client",
    initials: "LG",
    icon: "ri-building-4-line",
    eyebrow: "Site corporate du groupe",
    stats: [
      { value: "500+", label: "Véhicules" },
      { value: "1000+", label: "Clients" },
      { value: "50+", label: "Marques" },
      { value: "5", label: "Ans" },
    ],
    highlights: ["Mobilité", "Financement", "Import-Export", "Microcrédit"],
    tags: [
      "Mobilité",
      "Financement",
      "Import-Export",
      "Logistique",
      "Services corporate",
    ],
    description:
      "Site corporate du groupe Empire Lapika : présentation des activités, des filiales (Lapika Store, services financiers, import-export, logistique) et prise de contact.",
    accent: "secondary",
    image:
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Flapikagroup.com?w=1200&h=750",
  },
];

export const testimonials = [
  {
    name: "Amina K.",
    role: "Développeuse junior",
    initials: "AK",
    rating: 5,
    text: "Grâce à la formation full-stack de DGM, j'ai décroché mon premier poste en 6 mois. Les projets pratiques font toute la différence.",
    photo:
      "https://readdy.ai/api/search-image?query=professional%20friendly%20headshot%20portrait%20of%20a%20young%20woman%20software%20developer%20smiling%20softly%2C%20dark%20neutral%20studio%20background%2C%20soft%20rim%20lighting%2C%20high%20detail&width=200&height=200&seq=dgm-testi-amina&orientation=squarish",
  },
  {
    name: "Yann M.",
    role: "Fondateur de startup",
    initials: "YM",
    rating: 5,
    text: "DGM a conçu notre plateforme de A à Z. Travail rapide, propre et sécurisé. Un vrai partenaire de confiance.",
    photo:
      "https://readdy.ai/api/search-image?query=professional%20confident%20headshot%20portrait%20of%20a%20young%20man%20startup%20founder%2C%20dark%20neutral%20studio%20background%2C%20soft%20rim%20lighting%2C%20high%20detail&width=200&height=200&seq=dgm-testi-yann&orientation=squarish",
  },
  {
    name: "Sofia R.",
    role: "Consultante sécurité",
    initials: "SR",
    rating: 5,
    text: "La formation cybersécurité est intense et concrète. J'ai enfin compris le hacking éthique de manière pratique et responsable.",
    photo:
      "https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20woman%20cybersecurity%20consultant%2C%20dark%20neutral%20studio%20background%2C%20soft%20rim%20lighting%2C%20high%20detail&width=200&height=200&seq=dgm-testi-sofia&orientation=squarish",
  },
  {
    name: "Ibrahim T.",
    role: "Gérant d'agence",
    initials: "IT",
    rating: 5,
    text: "Notre bot Discord gère maintenant toute notre communauté automatiquement. Un gain de temps énorme au quotidien.",
    photo:
      "https://readdy.ai/api/search-image?query=professional%20friendly%20headshot%20portrait%20of%20a%20man%20business%20agency%20owner%2C%20dark%20neutral%20studio%20background%2C%20soft%20rim%20lighting%2C%20high%20detail&width=200&height=200&seq=dgm-testi-ibrahim&orientation=squarish",
  },
];

export const faqs = [
  {
    question: "Quels sont les prérequis pour commencer une formation ?",
    answer:
      "Aucun prérequis pour les parcours débutants : on part de zéro. Pour les modules avancés (bots, panels, cybersécurité), une base en JavaScript ou Python est recommandée, et on reprend les fondations ensemble si besoin.",
  },
  {
    question: "Comment se déroulent les paiements ?",
    answer:
      "Le paiement peut se faire en une fois ou en plusieurs échéances mensuelles, sans frais cachés. Un devis clair et un contrat de formation te sont fournis avant de commencer.",
  },
  {
    question: "Combien de temps ai-je accès au contenu ?",
    answer:
      "L'accès au contenu et aux ressources est illimité : tu gardes les supports, les projets et les mises à jour. Tu peux revoir les modules autant de fois que nécessaire.",
  },
  {
    question: "Une certification est-elle délivrée ?",
    answer:
      "Oui. Après validation de ton projet final, tu reçois une attestation de fin de formation qui valorise les compétences réellement acquises, à ajouter à ton portfolio et à ton CV.",
  },
  {
    question: "Le hacking éthique, est-ce légal ?",
    answer:
      "Oui, strictement dans un cadre légal et autorisé. J'enseigne uniquement des techniques éthiques, sur des environnements de test ou pour lesquels une autorisation écrite a été donnée. Jamais d'usage illégal ou d'atteinte à un système sans consentement.",
  },
  {
    question: "Y a-t-il un support après la formation ?",
    answer:
      "Oui. Chaque élève rejoint un canal d'entraide privé et bénéficie d'un suivi après la formation pour débloquer ses projets, poser ses questions et rester à jour.",
  },
];

export const socials = [
  { label: "GitHub", icon: "ri-github-fill", href: "#" },
  { label: "LinkedIn", icon: "ri-linkedin-fill", href: "#" },
  { label: "YouTube", icon: "ri-youtube-fill", href: "#" },
  { label: "Discord", icon: "ri-discord-fill", href: "#" },
  { label: "Telegram", icon: "ri-telegram-fill", href: "#" },
  { label: "X", icon: "ri-twitter-x-fill", href: "#" },
];

export const whatsappUrl = "https://wa.me/33612345678";

export const contactChannels = [
  {
    label: "WhatsApp",
    icon: "ri-whatsapp-fill",
    value: "+33 6 12 34 56 78",
    href: "https://wa.me/33612345678",
    accent: "primary",
  },
  {
    label: "Telegram",
    icon: "ri-telegram-fill",
    value: "@dgm_dev",
    href: "https://t.me/dgm_dev",
    accent: "accent",
  },
  {
    label: "Email",
    icon: "ri-mail-send-fill",
    value: "contact@dgm-developpeur.com",
    href: "mailto:contact@dgm-developpeur.com",
    accent: "secondary",
  },
];

export const newsletterPerks = [
  "Astuces code & sécurité, chaque semaine",
  "Ressources et modèles prêts à l'emploi",
  "Zéro spam — désinscription en un clic",
];

export const contactInfo = [
  { icon: "ri-mail-send-line", label: "Email", value: "contact@dgm-developpeur.com" },
  { icon: "ri-phone-line", label: "Téléphone / WhatsApp", value: "+33 6 12 34 56 78" },
  { icon: "ri-map-pin-line", label: "Localisation", value: "Paris, France — à distance dans le monde entier" },
];

export const legalSections = [
  {
    title: "Éditeur du site",
    paragraphs: [
      "Ce site est édité par DGM — Dieu Génie du Mal (Celui Qui Demeure), développeur et formateur indépendant.",
      "Contact : contact@dgm-developpeur.com — Paris, France.",
    ],
  },
  {
    title: "Objet du site",
    paragraphs: [
      "Ce site présente les formations, services et réalisations proposés par DGM. Il permet également de prendre contact pour un devis ou une inscription.",
    ],
  },
  {
    title: "Formations à usage légal et éthique",
    paragraphs: [
      "Toutes les formations liées à la sécurité (hacking éthique, cybersécurité, tests d'intrusion) sont strictement destinées à un usage légal, éthique et autorisé.",
      "Toute technique présentée doit être appliquée uniquement sur des systèmes dont tu es propriétaire ou pour lesquels tu disposes d'une autorisation écrite explicite. L'usage de ces connaissances à des fins illégales, malveillantes ou sans consentement est formellement interdit et engage seule la responsabilité de son auteur.",
      "En t'inscrivant à une formation de sécurité, tu t'engages à respecter la loi, la vie privée d'autrui et les conditions d'utilisation des systèmes concernés.",
    ],
  },
  {
    title: "Propriété intellectuelle",
    paragraphs: [
      "L'ensemble des contenus (textes, visuels, supports de formation, code) est protégé. Toute reproduction ou diffusion sans autorisation écrite est interdite.",
    ],
  },
  {
    title: "Données personnelles",
    paragraphs: [
      "Les informations transmises via les formulaires de contact ou d'inscription sont utilisées uniquement pour répondre à ta demande. Elles ne sont jamais revendues ni partagées avec des tiers.",
      "Conformément au RGPD, tu peux demander l'accès, la rectification ou la suppression de tes données en écrivant à contact@dgm-developpeur.com.",
    ],
  },
  {
    title: "Responsabilité",
    paragraphs: [
      "DGM s'efforce d'assurer l'exactitude des informations diffusées, sans pouvoir garantir l'absence totale d'erreur. L'utilisation des contenus se fait sous la responsabilité de l'utilisateur.",
    ],
  },
];