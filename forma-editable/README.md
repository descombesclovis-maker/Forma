# FORMA — espace de reconstruction éditable

## État actuel

`npm run dev` sert une application React 19 / TypeScript / Vite hors ligne de Vercel. Pour préserver exactement le comportement pendant que les vues éditables sont reconstruites, l'écran actuel charge temporairement la distribution publique archivée dans `public/archive/`, avec ses ressources locales. Le shell synchronise le fragment d'URL entre la fenêtre et la copie intégrée.

**Ceci n'est pas le code source original ni une reconstruction React des pages.** L'interface et les interactions affichées viennent encore du build public compilé. L'archive de référence complète et son rapport restent dans `../forma-public-build/`. Le bundle, CSS et ressources publiquement accessibles ont été copiés dans `public/` afin que le test Vite ne dépende pas d'un serveur Vercel.

La suite doit remplacer graduellement `src/App.tsx` par des composants React éditables, en utilisant le build archivé comme référence visuelle et fonctionnelle et en comparant les comportements avant chaque remplacement. Ne pas modifier l'archive pour masquer les écarts. Aucun prix n'est ajouté ou modifié ici.

## Commandes

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

L'archive incluse est une distribution publique compilée, pas une sauvegarde des sources. Son contenu est conservé octet pour octet.
