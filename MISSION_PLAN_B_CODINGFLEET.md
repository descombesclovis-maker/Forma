# MISSION POUR CODINGFLEET — PLAN B SANS ACCÈS VERCEL

## Résultat des recherches précédentes

Le véritable code source React/TypeScript de FORMA **n'est pas** dans le dépôt GitHub `descombesclovis-maker/Forma`. Le site public est visible, mais l'ancien dépôt Git a été vidé le 20 octobre 2026 ; aucun autre dépôt accessible ni aucune archive locale n'a fourni les sources originales.

**Il est impossible de restaurer exactement les fichiers originaux à partir d'une capture d'écran ou d'un bundle compilé.** Pour permettre de reprendre le développement **sans authentification Vercel**, nous allons d'abord figer une copie exécutable du build public, puis recréer progressivement un projet source équivalent et éditable, validé visuellement et fonctionnellement. Cette distinction doit être claire dans chaque rapport.

## Dépôt à utiliser

`https://github.com/descombesclovis-maker/Forma.git`

Branche : `recovery/forma-public-build`

Site officiel à archiver : `https://forma-publier-maintenant.vercel.app/`

## Étape 1 — Capture du build public

1. Cloner/ouvrir ce dépôt dans `C:\IA\Forma`, puis `git fetch` et `git switch recovery/forma-public-build`. Si le dossier local contient des sources non suivies, **ne rien supprimer**.
2. Depuis la racine du dépôt, exécuter **sans connexion Vercel** :

   ```bash
   node scripts/capture-forma-public.mjs
   ```

3. Le script télécharge la page publique et les ressources statiques visibles dans le dossier `forma-public-build/`. Il refuse d'écraser un dossier existant. Il ne demande aucun jeton et ne touche pas à la production.
4. Lire `forma-public-build/_CAPTURE_REPORT.json` : relever les téléchargements et erreurs. Si la capture est partielle, réparer le script ou compléter **uniquement à partir de fichiers publics**, puis relancer sans écraser silencieusement l'existant.
5. Pour inspecter localement :

   ```bash
   node scripts/serve-forma-public.mjs
   ```

   URL locale : `http://127.0.0.1:4179/`

6. Vérifier le rendu avec des captures comparatives du vrai site. Tester les liens, menus, scroll, animation F, les pages (dont « Sites web »), le sélecteur de type et les options/prix. Tester également sur mobile. Les fonctionnalités dépendant d'API doivent être signalées **non vérifiées**.
7. Commit de la capture et du rapport sur cette branche uniquement, si la capture est suffisamment complète. Jamais de push sur `main` ni de déploiement automatique.

## Étape 2 — Récupération d'une base source éditable

Quand le build public est archivé et comparé :

1. Recréer une application source moderne (React, TypeScript, Vite) **dans un dossier distinct**, en réutilisant légalement les ressources publiques et en reproduisant l'expérience du site existant.
2. Ne pas prétendre reconstituer le code original ligne pour ligne : il s'agit d'une **reconstruction fonctionnelle fidèle** fondée sur le site et le bundle public.
3. Donner la priorité à la fidélité d'apparence et des comportements existants, **avant** toute amélioration du cahier des charges.
4. Extraire ou reconstituer les données de catégories et les tarifs seulement lorsqu'ils sont réellement observables et vérifiables ; ne jamais inventer les prix.
5. Préserver le F au scroll, les transitions, les deux chemins de navigation vers « Sites web », l'architecture des pages et le configurateur.
6. Ajouter des tests de navigation et des comparaisons visuelles ; enregistrer les écarts et corriger le code. Ne pas modifier le site Vercel actuellement publié.
7. Commit dans une nouvelle branche de développement **après** validation. Ne pas merger vers `main` avant accord du propriétaire.

## Critères d'acceptation

- `forma-public-build/index.html` et tous les assets essentiels sont présents et lisibles.
- Un navigateur local affiche le site sans erreurs majeures de chargement.
- Le rapport distingue explicitement « build public archivé », « code source reconstruit » et « code source original introuvable ».
- L'état Git est clair et les commits sont fournis.
- Aucune action Vercel, aucune authentification, aucune mise en ligne et aucune modification du design non demandée.

## Informations visuelles de référence

Site blanc cassé, lignes de grille fines, titre noir géant « Donnez forme à l'impossible. », navigation Accueil / Identité visuelle / Sites web / Logos / Publicités / Applications / IA & Auto, menu supérieur droit, F au scroll, configurateur avec prix de départ et cases à cocher.

**Ne pas restaurer l'ancien formulaire noir du dépôt historique. Il ne correspond pas au véritable FORMA.**
