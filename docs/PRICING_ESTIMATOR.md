# Estimateur FORMA — grille de départ

Les montants de `src/config/pricing.ts` sont des **propositions de travail indicatives**, rédigées pour permettre d’évaluer les interactions du calculateur. Ils ne sont ni des moyennes officielles du marché, ni des devis, ni une grille commerciale approuvée. FORMA doit vérifier chaque montant par rapport au périmètre réellement livré, au temps de travail, aux coûts logiciels/hébergement, à la maintenance et à sa politique commerciale avant publication publique.

## Modifier les prix et options

Dans `src/config/pricing.ts` :

- `base` : prix de base ponctuel en euros pour un sous-type.
- `options[].price` : supplément ponctuel, ou prix unitaire si `quantity` est renseigné.
- `options[].quantity` : unité et quantité maximum d’une option variable (pages, écrans, propositions, déclinaisons, packs).
- `options[].recurring` : frais récurrents affichés séparément, avec montant et période.
- `complexity` : options ponctuelles pour les besoins techniques ou créatifs supplémentaires.
- `label` : libellé affiché dans l’estimateur.

Le total ponctuel est calculé comme prix de base + options ponctuelles sélectionnées. Les frais récurrents restent séparés du total ponctuel. Aucun prix de TVA n’est calculé ou affiché : le régime fiscal de FORMA n’est pas confirmé. La page rappelle que le résultat est indicatif et non contractuel.

Le bouton « Discuter de ce projet » prépare un sujet et un récapitulatif dans le formulaire Contact. Il n’envoie pas de commande, n’établit aucun devis contractuel et ne déclenche aucun paiement. L’envoi du formulaire reste soumis à la configuration du backend sécurisé décrite dans `docs/CONTACT.md`.
