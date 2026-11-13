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

La connexion et le formulaire de contact affichent honnêtement l’absence de service. Aucune authentification, transmission de message ou transaction n’est simulée. Le projet et ses photos sont conservés en mémoire pendant la navigation ; le rechargement les efface. Les informations juridiques et les capacités des logiciels restent à valider.
