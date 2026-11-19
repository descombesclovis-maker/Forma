# FORMA — Portail client, lot 1 (authentification et lecture)
Branche : feat/forma-client-portal

## Réalisé dans ce lot
- Page /espace-client : connexion, inscription, confirmation par e-mail si exigée, demande de réinitialisation, sorties OAuth Google/GitHub/X, déconnexion.
- Tableau de bord personnel : projets, commandes, notifications, activité, sans fausses données.
- Migration SQL RLS avec séparation stricte de lecture par auth.uid() et écritures réservées aux services de confiance.
- Aucune nouvelle dépendance, aucune modification de la vitrine publique, de ses scènes et de son portfolio.

## État honnête
La branche est **non commercialisable** sans une instance Supabase exclusivement dédiée à Forma. Aucune des deux instances Supabase actuellement visibles n'est identifiée comme appartenant à Forma : ne pas réutiliser un projet tiers.
Le navigateur emploie le jeton Supabase de la session dans sessionStorage (pas de service role). Ce premier lot est réservé aux métadonnées non sensibles des projets. **N'y placer ni mots de passe clients, ni archives, ni clés privées.** Les livraisons chiffrées requièrent un backend de coffre-fort, URLs signées brèves et une politique de gestion de clés avant activation.

## Configuration nécessaire
1. Créer / désigner un projet Supabase dédié à Forma, en tenant compte des coûts éventuels et de la région RGPD.
2. Exécuter et relire la migration supabase/migrations/20261118_forma_client_portal.sql.
3. Configurer Auth > Email, politique de confirmation, URL du site et URL de redirection vers /espace-client.
4. Configurer les fournisseurs OAuth Google, GitHub et X (OAuth 2.0) depuis les consoles de ces plateformes. Les client secrets restent dans Supabase.
5. Définir dans `.env.local` (ou variables Vercel) `VITE_FORMA_SUPABASE_URL` et `VITE_FORMA_SUPABASE_ANON_KEY` (clé publique uniquement). Ne jamais utiliser la clé service_role en frontend.
6. Vérifier avec deux comptes réels que A ne voit aucun objet de B, que les créations côté client sont refusées, que les contrôles mobiles fonctionnent et que les liens OAuth reviennent sur l'origine autorisée.
7. Avant publication, revue sécurité approfondie des sessions, politique CSP/XSS, RGPD et mots de passe. Étudier un backend de sessions cookie HttpOnly pour le futur coffre-fort.

## Suite de feuille de route (non incluse ici)
- Connexion réelle pour comptes clients + politiques de sécurité et tests navigateur OAuth ; aucun identifiant de test n'est inventé.
- Backend gestion admin, liaison preview validée de LocalAiWeb ↔ fiche projet Forma ↔ commande, protocole signé et idempotent via interrogation du Studio local.
- Catalogue à prix contractuels et conditions dépliables/versionnées, achat direct par prestataire sécurisé et webhooks signés, gestion résiliation.
- Vérification vendeur → approbation client → transfert chiffré de documents et accès révocables → livraison.
- Mise en ligne seulement après validation humaine et juridique.

## Validation de la branche
- Build Vite / TypeScript et tests Playwright via GitHub Actions : premier lot réussi (run 44374687437).
- Préservation de la scène 3D d’origine dans la vue de connexion opérationnelle ; son formulaire historique non configuré reste masqué.
- Préparation du parcours de changement de mot de passe après lien de récupération Supabase.
- Authentification réelle non testée en conditions de production sans instance dédiée et fournisseurs OAuth configurés.

## 18 novembre 2026 — OTP, connexions sociales et finitions
- Vérification d'inscription par code à six chiffres, renvoi temporisé, template `{{ .Token }}` fourni (activation manuelle dans Supabase).
- Icônes officielles Google/GitHub/X avec libellés accessibles. Activation OAuth réelle seulement après configuration des client IDs/secrets.
- Animations de survol/clic et contraste automatique noir/blanc du curseur sur les pages Forma.
- Recul CSS du canevas 3D archivé pour un cadrage plus large ; FOV interne inchangé faute de sources 3D.
- Tests réels de courriels et OAuth restent à réaliser sur l'instance Supabase hébergée.

- Curseur contrasté relayé dans les iframes same-origin pour conserver l'interaction 3D ; sans accès aux iframes externes.

## P0 — Contact et devis gratuit

Branche `feat/contact-devis-p0`, basée sur `f0a7498`. Le développement mobile non commité a été laissé dans sa copie de travail.

