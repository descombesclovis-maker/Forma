# Transmission à Quadcode — FORMA avec F original préservé

## Démarrage

```bash
git clone --branch quadcode/forma-f-preserve --single-branch https://github.com/descombesclovis-maker/Forma.git Forma-Quadcode
cd Forma-Quadcode
npm ci
npm run test:archive
npm run dev
```

**Cette branche de préparation est située dans le dépôt historique** car la création d'un nouveau dépôt GitHub n'est pas autorisée par l'outil GitHub actuellement connecté. Pour isoler définitivement le projet dans un nouveau dépôt, créer le dépôt GitHub privé ou public puis ajouter une nouvelle remote et y pousser cette branche, sans modifier le dépôt historique.

Ne pas cloner `main` pour commencer : ce n'est pas la branche contenant la base préservée.

## Aider Quadcode à identifier les ressources

- Application Vite : `package.json`, `src/`, `index.html`
- Copie exécutée : `public/archive/index.html`
- Bundle 3D/animations original compilé : `public/assets/`
- Référence brute et inventaire : `reference-original/` et `reference-original/_CAPTURE_REPORT.json`
- Documentation agent : `AGENTS.md`

**Le site qui s'affiche par défaut est une copie compilée dans une iframe.** Pour vraiment le modifier, il faudra reconstruire le code des pages en React. Ne jamais intervenir directement sur le bundle minifié et prétendre avoir un site proprement éditable.

## Prompt initial
« Lis AGENTS.md et README.md, installe les dépendances, vérifie le F original dans la copie archivée, mesure précisément ses animations au scroll, garde ce comportement intact et prépare la migration en composants React éditables. Réalise une seule fonctionnalité complète; tests ciblés et commit. Ne touche pas à la production. »

## Nouveau dépôt distinct
Une fois créé sur GitHub, recopier le contenu de cette branche vers le nouveau dépôt. Le vrai code original de l'ancien FORMA n'est pas restauré ; l'archive protège les animations observables et fournit une base de référence.
