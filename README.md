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
