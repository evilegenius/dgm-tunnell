# DGM — DIEU GÉNIE DU MAL (Celui Qui Demeure)

## 1. Project Description
Site web officiel (personnel) de la marque **DGM — Dieu Génie du Mal (Celui Qui Demeure)**, développeur et formateur spécialisé en programmation, cybersécurité (hacking éthique), création de bots, panels d'administration, sites web et applications.

- Public cible : personnes souhaitant se former à la tech, PME/individus cherchant un développeur.
- Valeur centrale : inspirer expertise, mystère et puissance via une identité « cyber / hacker » élégante.
- Type : site vitrine one-page (landing) + plateforme de présentation des formations.
- Langue : français.

## 2. Page Structure
Site multi-pages : chaque section possède désormais sa propre page dédiée (plus de one-page). Le layout commun (navbar, footer, boutons flottants) est partagé via un composant `Layout` avec `Outlet`.

- `/` — Accueil (condensé) : Hero plein écran (titre néon, machine à écrire, compteurs animés, boutons) + aperçu des formations (3 cartes) + bandeau CTA final.
- `/a-propos` — À propos : photo cadre néon/glitch, histoire, devise « Dieu Génie du Mal / Celui qui demeure », barres de compétences animées, 3 valeurs.
- `/formations` — Formations : filtres par catégorie, grille de 8 cartes (badges « Populaire ») + FAQ en accordéon.
- `/formations/:id` — Page détail d'une formation (programme, prérequis, acquis, formateur, FAQ, formulaire d'inscription).
- `/services` — Services sur mesure (6 offres : site web, bots, panels, apps Android, audit sécurité, serveurs VPS) avec prix « À partir de », bouton « Demander un devis » et bandeau CTA « Un projet en tête ? Parlons-en. »
- `/projets` — Galerie de 3 réalisations DGM (capture, badges technos/statut, description, zoom + halo au survol).
- `/sites-web` — Mes sites web : vitrine des sites clients avec en-tête de section, filtre par type de site (Tous / E-commerce / Personnel / Académique / Revue / Institutionnel / Corporate), grandes cartes « brandées » (aperçu visuel en fond, badge statut, domaine, monogramme, grille de statistiques, bandeau de tags, surtitre, description, pastilles et bouton « Visiter le site »), bloc « Tu veux un site web ? » avec formulaire de demande (type de site, budget, description) et bandeau CTA final.
- `/temoignages` — Bandeau de notes + carrousel automatique d'avis (photo, nom, étoiles, texte, navigation + points).
- `/blog` — Index du blog : liste des articles (carte titre + résumé + lien) dans la même charte sombre, avec bandeau CTA. Lien « Blog » ajouté au menu principal et au footer.
- `/blog/creer-un-bot-telegram` — Article « Comment créer un bot Telegram : le guide complet pour débutants » (H1 unique, sections H2/H3, 4 liens internes, bloc FAQ en accordéon, JSON-LD BlogPosting). Balises title/meta propres à l'article gérées côté page.
- `/contact` — Coordonnées + formulaire + boutons directs (WhatsApp, Telegram, Email) + réseaux sociaux néon + bannière Newsletter « Reçois mes astuces gratuites ».
- `/mentions-legales` — Mentions légales & Conditions d'utilisation (usage strictement légal des formations de sécurité).
- `/admin` — Console d'administration « DGM TUNNEL Admin » (hors navigation, thème sombre #0a0a0f, accents cyan #00f0ff et violet #8b5cf6). Une page de connexion email + mot de passe (aucune inscription publique, un seul compte administrateur), puis un panel avec menu latéral (Dashboard, Pays et configs, Jetons, Appareils, Application, Journal, Sécurité) et barre du haut affichant l'email connecté + bouton Déconnexion, adapté au mobile (drawer). Routes imbriquées : `/admin` (dashboard), `/admin/pays-configs`, `/admin/jetons`, `/admin/appareils`, `/admin/application`, `/admin/journal`, `/admin/securite`.
- `/app` — Application cliente « DGM TUNNEL – Celui qui demeure » (hors navigation, plein écran, pensée mobile d'abord, thème sombre néon cyan/violet), modèle repris de Barka Tunnel et amélioré. Écran de connexion : saisie du jeton + bouton « Se connecter » (via la fonction `login-token` avec un `device_id` stocké dans le navigateur, jeton mémorisé pour reconnexion automatique, erreurs affichées en clair). Une fois connecté, coquille de type application native avec en-tête (état de connexion + menu tiroir), barre d'onglets en bas et menu tiroir :
  - **Accueil** : carte d'accès (jours restants, date d'expiration, bouton Update), sélecteur de serveur, gros bouton **CONNECTER / DÉCONNECTER** avec anneau animé, statut (connecté / connexion / non connecté), **chrono de session**, et statistiques en direct (adresse IP, ping, débit descendant/montant, nombre de pays).
  - **Serveurs** : liste des pays (drapeau, types dispo, badge « Actif »), détail d'un pays avec filtres par type et cartes de configuration (badge type, contenu, « Utiliser ce serveur », « Copier la configuration »).
  - **Journal** : historique des connexions (sessions, durée totale, données, filtres 7/30 jours, vidage), conservé sur l'appareil.
  - **Paramètres** : vérification de mise à jour (via `app-release`), abonnement, guide d'installation, IP Finder, partage, téléchargement APK, canal Telegram, support, langue, déconnexion.
  - Écrans secondaires : **Guide d'installation**, **IP Finder** (détection réelle de l'IP publique), **Abonnement** (statut du jeton et renouvellement), **Support**.
  Un Update sur jeton expiré/bloqué renvoie à l'écran de connexion avec le message. Aucune lecture directe des tables.
