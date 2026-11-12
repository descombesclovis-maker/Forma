# MISSION CODINGFLEET — récupération du FORMA ORIGINAL, puis mise en place du dépôt

## Objectif

Le propriétaire souhaite disposer des **vraies sources du site FORMA actuellement en production**, dans ce dépôt GitHub, pour développer ensuite son site depuis CodingFleet. Ne pas recréer une maquette et ne pas remplacer FORMA par l'ancien prototype.

**Cible Git :** https://github.com/descombesclovis-maker/Forma.git
**Branche de travail :** recovery/forma-vercel-source
**Site de référence :** https://forma-publier-maintenant.vercel.app/
**Déploiement d’origine identifié précédemment :** dpl_BPeJoGPWxSeE5kmpzF5WNCeTJdrp

## Signature visuelle et technique de la vraie source

- Fond blanc cassé et quadrillage fin.
- Grande manchette noire : « Donnez forme à l’impossible. »
- Navigation Accueil / Identité visuelle / Sites web / Logos / Publicités / Applications / IA & Auto.
- F qui s’assemble pendant le défilement ; page Sites web et configurateur de prix/options.
- **Stack identifié antérieurement : React 19, TypeScript, Vite, GSAP, Three.js, React Three Fiber, Drei, Lenis.**
- **34 fichiers** d'origine avaient été identifiés en octobre 2026.
- Composants identifiés à l’époque : BuildScene, FormaLogo, TopBar, ShowcaseCatalog, LiveSiteBuilder, SiteArchitectureBrief.

La branche main actuelle a été vidée en octobre 2026. Son historique contient une **ancienne démo de formulaire** qui ne correspond pas au FORMA original. Aucun fichier du vrai site n’a été retrouvé dans cette branche.

## Travail demandé, en autonomie et SANS accès Vercel

1. Cloner ce dépôt sur `C:\IA\Forma` (ou utiliser le dépôt présent), faire `git fetch` et se placer sur cette branche. Ne pas supprimer les fichiers locaux qui pourraient contenir la vraie source.
2. Rechercher méthodiquement **sur les emplacements locaux accessibles** les sources originales : ancien dossier de travail, archives ZIP, dossier de build, anciens clones, répertoires de projets, sauvegardes et historique Git local. Faire une recherche par signatures : `BuildScene`, `LiveSiteBuilder`, `SiteArchitectureBrief`, `forma-publier-maintenant`, `Donnez forme à l’impossible`.
3. Examiner **les branches et dépôts GitHub auxquels CodingFleet a accès** pour d'éventuelles copies de la version React/TypeScript/Vite, sans toucher aux autres projets.
4. S'il existe une source candidate, la comparer à la signature technique et aux visuels du vrai FORMA. Vérifier les pages, les assets, le configurateur, les animations et les tarifs.
5. Importer uniquement la **source vérifiée complète** dans le dépôt, sans ajouter de valeurs fictives. Exclure .env, tokens, clés, node_modules et fichiers privés. Ne pas faire de lien ou import Git imbriqué.
6. Installer les dépendances, compiler, exécuter les vérifications locales, puis enregistrer un commit documenté sur cette branche. **Ne pas publier sur Vercel, ne pas merger automatiquement vers main.**
7. Remettre au propriétaire un bilan factuel : source trouvée ou non, origine et fichiers vérifiés, commit SHA, résultats du build, problèmes éventuels et commande pour démarrer.

**Important :** En l’absence de vrais fichiers source, indiquer qu'ils n'ont pas été retrouvés. Ne jamais utiliser l'ancienne maquette, un screenshot, ni une reconstruction inventée comme si elle était la version originale. Ne pas annoncer une récupération réussie tant qu'elle n'est pas validée.

## État de la récupération par ChatGPT

La branche et cet inventaire sont en place. **Les 34 fichiers source ne sont pas encore déposés.** Le connecteur Vercel lié à ChatGPT ne voit pas le projet ; cela n'implique pas que le déploiement a été effacé. Le propriétaire demande d'essayer les pistes Git et locales en priorité et de **ne pas exiger de connexion Vercel**.
