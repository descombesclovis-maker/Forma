# Services restant à connecter

## Demandes et commandes
- API de transmission et stockage des demandes, validation serveur, protection antispam et notifications.
- Traitement des commandes et tarification des options : aucun montant d’option inventé. Le total final reste sur devis.
- Paiement, acomptes et facturation à sélectionner et intégrer ultérieurement.

## Espace client
- Authentification serveur, récupération de compte, autorisations par projet.
- Projets, progression, échanges, documents, devis, factures et historique : interfaces vides, sans données commerciales fictives.
- Aucun mot de passe, compte ou paiement n’est traité par cet aperçu.

## Contenus à valider
- LocalAiStudio, LocalAiWeb et LocalAiVision : capacités réelles, disponibilité, licences, compatibilités et médias à fournir.
- Mentions légales, conditions commerciales, régime fiscal, politique de confidentialité et coordonnées de l’entreprise.
- Les nouvelles démonstrations sont des études visuelles fictives ; les ressources historiques ne sont pas réinterprétées comme des preuves clients.

## Technique et déploiement
- `npm ci`, `npm run dev` ; accueil `/`, référence inchangée `/?reference=original`, navigation éditable `/#/univers`.
- `npm run build` génère `dist` ; Vite statique, sans variable secrète nécessaire. Les routes utilisent le hash : pas de réécriture serveur requise.
- `npm test` utilise Chromium installé dans cet environnement. Adapter executablePath dans playwright.config.ts pour les autres machines.
- Aucun déploiement ni changement de configuration Vercel effectué.
- Fonts Google chargées par la feuille historique. Hébergement local des polices et examen du consentement à prévoir avant ouverture commerciale.
- Le F reste un composant exécuté du bundle archivé : ses sources React/Three ne sont pas disponibles. Les réglages adaptatifs et l’accessibilité du moteur historique restent à approfondir sans modifier la référence.
