# FORMA — Intégration ciblée : catégories et tarifs

Cette branche reprend **la vraie vitrine FORMA archivée**, et non le design inventé par la maquette HTML séparée. Le F 3D original, son animation au scroll, le fond, les typographies, les sections et les styles sont conservés.

## Catégories

Sites web · Logiciels · Logos · Réseaux · Identités visuelles. Accès « Espace client » ajouté à la navigation.

## Formules des sites

| Offre | Prix de départ |
| --- | ---: |
| One Page | 590 € |
| Vitrine Essentiel | 990 € |
| Site Business | 1 390 € |
| Site Premium | 1 990 € |
| Boutique e-commerce | 2 490 € |
| Sur mesure | Sur devis |

## Développement

- `catalog/forma-pricing.json` : données éditables.
- `scripts/build-forma-catalog.mjs` : transforme la copie **compilée** du bundle d'origine sans la modifier.
- `public/assets/forma-catalogue-v1.js` : variante de la distribution exécutée.
- `public/forma-catalogue/index.html` : entrée de la variante.
- `src/App.tsx` : affiche cette variante sans changer le reste du shell.

L'archive d'origine demeure disponible dans `public/archive/index.html`, et le bundle d'origine `public/assets/index-kVG0ynuN.js` est inchangé.

Commande de reconstruction : `node scripts/build-forma-catalog.mjs`.

Commandes de vérification : `npm ci && npm run test:archive && npm run build && npm run dev`.

**Important :** la vitrine reste basée sur le bundle compilé ; il ne s'agit pas du code source original récupéré. Le F reconstruit en React par Quadcode serait à intégrer séparément après push et validation. Aucun déploiement de production n'est effectué. Les boutons des autres services et la facturation ne sont pas inclus dans cette modification ciblée et seront revus un à un.

Les prix sont des estimations de départ, pas des devis contractuels. Les détails de TVA et options supplémentaires seront traités plus tard.
