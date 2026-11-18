# Test local du portail Forma sans domaine

État : **préparation de l'authentification locale**, pas de mise en production.
Projet Supabase Forma : `ayvpgamfltlqixojslab` (séparé des projets ENR DISCOUNT).
Migration `forma_client_portal_read_rls` appliquée : quatre tables vides, RLS active,
politiques de lecture limitées à `auth.uid()`; analyse de sécurité Supabase sans alerte à cette étape.

## Démarrer sur Windows (sans domaine)

1. Récupérer cette branche `feat/forma-local-auth` ; installer Node.js si nécessaire.
2. Créer `.env.local` à la racine du dépôt à partir de `.env.local.example`.
   Configurer `VITE_FORMA_SUPABASE_URL=https://ayvpgamfltlqixojslab.supabase.co`
   et `VITE_FORMA_SUPABASE_ANON_KEY` avec **seulement** la clé publique
   `sb_publishable_...`, à retrouver dans Supabase > Project Settings > API Keys.
3. `npm ci` puis `npm run dev -- --port 5173`.
4. Ouvrir **exactement** `http://127.0.0.1:5173/espace-client`.
   Ne pas alterner avec `localhost` au milieu du parcours.

## Supabase : Authentication > URL Configuration

- Site URL : `http://127.0.0.1:5173`.
- Redirect URLs : `http://127.0.0.1:5173/espace-client`
  (ajouter des origines uniquement si elles sont utilisées).
- Activer le fournisseur **Email** et décider de la confirmation d'e-mail.
  Sans SMTP spécifique, l'envoi des e-mails de validation peut être limité
  par le quota de test de Supabase.

## Recette

1. S'inscrire avec une adresse e-mail de test que l'on contrôle.
2. Confirmer l'e-mail si Supabase le demande, vérifier la redirection locale.
3. Se connecter, voir les rubriques projets / commandes / notifications / activité.
   Les tableaux sont normalement vides, **aucune donnée de démonstration**.
4. Se déconnecter, réessayer avec un mot de passe erroné, et demander la récupération.
5. Avec un second compte indépendant : vérifier l'absence d'accès aux lignes de l'autre
   compte (pour l'instant les tables sont vides : ce test devra être répété avec
   des enregistrements de recette insérés par un backend de confiance).

## Google, GitHub, X

Ces fournisseurs nécessitent chacun une application OAuth et un identifiant/secret
**configurés dans Supabase > Authentication > Providers**, qui ne sont pas présents
dans le dépôt. Leur callback externe est :
`https://ayvpgamfltlqixojslab.supabase.co/auth/v1/callback`.
Les URL de retour frontend restent celles de la section ci-dessus.
X : sélectionner **X/Twitter OAuth 2.0** (fournisseur `x`, pas le Twitter historique).
L'accès à l'API/développeur X peut être soumis à des conditions ou coûts.

Ne jamais mettre un client secret de fournisseur ou `service_role`
dans un fichier `.env.local` Vite, dans le navigateur ni dans Git.
La clé `sb_publishable_...` est publique, mais reste à isoler par environnement.

## Vérification technique

Le précédent client construisait `Authorization: Bearer sb_publishable_...`
lorsqu'il n'y avait pas encore de session. Corrigé : l'appel public utilise
`apikey` et les appels authentifiés utilisent
`Authorization: Bearer <access_token JWT>`.

Le port local n'implique pas que Supabase soit hors ligne : la base et
l'authentification résident dans le cloud Supabase. Ne pas publier en production.

**Étapes suivantes après recette réelle** : authentification OAuth et session
renforcée, backend administrateur, synchronisation de preview validée
LocalAiWeb → Forma, commandes/options à conditions versionnées, puis paiements,
livraisons chiffrées, approbation client et publication.
