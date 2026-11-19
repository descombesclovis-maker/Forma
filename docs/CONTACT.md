# Contact public, devis gratuit et boîte de réception Forma

Le menu ouvre `/nous-contacter`. Le visiteur choisit renseignements ou devis gratuit. L’estimateur transmet son récapitulatif au formulaire et présélectionne le devis. `/devis` ouvre également ce formulaire. Le lien de renseignements reste accessible à côté de l’action principale de l’offre. La branche de référence ne présente aucun paiement à cet emplacement.

## Configuration pour une recette privée

1. Ouvrir la branche dans VS Code, exécuter `npm ci`, puis copier `.env.example` vers `.env.local`. Conserver les réglages du portail existant.
2. Utiliser une base PostgreSQL de test, éventuellement celle du projet Supabase Forma. Avec son propriétaire, appliquer une fois `psql "$DATABASE_ADMIN_URL" -v ON_ERROR_STOP=1 -f server/contact.sql`. Le script crée un schéma privé dédié dans une transaction et refuse de remplacer un schéma existant. Ne pas exposer ce schéma dans la Data API Supabase.
3. Créer un rôle de connexion dédié, par exemple `forma_contact_app`, avec un mot de passe géré hors Git. Lui accorder uniquement les droits suivants (le rôle doit pouvoir se connecter à la base). Conserver ces tables hors des rôles publics Supabase.

   ```sql
   grant usage on schema forma_contact to forma_contact_app;
   grant select, insert on forma_contact.requests to forma_contact_app;
   grant select, insert, update on forma_contact.notifications to forma_contact_app;
   ```
4. Après les GRANT, appliquer une fois `server/contact-runtime-policies.sql` avec le propriétaire des tables. Cette migration transactionnelle active la sécurité par ligne et autorise le rôle serveur dédié à lire et créer les demandes, ainsi qu’à traiter leurs notifications. Pour une installation existante, conserver les tables et utiliser uniquement cette migration complémentaire.
5. Définir les variables du tableau ci-dessous. Démarrer `npm run dev`. Le middleware Vite dessert la même API que la fonction Node Vercel. Le téléphone ne s’affiche qu’une fois renseigné.
6. Depuis un navigateur non connecté, utiliser l’estimateur puis « Demander mon devis gratuit ». Conserver la référence. Depuis une session fondateur ouverte sur `/espace-client`, ouvrir `/admin/demandes`. Déplier la demande, comparer son contenu et la référence.
7. Vérifier physiquement le message sur le Telegram du fondateur **et** le courriel dans la boîte du visiteur. En cas d’échec, corriger la configuration puis relancer le canal concerné dans l’administration. Un statut « accepté » atteste la réponse du prestataire. La réception finale peut dépendre des filtres antispam.
8. Avant l’ouverture publique, valider la durée de conservation, les informations légales et les destinataires, l’accès aux sauvegardes et la restauration. Tester sur le domaine final en HTTPS ; aucun déploiement n’est effectué par cette procédure locale.

| Variable | Emplacement et usage |
|---|---|
| VITE_FORMA_CONTACT_ENDPOINT | Publique. Utiliser `/api/contact` sur Forma. Vide conserve l’état non configuré. Un ancien endpoint externe doit respecter le nouveau contrat de reçu. |
| VITE_FORMA_PHONE | Publique. Numéro professionnel réellement attribué à Forma. |
| VITE_FORMA_SUPABASE_URL, VITE_FORMA_SUPABASE_ANON_KEY | Configuration publique déjà utilisée pour la connexion. Le serveur l’utilise également pour vérifier le jeton auprès de Supabase Auth. |
| FORMA_FOUNDER_USER_ID | Serveur. UUID exact du compte fondateur dans Supabase Auth. Les autres comptes reçoivent 403. |
| CONTACT_DATABASE_URL | Serveur. Connexion PostgreSQL du rôle dédié. Utiliser TLS vérifié en hébergement, une URL de pool compatible transactions si nécessaire. |
| CONTACT_RATE_SECRET | Serveur. Secret aléatoire propre à l’environnement (au moins 32 octets recommandés) servant à pseudonymiser l’adresse réseau. |
| TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID | Serveur. Jeton du bot et identifiant du chat privé du fondateur. Ouvrir au préalable une conversation avec le bot. Seule la référence et la nature de la demande figurent dans la notification. |
| CONTACT_SMTP_URL, CONTACT_MAIL_FROM | Serveur. URL du compte SMTP existant (SMTPS ou SMTP avec STARTTLS) et expéditeur autorisé. Vérifier le domaine et la délivrabilité avec ce prestataire. Aucun fournisseur payant imposé. |

