# FORMA — site vitrine expérimental

Base React / TypeScript / Vite. Cette branche `forma/refonte-contact-portfolio` est une **version de préparation**, distincte de la production et de `main`. Elle conserve le moteur du grand F original et présente les ajustements demandés.

## Démarrer

Pré-requis : Node.js 20+ et npm.

```sh
npm ci
npm run dev
# Autre port : npm run dev -- --port 3001
npm run build
npx playwright install chromium
npm test
```

Le serveur Vite utilise le port 5173 par défaut. Playwright utilise 5174 via `playwright.config.ts`.

## Organisation

- `src/client-spec/Home.tsx` : accueil, F original, quatre CTA autour du F. « Parlons de votre projet » ouvre `/nous-contacter`.
- `src/client-spec/Chrome.tsx` : header centré avec FORMA®, bouton client conservé et menu allégé, footer et liens légaux.
- `src/client-spec/Projects.tsx` et `public/portfolio-concepts/` : **huit projets fictifs de démonstration** (sites, logos, app, campagnes) étiquetés comme tels. Ils ne représentent pas des commandes ni des clients réels.
- `src/client-spec/Contact.tsx` : fiche de contact complète + module de questions rapides. Ce module offre des réponses FAQ et un envoi de question par e-mail après configuration; **ce n'est pas une messagerie en direct**. `docs/CONTACT.md` précise le backend à configurer.
- `src/client-spec/Legal.tsx` : textes de travail accessibles depuis le footer. **Les mentions légales et la politique de confidentialité sont incomplètes** et doivent être validées avant mise en ligne.
- `src/client-spec/InfoPages.tsx` : « Comment ça marche ? » et services conservés, page Tarification réduite à l'estimateur.
- `src/config/pricing.ts` : grille d'estimation indicative à valider; `src/content/services.ts` : 30 services avec miniatures de démonstration spécifiques.
- `public/service-examples/showcase/` : miniatures conceptuelles FORMA propres à chaque service. Les liens « Voir une référence réelle » ouvrent des **sites externes authentiques**, sans affiliation ni revendication de réalisation.
- `src/client-spec/refonte.css` : ajustements de mise en page et identité.
- `public/scene/` : moteur compilé du véritable grand F; conserver ces fichiers inchangés.
- `src/client-spec/Login.tsx` et `public/original-client/` : espace client historique. Authentification non opérationnelle sans backend OAuth configuré.

## Parcours

Accueil `/` → « Nos réalisations » sur l'accueil → `/nous-contacter`.
Le footer conserve l'accès à `/tarification`, `/politique-confidentialite` et `/mentions-legales` ; le menu principal simplifié propose Accueil, Nos réalisations, Nos services et Nous contacter. L'icône client reste dans le header.

## Avant publication

Le travail graphique est présent mais le projet **n'est pas prêt pour une publication commerciale sans configuration** : service d'envoi inexistant, données légales manquantes, grille des prix non approuvée, référence portfolio à remplacer progressivement par des réalisations autorisées. Voir `docs/PRE_LANCEMENT.md` pour la feuille de route.

Aucune modification de production ni activation de paiement n'est comprise dans cette branche.

## Finitions et démonstrations (novembre 2026)

Branche `forma/finitions-responsive-20261113` :
- Icône F totalement à gauche du header, mot FORMA® centré.
- `src/content/commentCaMarche.ts` : étapes Maquette, Échange, Création et Livraison, dépliées **uniquement** lorsque leur ligne traverse le milieu de l'écran. Retour au texte masqué quand le scroll continue.
- `src/client-spec/Login.tsx` : iframe du portail historique ajustée à sa hauteur réelle, sans scrollbar intérieure.
- `src/client-spec/PricingStudio.tsx` et `src/config/pricing.ts` : estimateur totalement refait, prestations avec fonctionnalités incluses et options facturées une seule fois. Les montants sont des **brouillons indicatifs**.
- `src/client-spec/Demos.tsx` : huit projets fictifs à ouvrir depuis le portfolio; sites AUBE/HALO, logiciels interactifs ATLAS/ORBIT, deux logos vectoriels originaux et deux campagnes publicitaires conceptuelles. HALO accepte des produits dans un panier de démo sans commande; ATLAS propose des filtres interactifs; ORBIT joue une courte démonstration synthétisée localement.
- `src/content/services.ts` : trente services avec miniatures dédiées, liens vers références externes et démonstrations internes lorsqu'elles existent.
- `.github/workflows/forma-quality.yml` : compilation de production et tests Playwright desktop/mobile sur chaque push de cette branche, avec captures en artifact GitHub Actions.

**Attention aux références :** les créations sont originales mais fictives. Aucun site, logo, logiciel ou visuel n'est présenté comme un travail commandé par une marque réelle. Les références tierces sont des liens de découverte, non des partenariats.

**Avant de commercialiser :** configurer et tester le service de contact, compléter les mentions légales et la confidentialité, valider les tarifs et délais, obtenir les informations d'édition et les droits de présentation. La mention « Créations sans IA » a été remplacée par « Créations sur mesure » puisque cette vitrine contient des éléments conçus avec assistance IA.
