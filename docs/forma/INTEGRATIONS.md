# Périmètre actuel — cahier des charges client

L’interface active contient uniquement l’accueil, le catalogue à quatre catégories, Sites web, Logiciels, Logos, Identité Visuelle, le parcours web (type, formulaire F, options), Contact, la connexion, la confidentialité et les termes légaux. Les anciens tableaux de bord, commandes et autres rubriques ne sont pas accessibles depuis l’interface active.

## Fonctionnel côté navigateur
- Navigation commune et footer identique.
- Original F 3D exécuté depuis son bundle préservé ; défilement synchronisé par Home.tsx.
- Trois questions exactes, validation du nom, photos locales facultatives, informations facultatives.
- Données conservées en mémoire entre les pages, sans transfert ni stockage persistant.
- Options sélectionnables entre des barres animées au scroll ; mode clavier et réduction de mouvement.
- Volumes de connexion en 3D CSS à six faces, drag souris/tactile et touches fléchées.

## Non connecté / non fourni
- Authentification réelle et transmission du formulaire de contact.
- Capacités, licences et compatibilités des logiciels LocalAi à valider.
- Données juridiques de l’entreprise, politique complète de confidentialité et conditions à fournir.
- Les prix des options n’ont pas été inventés : elles sont indiquées sur devis.
- Aucun intérieur d’espace client n’est développé dans cette mission.

## Préservation et livraison
- Sauvegarde précédente : backup/forma-premium-20261113.
- Branche de travail : feature/forma-client-spec.
- Archive de référence : /?reference=original ; fichiers originaux inchangés.
- Captures réelles et comparables : artifacts/client-spec ; sources des exemples : public/examples/SOURCES.md.
- npm run dev, npm run build, npm test, npm run test:archive, npm run test:visual-fidelity.
- Aucun déploiement, promotion ou changement Vercel exécuté.
