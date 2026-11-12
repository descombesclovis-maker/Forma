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