- `/download` — Page officielle de téléchargement de l'application « DGM TUNNEL », style fiche de store (hors navigation classique, thème sombre néon cyan/violet), pensée mobile d'abord : bandeau d'en-tête, icône + note 4,9 + compatibilité + version, gros bouton « Télécharger l'application » (sert le dernier paquet Android `.apk` publié depuis l'admin, sinon bascule sur l'installation PWA réelle et instructions iOS/Android/PC), rail horizontal de captures d'écran, bloc « À propos de cette application », fiche de détails (version, OS, éditeur, identifiant…) en sheet alimentée par la version réelle, section « Sécurité des données », section « Notes et avis » (répartition 5→1 étoiles, avis affichés, formulaire d'avis relié au service de Formulaire) et barre d'installation collante en bas. Accessible depuis la section Projets du site. La page ne lit jamais les tables directement : elle récupère la version via la fonction `app-release`.
- PWA : manifest (`DGM TUNNEL` / `DGM`, `/app`, standalone, portrait, fond #0a0a0f, thème #00f0ff, icônes 192/512, captures d'écran) + service worker simple + balises d'installation Apple/Android. Le `/app` est installable sur téléphone et se lance en plein écran avec écran de démarrage de marque.
- Navigation fixe en haut (NavLink actif) + Footer complet + boutons flottants (WhatsApp, retour en haut).

## 3. Core Features
- [x] Navigation fixe multi-pages (NavLink avec état actif) + bouton « Rejoindre une formation »
- [x] Hero plein écran : logo « DGM » néon, sous-titre, texte machine à écrire, accroche, boutons, compteurs animés, indicateur de scroll
- [x] Section À propos : photo en cadre néon + glitch, histoire, devise « Dieu Génie du Mal / Celui qui demeure », barres de compétences animées, 3 valeurs
- [x] Grille de 8 formations avec filtres par catégorie, badges « Populaire » et bouton « S'inscrire »
- [x] Page détail de formation avec programme complet, prérequis, acquis, formateur, FAQ et formulaire d'inscription
- [x] Section Services clients avec prix « À partir de », bouton « Demander un devis » et bandeau CTA final
- [x] Galerie Projets (6 cartes) avec badges technos et effet zoom + halo lumineux au survol
- [x] Page « Mes sites web » : cartes brandées (monogramme, stats, tags) avec aperçu visuel, filtre par type de site, bouton « Visiter le site » (6 sites clients réels : Lapika Store, Gradi Lapika, Bruno Lapika, RASSH, Cerdas DRC, Lapika Groupe) + bloc formulaire « Tu veux un site web ? » + bandeau CTA
- [x] Section Témoignages en carrousel automatique (4 avis avec photo, note en étoiles)
- [x] Section Contact avec boutons directs WhatsApp / Telegram / Email et réseaux sociaux néon
- [x] FAQ en accordéon (6 questions : prérequis, paiement, durée d'accès, certificat, légalité, support)
- [x] Bannière Newsletter « Reçois mes astuces gratuites » (formulaire relié au service de Formulaire)
- [x] Boutons flottants WhatsApp + retour en haut
- [x] Page Mentions légales & CGU (usage strictement légal des formations de sécurité)
- [x] Animations au scroll (apparition progressive, compteurs, barres de progression)
- [x] Boutons / cartes avec lueurs néon au survol
- [x] Formulaire de contact + formulaire d'inscription + newsletter fonctionnels
- [x] Design 100% responsive (mobile d'abord)
- [x] SEO (titre, description, mots-clés, Open Graph, données structurées ProfessionalService)
- [x] Espace admin VPN privé (`/admin`, hors navigation) : connexion sécurisée réservée à l'email administrateur (Readdy Backend Auth), vue d'ensemble (serveurs, en ligne, clients connectés, clés actives, état du réseau), CRUD complet des serveurs VPN (nom, localisation, hôte, protocole, port, statut, capacité, connectés, notes) et des clés d'accès (libellé, valeur générée, serveur lié, statut, expiration, notes), avec confirmation de suppression et données persistées en base.
- [x] Panel admin — gestion des **pays** (nom, drapeau emoji, activation) et des **configurations** (pays, nom, type, contenu, activation), avec activation/désactivation en un clic.
- [x] Panel admin — gestion des **jetons d'accès** : création (code généré `DGM-XXXXXX-CREDIT`), durée en jours, nombre d'appareils max., blocage/déblocage, note, recherche, copie du code, statut calculé (non utilisé / actif / expiré / bloqué) et compteur d'appareils utilisés par jeton.
- [x] Console « DGM TUNNEL Admin » (route `/admin`) : menu latéral + barre du haut (email connecté, déconnexion), responsive mobile. **Dashboard** : cartes de statistiques (jetons actifs / non utilisés / expirant sous 3 j / expirés ou bloqués, pays, configs actives, appareils connectés), graphique en barres des configs actives par type, liste « À renouveler bientôt » et 8 dernières lignes du journal. **Pays et configs** : formulaires d'ajout (pays, configuration), liste des pays avec leurs configurations (badge de type), masquer/afficher, modifier (modale) et supprimer avec confirmation. Pages Jetons / Appareils / Journal / Sécurité : structure prête (placeholders).
- [x] Bouton « Application » dans le menu (navbar) et dans la section Projets, ouvrant `/app`. La page `/admin` est totalement masquée : aucun lien vers elle (ni menu, ni pied de page, ni sitemap) et `noindex` (balise robots injectée).
- [x] Application cliente `/app` + support PWA (manifest, service worker, icônes 192/512, captures d'écran, installable sur téléphone).
- [x] Page `/download` style fiche de store : en-tête + icône + note/compatibilité/format, bouton « Installer l'application » (installation PWA réelle + instructions iOS/Android/PC), captures d'écran, « À propos », fiche de détails en sheet, « Sécurité des données », « Notes et avis » (répartition + avis + formulaire) et barre d'installation collante. Lien « Télécharger l'application » ajouté dans le bandeau de la section Projets.
- [x] Expérience native renforcée sur `/app` : écran de démarrage de marque, plein écran (pas de rebond de page, zones de sécurité), carte « Installer l'application » sur l'écran de connexion, hook d'installation PWA partagé.
- [x] Module « Application » dans `/admin` : gestion du paquet Android — upload du fichier `.apk` (bucket `downloads`) ou lien externe, nom + code de version, notes de version, publication/dépublication, mise à jour forcée, version minimale, statistiques et suppression (avec nettoyage du fichier). Point de contrôle public affiché pour brancher l'application Android.
- [x] Distribution réelle : la page `/download` récupère la dernière version publiée via la fonction `app-release` et expose un vrai bouton de téléchargement de l'APK ; l'application Android peut appeler le même point de contrôle (`?current=<code>`) pour détecter une mise à jour (obligatoire ou non).
- [x] Section Blog : page index `/blog` (liste des articles) + article `/blog/creer-un-bot-telegram` (guide complet). Lien « Blog » dans la navigation principale. SEO par page (titre, meta description, canonical, JSON-LD BlogPosting) géré par le hook `useSeo`, sans modifier le design existant.

## 4. Data Model Design
Le contenu vitrine (formations, services, projets, témoignages, statistiques) reste statique, stocké dans des fichiers de contenu du projet.

Le panel admin VPN utilise le Backend (Readdy Backend) avec trois tables :
- `vpn_servers` : id, name, country, city, host, protocol, port, status (online/offline/maintenance), capacity, connected, notes, created_at, updated_at.
- `vpn_keys` : id, label, server_id (FK vpn_servers), key_value, status (active/revoked/expired), expires_at, notes, created_at.
- `vpn_admins` : id, email (liste blanche des emails autorisés à accéder au panel).

Tables additionnelles de distribution d'accès (protégées, aucun accès public) :
- `countries` : id, name, flag (emoji), active (true par défaut), created_at.
- `configs` : id, country_id (FK countries), name, type (VLESS, VMess, Trojan, SSH, DNS, Shadowsocks, Hysteria2, Autre), content (texte long), active (true par défaut), created_at, updated_at.
- `tokens` : id, code (unique, format DGM-XXXXXX-CREDIT), days, max_devices (1 par défaut), blocked (false par défaut), activated_at, expires_at, note, created_at.
- `devices` : id, token_code, device_id, first_seen (now par défaut), last_seen (now par défaut) — UNIQUE(token_code, device_id).
- `activity_log` : id, created_at (now par défaut), type (login / invalid), message, token_code, ip.
- `app_releases` : id, version_name, version_code, changelog, file_path (fichier dans le bucket `downloads`), file_name, file_size, external_url (lien alternatif), is_published, is_mandatory (mise à jour forcée), min_version_code, download_count, created_at, updated_at.
- Storage : bucket `downloads` (public) pour héberger les paquets `.apk` uploadés depuis le panel.

Sécurité : Row Level Security activée sur toutes les tables du panel ; l'accès complet est limité à l'email administrateur (`fenixsatia@gmail.com`) via `auth.jwt() ->> 'email'`. Les tables `countries`, `configs`, `tokens`, `devices` et `activity_log` n'ont AUCUN accès public (ni lecture ni écriture) : elles ne sont lisibles/modifiables que par l'admin connecté, ou via la fonction serveur `login-token`.

## 5. Backend / Third-party Integration Plan
- Database : Readdy Backend connecté — utilisé pour l'authentification admin et le stockage persistant des données VPN (serveurs, clés). Le reste du site reste statique.
- Edge Function : `login-token` (verify_jwt=false, service role) — point d'entrée public unique pour valider un jeton. Entrées : `code` (ou `token`) et `device_id`. Logique ordonnée : (1) jeton introuvable → « Jeton introuvable. Vérifie le code ou contacte l'admin. » ; (2) jeton bloqué → « Ce jeton est bloqué. Contacte l'admin. » ; (3) activé et expiré → « Ce jeton a expiré. Demande un nouveau jeton. » ; (4) nouvel appareil alors que `max_devices` est atteint → « Limite d'appareils atteinte. Contacte l'admin. » ; (5) première utilisation → `activated_at = maintenant`, `expires_at = maintenant + days jours` ; (6) enregistre/met à jour l'appareil (`last_seen`) et écrit une ligne `activity_log` ; (7) renvoie `expires_at` + les pays actifs avec leurs configurations actives (name, type, content). Limitation : 10 jetons invalides par minute et par adresse IP (comptées dans `activity_log` via la colonne `ip`). C'est le SEUL chemin d'accès public aux tables protégées ; aucune lecture directe depuis la page publique n'est possible.
- Auth : Readdy Backend Auth — connexion email + mot de passe, accès au panel strictement limité à l'email administrateur unique.
- Edge Function : `app-release` (verify_jwt=false, service role) — point de contrôle public des mises à jour. Renvoie la dernière version publiée de `app_releases` avec un lien de téléchargement signé (ou `external_url`), ainsi que les indicateurs `updateAvailable` et `mandatory` (calculés via `?current=<version_code>`). Utilisé par la page `/download` et par l'application Android.
- Formulaire de contact : via le service de Formulaire intégré (réception réelle).
- Formulaire d'avis de la page `/download` : via le service de Formulaire intégré (réception réelle), avec note + nom + commentaire et champ anti-spam.
- Shopify : non.
- Stripe / paiements : non pour l'instant.
- Autres : non.

## 6. Development Phase Plan

### Phase 1 : Page d'accueil complète (UI + contenu)
- Goal : livrer toutes les sections du site avec le style cyber/hacker.
- Deliverable : navigation fixe, hero, à propos, formations, services, projets, témoignages, footer, animations, responsive.

### Phase 2 : Contact + finitions
- Goal : formulaire de contact opérationnel et polish global.
- Deliverable : formulaire relié au service de formulaire, SEO/meta, vérification responsive et détails visuels.

### Phase 3 : Plateforme d'accès DGM TUNNEL (admin + application + store)
- Goal : transformer le site en une vraie plateforme d'accès, avec console admin, application cliente installable et page de téléchargement.
- Deliverable :
  - Console admin `/admin` (dashboard, pays & configs, jetons, appareils, journal, sécurité), hors navigation et non indexée.
  - Application cliente `/app` plein écran, connectée à la fonction `login-token`, installable (PWA).
  - Page `/download` style fiche de store (installation PWA réelle, captures, à propos, sécurité, avis).
  - Manifest enrichi (captures d'écran) + service worker + écran de démarrage de marque.
  - Module admin « Application » : upload et gestion des versions du paquet Android, publication et mise à jour forcée.
  - Point de contrôle `app-release` + page `/download` servant le vrai APK publié.

### Phase 4 : Application façon Barka Tunnel (mieux)
- Goal : transformer `/app` en une application proche de Barka Tunnel (et au-delà) : connexion VPN visuelle + distribution de configurations.
- Deliverable :
  - Écran Accueil avec bouton **CONNECTER**, IP, ping, chrono de session et débit descendant/montant en direct.
  - Navigation de type application (en-tête, onglets, menu tiroir) et écrans **Serveurs**, **Journal**, **Paramètres**, **Guide d'installation**, **IP Finder**, **Abonnement**, **Support**.
  - Journal des connexions local (Appareil), hook de connexion partagé, version embarquée + vérification de mise à jour.
  - Polish de la page `/download` : visionneuse plein écran des captures et titre sur la bannière.

### Phase 5 : Contenu éditorial (Blog)
- Goal : ajouter du contenu SEO-friendly sans toucher au design existant.
- Deliverable :
  - Page index `/blog` listant les articles (carte titre + résumé + lien).
  - Article `/blog/creer-un-bot-telegram` (H1 unique, sections H2/H3, 4 liens internes vers Services, Formation, Contact, Projets, bloc FAQ).
  - SEO par page (title ≤60, meta description ≤155, canonical, JSON-LD BlogPosting) via un hook dédié `useSeo`.
  - Lien « Blog » ajouté au menu principal et au footer.