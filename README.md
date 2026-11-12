# FORMA — espace de travail pour Quadcode

> **État réel du projet — 12 novembre 2026 :** branche de travail isolée, site public archivé et exécutable, source React/TypeScript **originale introuvable**. Ne pas confondre l'archive compilée et le code source initial.

## Démarrer en local

Prérequis : Node.js 20+ et npm.

```bash
npm ci
npm run test:archive
npm run dev
```

Ouvrir l'adresse locale affichée par Vite (en principe http://127.0.0.1:5173/).

```bash
npm run build
npm run preview
```

## Où est l'animation du F ?

- `public/archive/index.html` et `public/assets/index-*.js` / `index-*.css` conservent **la copie de distribution publique du FORMA publié**, y compris son F animé et les transitions côté client.
- `src/App.tsx` affiche cette distribution via une iframe même origine. Elle sert de **référence temporaire de fidélité**, pas de source originale entièrement éditable.
- `reference-original/` conserve séparément la capture de la distribution publique et son rapport de provenance.
- Les composants React éditables sont à reconstruire **par petites parties** en comparant visuellement/interactionnellement chaque étape au site archivé, avec priorité absolue au F en 3D noir brillant et à son animation au scroll.

## Règles essentielles

1. **Ne supprimez jamais l'archive compilée ni l'animation F pendant la migration.** Ne la remplacez pas par une image statique ni un F générique.
2. Ne touchez ni à la production Vercel ni aux branches historiques sans accord.
3. Le design de référence : blanc cassé, typographie noire, F noir brillant 3D monumental, animations maîtrisées, transitions originales.
4. Suivez les instructions de `AGENTS.md` et `QUADCODE_START_HERE.md`.
5. Pas d'identifiants ni de données clients dans Git. Pas de faux paiements, de fausses factures ni de faux chiffres.

## État des fonctionnalités

La distribution publique archivée permet de préserver la **présentation visuelle et les interactions front-end observables**. L'administration /admin, l'authentification client, la persistance, le paiement et la facturation ne sont **pas encore implémentés** dans cette base de travail.

La migration doit conserver la fonction visuelle avant d'ajouter le commerce et le back-office.

Le dossier public a été archivé à partir du site visible au moment de la capture : `https://forma-publier-maintenant.vercel.app/`. Les fichiers sources originaux n'ont pas été retrouvés.