## Persistance et limites

Le visiteur envoie un POST JSON sans inscription. Le serveur valide les champs, le consentement, la taille et le champ piège. La demande et les deux notifications à traiter sont enregistrées **ensemble**, avant tout envoi externe. Seul un reçu JSON avec référence déclenche la confirmation à l’écran. Une interruption réseau laisse la réception non confirmée ; réessayer avec le même contenu est permis. Les champs facultatifs sont stockés uniquement si saisis. La demande rapide conserve sa forme courte.

PostgreSQL sérialise les soumissions concurrentes. Même identifiant d’envoi ou même contenu dans les dix minutes : même référence. Un identifiant réutilisé pour un autre contenu est refusé. Limites sur une heure : trois nouvelles demandes par adresse e-mail, dix par origine réseau. Sur Vercel, seule l’adresse transmise par la plateforme est utilisée. Hors Vercel, utiliser un accès direct ou adapter explicitement le proxy de confiance ; les en-têtes IP arbitraires du navigateur sont ignorés.

Les états par canal sont « en attente », « en cours », « accepté » et « échec ». Une réception en base suffit au reçu public. L’administration permet de reprendre un échec ou un travail interrompu depuis cinq minutes ; les canaux acceptés sont ignorés. Une panne exactement entre l’acceptation externe et son écriture en base peut produire une deuxième notification lors d’une reprise. La demande elle-même reste unique. Pas de tâche planifiée obligatoire. Examiner périodiquement la boîte privée. Ne pas journaliser les corps, jetons, adresses, URLs SMTP ou réponses brutes des prestataires.

## Tests

- API avec un PostgreSQL jetable **vide** : définir `CONTACT_TEST_DATABASE_URL`, puis `node --test server/contact.test.mjs`. Les comptes et notifications externes sont simulés ; le stockage et les transactions sont réels. Utiliser un cluster PostgreSQL jetable neuf à chaque test. Le scénario crée le rôle de test au niveau du cluster et vérifie la politique RLS avec ce rôle.
- Parcours navigateur : lancer Vite avec un PostgreSQL de recette initialisé, `VITE_FORMA_CONTACT_ENDPOINT=/api/contact`, un secret de quota et **sans identifiants de notification réels**. Définir `CONTACT_TEST_ORIGIN` sur son origine locale ; exécuter `node scripts/check-contact.mjs`. Le scénario crée trois devis fictifs (390, 820 et 1366 px). Playwright nécessite Chromium installé ou `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
- Contrôles généraux : `npm run build`, puis `npm test` avec la configuration par défaut du dépôt.

## Diagnostic d’une Preview

Dans les outils réseau du navigateur, filtrer sur le POST de `/api/contact` et relever uniquement l’heure, le statut et le type de réponse. Une réponse 401 de Vercel avant la fonction indique que la session de Preview doit accompagner la requête de même origine. Un GET sans jeton fondateur reçoit normalement 401 de l’application. Un POST valide doit donner 201 (ou 200 sur une reprise) avec un reçu JSON.

Dans le projet Vercel associé à l’URL effectivement ouverte, vérifier Preview, la branche, le commit et la date de prise en compte des variables. Pour le POST public, contrôler le chemin compilé `VITE_FORMA_CONTACT_ENDPOINT=/api/contact`, le secret de quota et la connexion PostgreSQL du rôle applicatif. Les variables d’authentification du fondateur concernent la lecture privée. La fonction signale les échecs par catégorie dans les Runtime Logs, notamment `database_permissions`, `database_credentials`, `database_url_missing` et `rate_secret_missing`. Ne pas copier de corps de requête, cookies ou chaînes de connexion.

Pour valider l’environnement, comparer la référence du reçu avec celle de la ligne en base et de la demande dans l’administration. Réserver les données synthétiques à une base de recette dédiée.

### TLS du pooler Supabase

Pour un hôte `*.pooler.supabase.com`, le serveur impose `sslmode=verify-full` et fournit à `pg` le chemin du certificat public `server/certs/prod-ca-2021.crt` via `sslrootcert`. Vercel inclut ce fichier dans la fonction `api/contact.js`. Le pilote vérifie la chaîne et le nom DNS. Une URI existante avec `sslmode=require` bénéficie de la même vérification. Le certificat Supabase Root 2021 CA expire le 26 avril 2031. En cas de rotation, vérifier la nouvelle autorité auprès de Supabase, mettre à jour le fichier et son empreinte de test.

[Source officielle du certificat](https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt) · [Vérification TLS Supabase](https://supabase.com/docs/guides/platform/ssl-enforcement)
