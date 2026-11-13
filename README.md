# FORMA — interface selon le cahier des charges client

Branche : `feature/forma-client-spec`. L’état précédent est conservé sur `backup/forma-premium-20261113`.

```sh
npm ci
npm run dev -- --host 0.0.0.0
npm run build
npm run test:archive
npm run test:visual-fidelity
npm test
```

- Accueil : `/` ; catalogue : `/#/catalogue`.
- Navigation : Sites web, Logiciels, Logos, Identité Visuelle, Contact, Vous connecter.
- Parcours web : `/#/sites` → `/#/choix-site` → `/#/formulaire` → `/#/options`.
- Référence immuable : `/?reference=original`.
- Captures exécutées desktop/mobile : [artifacts/client-spec](artifacts/client-spec).
- Sources des exemples : [public/examples/SOURCES.md](public/examples/SOURCES.md).
- Progression et limites : [docs/forma/PROGRESS.md](docs/forma/PROGRESS.md).

Le grand F est exécuté depuis son moteur compilé d’origine, pas reconstruit. Ses fichiers dans `public/archive`, `public/assets` et `reference-original` restent intacts. Un adaptateur de vue masque les anciens textes et synchronise le scroll de la scène dans l’accueil actuel, sans changer l’archive consultable.

Les données du projet, les photos et les sélections sont conservées en mémoire pendant la navigation. Aucun transfert, authentification réelle ou paiement n’est mis en place. L’intérieur de l’espace client est absent de l’interface publique. Les anciens modules restent dans l’historique et la sauvegarde ; ils ne sont pas importés par l’application active.

Les tests utilisent Chromium à `/usr/bin/chromium` ; adapter `playwright.config.ts` pour une autre machine. `npm run build` produit le site statique dans `dist`. Aucun déploiement de production n’est effectué.
