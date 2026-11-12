# FORMA — récupération de la version originale

**Objectif :** retrouver les **fichiers réels**, pas reconstituer le site depuis une capture d’écran.

- Domaine du projet : `forma-publier-maintenant.vercel.app`
- Déploiement original (octobre 2026) : `dpl_BPeJoGPWxSeE5kmpzF5WNCeTJdrp`
- Repository cible : `descombesclovis-maker/Forma`
- Branche de récupération : `recovery/forma-vercel-source`

## Constat

La branche `main` du dépôt Github a été vidée le 20 octobre 2026. L’historique comprend une ancienne maquette de questionnaire, mais **pas** le véritable site multipage. Il ne faut pas restaurer cette maquette comme site de production.

L'authentification Vercel du connecteur ChatGPT actuel ne donne accès à aucun projet. La récupération doit passer par **le compte Vercel propriétaire du déploiement original**. Le script ci-joint utilise uniquement la session Vercel CLI locale et ne réclame aucun secret dans un chat.

## Récupération par CodingFleet — sans aucun déploiement

1. Ouvrir ou cloner **cette branche de récupération** en local.
2. Exécuter `npm i -g vercel` (si la CLI n'est pas installée).
3. Exécuter `vercel login`, puis `vercel switch` et choisir **le compte/l'équipe propriétaire** de Forma.
4. Exécuter `node scripts/recover-forma.mjs` depuis la racine.
5. Si Vercel demande un `teamId`, renseigner la variable d'environnement `FORMA_VERCEL_TEAM_ID` *localement* puis relancer. Ne pas envoyer de jeton dans le chat.
6. Examiner le dossier `RECOVERED_FORMA/`. Vérifier l'intégrité des fichiers et la présence des modules originaux, notamment `BuildScene`, `FormaLogo`, `TopBar`, `ShowcaseCatalog`, `LiveSiteBuilder` et `SiteArchitectureBrief`, signalés dans l'inventaire historique.
7. Si des fichiers échouent, **ne rien copier** en racine. La récupération doit être complète avant tout changement.
8. Une fois la copie vérifiée, la transférer dans la racine du projet sur une branche dédiée, installer les dépendances, lancer les tests ciblés et créer un commit. **Ne jamais déployer ou merger automatiquement vers main.**

## Si le déploiement est lié à un dépôt Git

L'API Vercel ne fournit pas systématiquement l'arbre source pour les déploiements Git. Dans ce cas, rechercher le champ `gitSource` du déploiement et le dépôt lié dans **Vercel > Projet Forma-publier-maintenant > Settings > Git**, puis cloner le dépôt source : cela prime sur toute tentative de reconstruction.

## Limites et sûreté

- Ne pas remplacer le site original par le prototype de questionnaire figurant dans l'ancien historique.
- Ne pas inventer les prix, modules, assets ou animations manquants.
- Ne pas pousser les `.env`, identifiants, clés ou fichiers système.
- Le script ne modifie ni le déploiement Vercel ni GitHub.
- Les fichiers récupérés doivent être vérifiés avant import dans `main`.

Cette branche ne contient **pas encore** la source de production de Forma.