- Formulaire public et estimateur reliés à un reçu PostgreSQL. Types contact, question rapide et devis. Numéro professionnel affiché seulement après configuration.
- Administration `/admin/demandes` réservée au compte fondateur vérifié côté serveur. Consultation du contenu, des références et des états Telegram/SMTP ; relance par canal.
- Recette ciblée sur PostgreSQL réel et isolé : enregistrement, lecture par une deuxième connexion, validation, conflit d’identifiant, concurrence, dédoublonnage, limitation, accès anonyme/client/fondateur et indisponibilité du stockage. Échecs indépendants des deux canaux et reprise testés avec des prestataires simulés.
- Chromium sur 390, 820 et 1366 px : devis depuis l’estimateur, conservation du récapitulatif, rejet d’un faux reçu HTML 200, référence après écriture effective, administration fermée au visiteur. Compilation réussie. Suite existante : 12 tests Playwright réussis avec un plafond de 180 s par scénario.
- Reste à vérifier en recette privée : compte fondateur réel dans Supabase, réception sur son Telegram et réception du courriel dans une boîte autorisée. Aucun paiement, envoi réel de recette ou déploiement de production effectué. Variables, droits et procédure dans `docs/CONTACT.md`.

## P0 — Diagnostic du POST sur la Preview protégée

Le 19 novembre 2026, GitHub associait deux projets Vercel au commit `2b5e0e2`. Sur la Preview GitHub de `forma-publier-maintenant`, un POST sans cookie a reçu HTTP 401 de la protection Vercel. Le formulaire utilisait `credentials: "omit"`. La requête corrigée transmet les cookies uniquement à la même origine. Le serveur conserve la validation et le dédoublonnage. Les erreurs serveur exposent une catégorie technique dans les journaux sans les valeurs des entrées ni les secrets.

Le catalogue du projet Supabase Forma montrait RLS activée sur les deux tables et aucune politique. Les GRANT du rôle serveur étaient présents. Ce rôle n’est ni propriétaire des tables ni exempté de RLS. La migration complémentaire `server/contact-runtime-policies.sql` ajoute les cinq politiques nécessaires. Les rôles publics Supabase ne sont pas membres de ce rôle serveur.

En recette isolée, le test avec RLS reproduit le refus, applique la migration, obtient HTTP 201, relit la référence et les deux états de notification par une connexion indépendante, puis retrouve la même référence à la répétition. Connexion refusée, droits insuffisants, secret absent et saisie invalide sont également couverts. Chromium a enregistré trois devis aux largeurs 390, 820 et 1366 px. Le contrôle navigateur vérifie le cookie de même origine, les réponses 401 et HTML 200, la conservation du contenu et de la clé à la reprise. Compilation réussie. La réception sur la chaîne hébergée exige encore une Preview corrigée, la migration dans la base ciblée et la concordance reçu/ligne en base. Les valeurs et la portée des variables du déploiement affecté restent à vérifier dans Vercel.

Suite générale après correction : 12 scénarios Playwright réussis.

## P0.2 — Certificat du pooler Supabase

La fonction de contact inclut le certificat public Supabase Root 2021 CA et fournit son chemin à pg-connection-string avec vérification complète du nom DNS. Validation avec pg 8.23.1 et pg-connection-string 2.14.1 : options TLS et empreinte du fichier déclaré pour Vercel vérifiées, requête SQL chiffrée sur PostgreSQL de test avec une CA de test, refus d’une CA inconnue et d’un nom d’hôte incorrect. Les tests contact/devis et la compilation ont réussi. Le port 5432 du pooler était inaccessible depuis l’environnement de développement. La confirmation attendue sur la Preview reste un POST 201 dont la référence est relue dans Supabase.

## Portail client — connexion et confirmation à six chiffres

Base `c4650c6`, branche `feat/espace-client-session`. Réutilisation du portail et de Supabase Auth. Connexion par mot de passe ou OTP de six chiffres pour un compte existant, restauration après rechargement, rotation unique du jeton et déconnexion de la session courante. Le retour de récupération survit au rechargement. Les quatre lectures sont filtrées par l’identifiant renvoyé par Auth, en plus des politiques RLS. L’administration existante vérifie toujours le fondateur côté serveur.

Le projet Forma a été inspecté en lecture seule : fournisseur Email actif, confirmation requise, lecture anonyme des projets refusée (401), RLS et politiques de lecture par propriétaire sur les quatre tables. Le test navigateur isolé couvre un code refusé puis accepté, le renouvellement, les lectures privées, le refus de l’administration au client, la connexion par mot de passe, la récupération et la déconnexion à 390 et 1366 px. La livraison d’un vrai code et la connexion en Preview nécessitent une boîte contrôlée par un vrai client. Voir `docs/OTP_OAUTH_FORMA.md` pour les réglages de longueur, modèles, SMTP, variables et URL de retour.
