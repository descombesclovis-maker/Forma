# FORMA — état vérifié au 12 novembre 2026

- ✅ Capture de la distribution publique de FORMA intégrée à l'espace de travail.
- ✅ JS/CSS de la version publiée disponibles, contenant la présentation et les animations du F.
- ✅ Enveloppe Vite + React + TypeScript et scripts de build/test disponibles.
- ✅ Projet réorganisé à la racine d'une branche Quadcode, afin d'éviter le dossier imbriqué `forma-editable/`.
- ⚠️ Code source originel (React/TS de la production) introuvable.
- ⚠️ Le F est préservé **comme animation exécutée du bundle archivé**, pas comme composant React/Three/GSAP source.
- ⬜ Reconstruction fidèle du F en code source éditable : à réaliser.
- ⬜ Authentification client/admin, base de données, configurateur modernisé, devis, factures, paiement : à réaliser.
- ⬜ Build et tests locaux de cette branche : **non exécutés par la préparation distante**. L'agent doit lancer `npm ci && npm run test:archive && npm run build`.

## Définition de terminé
Ne jamais marquer une tâche comme terminée si le code n'est pas implémenté et vérifié. Protéger les animations F pendant toute la migration.

## Références
- Site public archivé lors de la capture : https://forma-publier-maintenant.vercel.app/
- Branche d'origine de la capture : `reconstruction/forma-editable`.
- Nouvelle branche de travail : `quadcode/forma-f-preserve`.

## Mission premium — 13 novembre 2026
Branche dédiée `feature/forma-premium-interface`. Voir `docs/forma/PROGRESS.md` pour la progression vérifiée. Tests d'archive et garde-fous visuels exécutés avec succès ; référence observée dans Chromium.
Catalogue et parcours frontend implémentés ; trois scénarios Chromium ciblés validés, build réussi. Les connexions externes restent absentes et explicitement signalées. Détails et limites dans docs/forma/PROGRESS.md et INTEGRATIONS.md.

## Cahier des charges client strict — mission suivante
État sauvegardé sur backup/forma-premium-20261113. Travail sur feature/forma-client-spec. Header, accueil et footer remplacés conformément à la nouvelle structure ; ressources originales intactes, vérification desktop et build réussis. Voir docs/forma/PROGRESS.md.
Catalogue à quatre catégories et parcours type → trois questions dans le F → barres d’options au scroll implémentés. Connexion uniquement avec volumes manipulables. Huit tests Chromium réussis ensemble, build et conservation réussis. Captures réelles : artifacts/client-spec/README.md. Authentification, envoi Contact et contenus juridiques/logiciels restent à connecter ou valider. Aucun intérieur client public, aucune action Vercel.
