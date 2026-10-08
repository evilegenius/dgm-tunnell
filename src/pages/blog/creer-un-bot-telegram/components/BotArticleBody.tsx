import { Link } from "react-router-dom";

const linkClass =
  "font-medium text-primary-400 underline decoration-primary-500/40 underline-offset-4 transition-colors hover:text-primary-300 cursor-pointer";

function InternalLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className={linkClass}>
      {children}
    </Link>
  );
}

export default function BotArticleBody() {
  return (
    <article className="mx-auto w-full max-w-3xl">
      <p className="text-base leading-relaxed text-foreground-700 md:text-lg">
        Automatiser une communauté, répondre à tes clients 24h/24 ou diffuser du contenu sans lever le
        petit doigt : c'est exactement ce qu'un bot Telegram permet. Dans ce guide complet, on part de
        zéro et on voit, étape par étape, comment créer un bot Telegram fonctionnel — de BotFather
        jusqu'à l'hébergement. Que tu sois débutant ou déjà développeur, tu trouveras ici une méthode
        claire, les pièges à éviter et les bonnes pratiques pour un bot fiable. Et si tu veux gagner du
        temps sur un projet sérieux, tu peux aussi confier sa réalisation à un professionnel.
      </p>

      <h2 className="mt-12 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
        Qu'est-ce qu'un bot Telegram ?
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Un bot Telegram est un programme qui interagit automatiquement avec les utilisateurs au sein de
        l'application Telegram. Il répond aux messages, envoie des notifications, gère des commandes
        comme /start ou /help, traite des paiements et peut modérer une communauté. Pour une
        entreprise, un bot permet d'automatiser le service client, de diffuser du contenu ou de générer
        des prospects 24h/24 sans intervention humaine.
      </p>
      <h3 className="mt-8 font-heading text-lg font-semibold text-foreground-950">
        Ce qu'un bot peut faire concrètement
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground-700">
        Un bot bien pensé devient un véritable assistant : il accueille les nouveaux membres, répond aux
        questions fréquentes, envoie des rappels, encaisse des paiements et alerte l'équipe en cas de
        problème. C'est un outil qui travaille pour toi, en continu, sans pause et sans oubli.
      </p>

      <h2 className="mt-12 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
        Étape 1 — Créer le bot avec BotFather
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        BotFather est le robot officiel de Telegram, le « père » de tous les autres bots. Ouvrez
        Telegram, recherchez @BotFather, puis envoyez la commande /newbot. Il vous demandera un nom
        visible par les utilisateurs et un nom d'utilisateur se terminant par « bot ». En retour, vous
        recevez un jeton d'accès (token) unique : conservez-le précieusement, car il donne le contrôle
        total de votre bot.
      </p>
      <h3 className="mt-8 font-heading text-lg font-semibold text-foreground-950">
        Traite ton token comme un mot de passe
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground-700">
        Ce token est la clé de ton bot. Ne le partage jamais, ne le publie jamais sur un dépôt public et
        ne le mets pas en clair dans ton code. S'il fuite, n'importe qui peut piloter ton bot à ta
        place. En cas de doute, révoque-le dans BotFather et génère-en un nouveau.
      </p>

      <h2 className="mt-12 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
        Étape 2 — Choisir un langage et programmer
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Une fois le token en main, il faut écrire le code. Python avec la bibliothèque
        python-telegram-bot est le choix le plus populaire pour débuter, mais Node.js (telegraf), PHP ou
        Java fonctionnent aussi. Un bot minimal répond à la commande /start et renvoie un message de
        bienvenue. Les bots plus avancés intègrent des API tierces, des bases de données ou de
        l'intelligence artificielle pour comprendre le langage naturel.
      </p>
      <h3 className="mt-8 font-heading text-lg font-semibold text-foreground-950">
        Quel langage pour quel usage ?
      </h3>
      <ul className="mt-3 space-y-2.5">
        {[
          "Python : idéal pour débuter, lire et faire évoluer ton bot facilement.",
          "Node.js (telegraf) : parfait si tu viens déjà du web et de JavaScript.",
          "PHP ou Java : pertinents si ton écosystème technique existant les utilise déjà.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-foreground-700">
            <i className="ri-checkbox-circle-line mt-1 text-primary-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Si tu veux poser des bases solides, tu peux rejoindre{" "}
        <InternalLink to="/formations/programmation-de-a-a-z">
          notre formation programmation de A à Z
        </InternalLink>
        , conçue pour t'apprendre à écrire des programmes complets et clairs, même en partant de zéro.
      </p>

      <h2 className="mt-12 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
        Étape 3 — Héberger et mettre en ligne
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Un bot doit tourner en permanence pour répondre instantanément. Vous pouvez l'héberger sur un
        petit serveur (VPS), un service cloud, ou utiliser les webhooks Telegram plutôt que le polling.
        Le choix dépend de la charge attendue et du budget. Une mise en production propre inclut la
        gestion des erreurs, la journalisation et la sécurisation du token.
      </p>
      <h3 className="mt-8 font-heading text-lg font-semibold text-foreground-950">
        Polling ou webhook ?
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground-700">
        Le polling est le plus simple : ton programme interroge Telegram en boucle pour récupérer les
        nouveaux messages. Parfait pour apprendre et pour de petits bots. Le webhook, lui, laisse
        Telegram prévenir ton serveur à chaque message : plus réactif et plus économe en ressources,
        c'est le choix des bots qui montent en charge.
      </p>

      <h2 className="mt-12 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
        Bonnes pratiques et pièges à éviter
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Ne partagez jamais votre token. Limitez les appels à l'API pour respecter les quotas de
        Telegram. Testez en environnement fermé avant d'ouvrir le bot au public, et prévoyez un message
        d'aide clair. Enfin, respectez les conditions d'utilisation de Telegram, notamment pour l'envoi
        de messages en masse.
      </p>
      <ul className="mt-4 space-y-2.5">
        {[
          "Gère les erreurs : un bot qui plante en silence perd ses utilisateurs.",
          "Journalise les actions importantes pour diagnostiquer plus vite.",
          "Prévois une commande /help claire et un menu de navigation lisible.",
          "Respecte les quotas d'envoi pour ne pas te faire restreindre.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-foreground-700">
            <i className="ri-shield-check-line mt-1 text-accent-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
        Faire appel à un professionnel
      </h2>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Créer un bot simple est à la portée de tous, mais un bot robuste — connecté à votre CRM, vos
        paiements ou vos outils internes — demande une vraie expertise. DGM développe des bots Telegram
        et Discord sur mesure, des panels d'administration et des automatisations complètes.
      </p>
      <p className="mt-4 text-base leading-relaxed text-foreground-700">
        Parcours{" "}
        <InternalLink to="/services">nos services de développement</InternalLink> pour découvrir tout
        ce qu'on peut construire ensemble, ou jette un œil à{" "}
        <InternalLink to="/projets">nos projets</InternalLink> réels déjà en ligne. Un projet en tête ?{" "}
        <InternalLink to="/contact">contactez-nous</InternalLink> : on cadre ton besoin et on te
        propose une solution concrète.
      </p>
    </article>
  );
}