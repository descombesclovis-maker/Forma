# FORMA — progression

## 13 novembre 2026 — préservation
- Branche : feature/forma-premium-interface, issue de feature/forma-catalogue-tarifs-v1.
- Branches recovery/forma-vercel-source, recovery/forma-public-build et quadcode/forma-f-preserve examinées ; aucune source originale complète retrouvée.
- Archive et référence intactes. Test d'archive corrigé pour utiliser reference-original local (12 fichiers identiques).
- Installation et tests de conservation validés ; référence desktop observée dans Chromium, capture artifacts/original-desktop.png.
- F conservé par exécution du bundle original, pas récupéré en sources éditables.
- Prochaine étape : navigation et catalogue éditables ; comparaison F desktop/mobile et interactions.

## Catalogue et parcours éditables
- Pages accessibles par `/#/univers` : sites web, logiciels, identités/logos, réseaux/publicité, démonstrations, tarifs, contact, espace client, à propos, méthode, FAQ et informations provisoires.
- Six prix web préservés. Comparaison, configuration en F par étapes, retour sur les réponses, options sur devis, base estimative réactive, sauvegarde facultative et export texte.
- Demande relisible et téléchargeable, sans confirmation d’envoi. Galerie fictive filtrable avec modale, vues ordinateur/tablette/téléphone, focus et Échap.
- Espace client : rubriques navigables et états vides explicites ; aucune authentification simulée.
- Styles historiques réutilisés pour le petit F. Styles ajoutés isolés après correction d’une collision `.intro`. Flèches ajoutées en SVG pour éviter les glyphes absents.
- Fichiers : src/App.tsx, Archive.tsx, ProjectFlow.tsx, Gallery.tsx, Client.tsx, ui.tsx, catalog.ts, premium.css, styles.css ; tests/interface.spec.ts, playwright.config.ts.
- Vérifications : build TypeScript/Vite réussi ; tests d’archive et conservation réussis ; 3 scénarios Chromium ciblés réussis (configuration/devis, galerie/routes/client, mobile sans débordement). Grand F observé dans Chromium, captures conservées. Vérification complète F desktop/mobile en cours.
- Limites : pas de backend ; options non chiffrées ; logiciels et mentions juridiques en attente de données validées ; pas de note 10/10 revendiquée. La référence compilée reste immuable et le F n’est pas éditable en sources.
- Services à connecter : voir INTEGRATIONS.md.

## Validation finale de cette livraison
- Les 4 scénarios initiaux sont passés ensemble : configuration/devis, galerie/client/routes, mobile, archive/F desktop et mobile (67 % puis retour à 0 %).
- Après corrections de continuité : 4 scénarios ciblés passent, dont un nouveau contrôle des liens depuis l’accueil original et du préremplissage de la prestation depuis les logiciels. La formule Premium est conservée dans la demande de devis.
- Build TypeScript/Vite, comparaison des 12 ressources et garde-fous des animations : réussis.
- Captures desktop/mobile consultées dans artifacts/. Le grand F reste volontairement monumental, avec son cadrage historique sur mobile ; aucune retouche de la référence.
- Menu : focus à l’ouverture, Échap, contenu principal inerte pendant l’ouverture. Modale : focus contenu, boucle clavier, restauration après fermeture.
- Deux premiers commits poussés sur GitHub ; finitions et preuves ajoutées dans le commit final de livraison. Aucune action de déploiement, promotion ou modification de production.
- Prochaine étape : approfondissement artistique des pages et des animations de section, démonstrations métier détaillées, optimisation/accessibilité du moteur historique, puis intégrations selon autorisation. L’interface livrée est fonctionnelle ; l’ensemble de l’objectif premium 10/10 n’est pas déclaré achevé.
