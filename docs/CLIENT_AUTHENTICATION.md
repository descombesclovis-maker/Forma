# Espace client et authentification

## Restauration de l'interface

L'espace client interactif est servi depuis `public/original-client/`, une distribution compilée de production archivée dans l'historique Git et récupérée depuis `origin/forma/prompt-2`. Le bundle conserve la scène WebGL originale, les formes, les matériaux, la lévitation et le déplacement à la souris. Le site l'intègre dans une iframe same-origin et masque uniquement l'ancien en-tête interne pour utiliser le header commun de FORMA.

Les sources React/TypeScript et les source maps de cette ancienne interface n'ont pas été retrouvées dans l'archive. Le portail est donc réutilisé tel quel comme bundle compilé; il ne s'agit pas d'une reconstruction du moteur 3D.

## État de l'authentification

Aucun backend, fournisseur d'identité ou service OAuth opérationnel n'a été trouvé dans le dépôt. Le formulaire e-mail d'origine était une interface visuelle sans contrat serveur identifiable; son bouton de soumission est donc désactivé dans l'intégration et le navigateur intercepte toute soumission. Google, GitHub et X sont présentés comme non configurés. Aucun état de connexion ni de réussite fictif n'est affiché.

## Configuration requise pour activer les connexions

Créer un backend d'authentification côté serveur et enregistrer les applications OAuth chez Google, GitHub et X. Les secrets client et les secrets de signature doivent rester exclusivement dans l'environnement du serveur. Chaque fournisseur doit renvoyer vers un callback HTTPS contrôlé par le backend, qui valide `state` (et PKCE lorsqu'il est pris en charge), vérifie la réponse, puis émet une session dans un cookie `HttpOnly`, `Secure` et `SameSite` approprié. Aucun token OAuth durable ne doit être stocké dans `localStorage` ou livré au bundle frontend.

Le frontend pourra ensuite utiliser une URL de démarrage publique (sans secret), par exemple `VITE_FORMA_AUTH_START_URL=https://api.example.com/auth`. Le backend pourra exposer des routes explicitement documentées comme `/google`, `/github`, `/x`, ainsi qu'une route de session/logout. Ces URL sont des exemples de contrat, pas des endpoints existants. Ne configurer aucune variable de production avant validation du fournisseur, des URI de retour, de la politique de confidentialité et de la sécurité de session.

L'authentification par e-mail nécessite également un service réel (mot de passe avec stockage sécurisé et réinitialisation, ou lien magique) et des protections contre l'abus. Elle ne doit pas être activée en réutilisant le formulaire visuel seul.
