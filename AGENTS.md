# Instructions permanentes à Quadcode / agents IA — FORMA

## Mission
Faire de FORMA une vraie plateforme de vente de sites web, logiciels, logos, réseaux et identités visuelles, avec configurateur de site, espace client et administration sécurisée `/admin`. Construire **une fonctionnalité cohérente à la fois** et committer après validation.

## Conservation non négociable : F animé
Le rendu public original existe dans `public/archive/`, avec JS/CSS dans `public/assets/`. Il contient l'expérience historique du **F monumental 3D noir laqué**, avec mouvement au scroll. Ce sont des **fichiers compilés**, pas les sources React d'origine. Ne les modifier/supprimer/écraser sous aucun prétexte durant la reconstruction. Ne jamais affirmer avoir récupéré le code original.

Au premier démarrage, lancer `npm ci`, `npm run test:archive`, `npm run dev`, puis observer le F (position, dimensions, matières, reflets, animation, déclenchement au scroll, durée, direction, comportement en remontant). Faire un protocole de comparaison desktop et mobile.

Reconstruction progressive : isoler l'interaction du F dans des composants éditables (React + GSAP/Three si pertinent), **vérifier la fidélité** avec l'archive, puis seulement remplacer l'ancienne zone. Maintenir un mode référence consultable tant que la migration n'est pas finie.

## Identité
Blanc cassé, fine grille uniquement lorsque pertinente, noirs nets, F 3D noir brillant à embouts arrondis, typographie forte. Animations nombreuses mais élégantes; jamais de violet sombre générique. Lisible, responsive, accessible et rapide.

## Fonctionnalités cibles — séquence
1. Préserver et tester la vitrine et le F; établir une base **éditable** sans perdre la référence.
2. Header/menu inspiré du F; onglets Espace client, Sites web, Logiciels, Logos, Réseaux, Identités visuelles.
3. Configurateur Sites web : type de site, nom de l'entreprise, réseau facultatif, photo facultative; supprimer anciennes questions / choix de couleur.
4. Options : grands titres, description, mini-vidéo administrable, case premium; deux traits s'écartent au scroll, contenu s'ouvre; fermeture puis option suivante; sélections persistantes et estimation dynamique.
5. Demande de devis enregistrée; authentification client et espace projets.
6. `/admin` avec authentification serveur, autorisations strictes, édition contenus/services/options/vidéos/prix, demandes clients.
7. Devis et factures via solution conforme, acomptes, intégration paiement à configurer, pas de transactions fictives.

## Données / sécurité
Mettre en place une vraie base de données et contrôle d'accès. Prévoir une solution Supabase lorsque le projet atteint la phase backend; ne jamais committer `.env` ni secret. Pas de mot de passe admin codé en dur. Les routes ne sont pas protégées par simple masquage UI. N'inventez pas d'état d'implémentation.

## Processus par mission
- Inspecter uniquement fichiers pertinents, consulter `docs/PROJECT_STATUS.md` et modifier ce statut après chaque tâche.
- Livrer du code qui fonctionne, pas un audit seul.
- Exécuter les tests ciblés puis le build si nécessaire.
- Créer un commit avec liste des modifications, statut validé/non validé et difficultés restantes.
- Ne jamais déployer en production ou toucher au dépôt initial sans demande explicite.

## Première action exacte
Ne pas refaire un design arbitraire. Démarrer l'app, contrôler l'animation F archivée et préparer sa reconstruction **fidèle en composants éditables**, sans changement de l'expérience visible.
