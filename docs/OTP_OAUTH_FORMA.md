# FORMA — Connexions sociales et code de confirmation à six chiffres

Branche : `feat/forma-otp-oauth-motion`.
Les informations externes ci-dessous exigent une configuration dans les consoles de chaque fournisseur. Aucun secret OAuth n'est présent dans Git.

## 1. Inscription par code
- Supabase > Authentication > Providers : activer **Email** et **Confirm email**.
- Supabase > Authentication > Email Templates > **Confirm signup**.
- Remplacer le modèle actuel par le fichier `supabase/email-templates/confirm-signup-otp.html`, ou au minimum insérer `{{ .Token }}` à la place de `{{ .ConfirmationURL }}` : Supabase y insère le code de la longueur configurée.
- Le composant `ClientPortal` propose une étape `verify` et appelle `/auth/v1/verify` avec `{email, token, type: "email"}`.
- Le renvoi du code est verrouillé 60 secondes côté navigateur et reste soumis aux limites d'envoi côté serveur Supabase.
- **Le code ne s'affichera pas dans l'e-mail tant que le modèle Supabase hébergé n'aura pas été modifié manuellement.** Notre connecteur Supabase ne permet pas de changer ce modèle dans le tableau de bord.

## 2. Connexions Google, GitHub et X
Endpoint OAuth Supabase commun à enregistrer chez les fournisseurs :

```
https://ayvpgamfltlqixojslab.supabase.co/auth/v1/callback
```

- Google Cloud Console : créer un **OAuth Client ID** de type Web application, ajouter le callback ci-dessus à la liste des URI de redirection, fournir client ID et client secret dans **Supabase > Authentication > Providers > Google**.
- GitHub > Settings > Developer settings > OAuth Apps > New OAuth App : configurer Authorization callback URL avec l'adresse ci-dessus, puis les valeurs client ID/secret dans Supabase > Providers > GitHub.
- X Developer Portal : créer une application OAuth 2.0 (la disponibilité peut impliquer un coût ou des conditions de compte), renseigner la même URL de callback, puis Supabase > Providers > **X/Twitter OAuth 2.0**, et non l'ancienne intégration Twitter.
- Pour les trois, le frontend transmet le retour vers `http://127.0.0.1:5173/espace-client`. Les secrets ne doivent jamais figurer dans Vite ou des fichiers Git.

## 3. Test sans domaine
- Dans Supabase > Authentication > URL Configuration :
  - Site URL : `http://127.0.0.1:5173`
  - Redirect URLs : `http://127.0.0.1:5173/espace-client`
- Copier `.env.local.example` vers `.env.local` ; remplacer le placeholder de la clé par la clé **publishable** de Supabase.
- Démarrer `npm ci && npm run dev -- --port 5173`.
- Ouvrir `http://127.0.0.1:5173/espace-client`.
- Créer un compte → entrer l'OTP reçu → accéder au tableau de bord → déconnexion ; vérifier aussi mot de passe incorrect, renvoi et réinitialisation.
- Tester chaque bouton OAuth avec des comptes de test seulement **après** configuration réelle du fournisseur.
- Les tests Playwright de développement ne prouvent ni l'envoi d'e-mails ni l'exécution OAuth chez les fournisseurs.

## 4. Interface et FOV
- Boutons OAuth réduits à leurs icônes officielles avec libellés accessibles.
- Animation globale hover/clic, contraste du curseur par mode de fusion « difference ».
- Scène WebGL restaurée depuis une **archive JavaScript compilée** dont les sources 3D d'origine ne sont pas disponibles. Cette livraison applique un **recul de cadrage visuel** CSS sur le canevas, sans promettre un changement du paramètre interne de caméra FOV. Tester le rendu et les gestes souris sur Windows avant de modifier le moteur 3D lui-même.

Aucune connexion OAuth ne doit être déclarée « testée de bout en bout » avant de valider les identifiants externes et la redirection locale.

## Connexion des clients existants en Preview

Dans **Authentication → Sign In / Providers → Email**, activer Email, conserver la confirmation des inscriptions et régler **Email OTP Length** à **6**. Dans **Email Templates**, le modèle **Confirm signup** et le modèle **Magic Link** doivent tous deux afficher `{{ .Token }}`. Le réglage de longueur détermine le nombre de chiffres. Exemple pour Magic Link : « Votre code de connexion Forma : {{ .Token }} ». Le modèle **Reset password** doit conserver le lien `{{ .ConfirmationURL }}`. Vérifier la délivrabilité du SMTP pour les adresses des clients. Ces réglages s’appliquent au projet Supabase dans son ensemble.

Dans Vercel, associer à la branche de recette les variables publiques `VITE_FORMA_SUPABASE_URL` et `VITE_FORMA_SUPABASE_ANON_KEY` du projet Forma. Dans Supabase → URL Configuration → Redirect URLs, autoriser l’URL HTTPS exacte de cette Preview suivie de `/espace-client` pour le retour de récupération. Conserver la Site URL utilisée par la production.

Sur un compte déjà confirmé, choisir « Se connecter par code e-mail ». Cette action appelle Supabase avec `create_user: false`. Saisir les six chiffres dans le même onglet. Le code est vérifié côté Supabase. Le portail conserve la session au rechargement et au retour sur l’onglet grâce à sessionStorage ; fermer l’onglet termine cette persistance. La déconnexion révoque la session courante. Les projets, commandes, notifications et activités sont lus avec le jeton de l’utilisateur vérifié. L’accès fondateur demeure contrôlé séparément par l’API.

Test local isolé : `node scripts/check-client-session.mjs` (Chromium Playwright, ou variable `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). Les réponses d’identité et dossiers utilisés dans ce test sont simulées exclusivement dans le navigateur de test.
