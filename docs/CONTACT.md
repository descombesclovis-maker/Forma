# Formulaire de contact FORMA

Le dépôt ne contient actuellement aucun service d’envoi configuré ni aucune adresse de contact officielle vérifiable. Le formulaire n’affiche donc jamais de confirmation d’envoi en l’absence d’un serveur configuré.

## Configuration frontend

Définir `VITE_FORMA_CONTACT_ENDPOINT` dans `.env.local` en développement et dans les variables d’environnement Vercel (Preview, puis Production après validation), par exemple :

```dotenv
VITE_FORMA_CONTACT_ENDPOINT=https://api.votre-domaine.example/contact
```

Cette URL est publique. N’y placez aucun jeton ou secret. Si elle n’est pas définie, le formulaire reste visible mais signale clairement que le message n’a pas été envoyé.

## Contrat backend requis

Le serveur doit accepter un `POST` JSON comportant `name`, `email`, `subject` et `message`, puis renvoyer un statut 2xx uniquement après acceptation effective du message par le système de livraison. Le navigateur ne transmet pas de cookies (`credentials: omit`). Le backend doit :

- valider et normaliser toutes les données, avec des limites de taille et des protections contre les en-têtes e-mail injectés ;
- utiliser un prestataire d’e-mail côté serveur et garder ses clés secrètes exclusivement dans l’environnement backend ;
- protéger contre l’abus (limitation de débit, contrôles anti-automatisation et journalisation minimale) ;
- n’autoriser l’origine du site FORMA via CORS, sans wildcard inutile ;
- ne pas renvoyer de secrets ni de données personnelles non nécessaires dans les réponses ;
- documenter sa politique de conservation et de suppression des messages.

Le frontend affiche un état de succès seulement après un statut HTTP 2xx. Un échec ou un délai d’attente indique que le message n’a pas été transmis. Les coordonnées e-mail et les liens sociaux ne sont pas affichés tant qu’ils n’ont pas été confirmés par FORMA.
