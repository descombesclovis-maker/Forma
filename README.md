# FORMA

Interface React / TypeScript / Vite. Une seule version : `main`.

## Exécuter

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Vérifier

```sh
npx playwright install chromium
npm test
```

Les tests parcourent l’accueil et son F original, le menu, le catalogue, les trois étapes du formulaire F, les options au défilement, la connexion manipulable et le contact, sur ordinateur et mobile. Ils vérifient les sélections, le clavier, le tactile et la réduction des animations. Les captures réelles sont générées dans `test-results/captures/`, exclu de Git.

## Fichiers conservés

- `src/` : l’interface actuelle, sa navigation et ses styles.
- `public/scene/` : le moteur compilé de la scène 3D originale et son adaptateur minimal. Géométrie, matières, éclairage, caméra et assemblage sont conservés. Aucune ancienne page n’y est montée.
- `public/examples/`, `public/portfolio/` : uniquement les visuels utilisés et leurs attributions/licences.
- `tests/` et fichiers de configuration : compilation, contrôle des parcours et déploiement.

Le moteur `engine.js` provient du bundle original `index-kVG0ynuN.js` : sa partie jusqu’à la fonction `cA` a été conservée à l’identique, puis les anciennes interfaces ont été retirées. `scene.js` expose seulement le grand F avec le même pilotage ScrollTrigger ; `src/identity.css` conserve les règles originales du petit logo et de la typographie.

## Déploiement

Le projet Vercel existant est `forma-publier-maintenant`. `vercel.json` définit Vite, `npm ci`, `npm run build` et le répertoire `dist`. Le dépôt est relié à Vercel : publier `main` déclenche le déploiement de production sur l’hébergement existant.

Les routes publiques utilisent des fragments `/#/…`. Aucun secret n’est nécessaire pour compiler cette interface.

## Connexions restant à réaliser

La connexion par mot de passe et le formulaire de contact affichent honnêtement l’absence de service. Aucune authentification, transmission de message ou transaction n’est simulée. Le projet et ses photos sont conservés en mémoire pendant la navigation ; le rechargement les efface. Les informations juridiques et les capacités des logiciels restent à valider.

### Connexion Google / GitHub / X

Les boutons OAuth ne sont activés que lorsqu’un point d’entrée backend est configuré. En local, ajoutez dans `.env.local` :

```dotenv
VITE_FORMA_OAUTH_START_URL=https://api.votre-domaine.example/auth/oauth/start
```

Cette variable est une URL publique, jamais un secret. Elle doit pointer vers un backend FORMA qui accepte `?provider=google`, `?provider=github` ou `?provider=x`, puis réalise le flux OAuth du fournisseur. Sans cette variable, les trois boutons restent visibles mais désactivés et l’interface indique clairement que la connexion rapide n’est pas configurée.

**Aucun secret client OAuth ne doit être placé dans Vite, dans une variable `VITE_*`, dans le bundle ou dans le dépôt.** Les identifiants/secrets et les URI de retour Google, GitHub et X doivent être configurés uniquement côté serveur chez chaque fournisseur. Le backend doit générer et vérifier `state` et PKCE, limiter les URI de retour autorisées, valider les jetons côté serveur, puis créer la session FORMA avec un cookie `HttpOnly`, `Secure` (en production) et `SameSite` approprié. Le backend doit aussi gérer les erreurs et renvoyer l’utilisateur vers une page FORMA déterminée. L’application ne prétend pas qu’un utilisateur est connecté tant que cette intégration serveur n’est pas construite et vérifiée.

Le point d’entrée backend et les applications OAuth des fournisseurs ne sont pas configurés dans ce dépôt à ce jour ; les boutons resteront donc désactivés jusqu’à leur mise en place.
