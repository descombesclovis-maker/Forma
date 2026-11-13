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

# Refonte selon le cahier des charges client — 13 novembre 2026
- Sauvegarde distante : backup/forma-premium-20261113 (état 724b85a).
- Branche de travail : feature/forma-client-spec.
- Header commun : F corrigé par surcharge de géométrie, survol historique conservé, Forma® centré, accès connexion, menu latéral à six entrées exactes.
- Accueil : animation de trois volumes noirs sur la grille ; séquence originale du grand F exécutée sans modification des fichiers historiques ; CTA exact vers catalogue ; aucun service après le F.
- Footer commun : structure noire, Forma®, confidentialité, six destinations et termes légaux, sans slogan.
- Vérification Chromium desktop : centrage 720/1440, six entrées exactes, opacité F=1 lors du scroll ; captures exécutées dans artifacts/client-spec/. Build et conservation des 12 ressources : réussis.
- Suite : catalogue et exemples authentiques, type de site, formulaire F à trois questions, options au scroll et connexion manipulable.

## Catalogue, parcours et connexion — nouveau périmètre strict
- Catalogue : quatre catégories exactes ; captures authentiques TodoMVC, Bootstrap, Excalidraw et Medusa, sources cliquables et notices de licences dans public/examples. Les illustrations de marque restent les ressources FORMA historiques.
- Type de site : trois choix exacts, images réelles et attribution en bas à droite ; les six tarifs validés restent présentés dans Sites web.
- Formulaire : nom obligatoire, photos facultatives et informations complémentaires facultatives ; les champs sont dans les segments du F, les réponses sont modifiables, photos et réponses conservées en mémoire entre les pages. Aucun champ supplémentaire.
- Options : cinq familles de fonctionnalités de sites, 20 sélections sur devis. Deux barres brillantes s’écartent puis se referment au scroll, avant la catégorie suivante. Conservation des sélections ; ouverture au clavier et affichage stable en réduction de mouvement.
- Connexion : email et mot de passe uniquement, trois volumes en lévitation, glisser à la souris/tactile, flèches au clavier ; retour à la lévitation. Aucun intérieur client ni compte fictif.
- Contact et pages obligatoires confidentialité/termes : contenus minimaux, absence de transmission explicitement indiquée. Informations juridiques non inventées.
- Anciennes rubriques non importées et absentes des menus/routes publics : réseaux, portfolio, tarifs globaux, FAQ, méthode, à propos, comparateur, compte et tableaux de bord.
- Validation intermédiaire : 6 scénarios sur 7 réussis, puis correction du démarrage de la scène originale et test accueil ciblé réussi. Suite complète relancée après correction.

## Résultat vérifié — livraison du cahier des charges
- Build TypeScript/Vite réussi ; archive : 12 fichiers identiques ; garde-fous de fidélité réussis.
- Suite complète : **8 scénarios Chromium réussis ensemble**, 55,3 secondes. Desktop, mobile, souris, clavier et geste tactile natif via le protocole Chromium. Aucun appareil physique ni Safari revendiqué.
- Vérifiés : centrage, six entrées du menu, huit liens exacts du footer, séquence F et retour, CTA/catalogue, trois types/images, trois questions/photo/modification/conservation, ouverture et fermeture des barres, sélections persistantes, drag et lévitation, réduction du mouvement, absence de faux succès et des anciennes pages/dashboard.
- Après remplacement du visuel abstrait Identité Visuelle par une vraie page du manuel NASA et des flèches d’attribution par SVG : build réussi ; parcours formulaire et revue des interfaces desktop/mobile relancés.
- Captures réelles : index artifacts/client-spec/README.md ; exemples et licences : public/examples/SOURCES.md. Les exemples ne sont pas des réalisations clients FORMA.
- Incomplet par absence de services/données : authentification réelle, envoi Contact, fiches techniques définitives des logiciels, mentions juridiques validées. Aucun intérieur client développé.
- Aucun fichier historique modifié, aucune action de déploiement ou mutation Vercel.
