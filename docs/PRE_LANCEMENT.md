# FORMA — vérifications avant mise en ligne

Cette liste distingue les **maquettes et le code du site** des prérequis réels de publication. Tant que les éléments ci-dessous ne sont pas renseignés, le site doit rester en prévisualisation.

## Priorité 1 — Contact réellement opérationnel
- Sélectionner une adresse e-mail professionnelle et un fournisseur de délivrabilité (service SMTP/API côté serveur).
- Mettre en place `VITE_FORMA_CONTACT_ENDPOINT` qui accepte les messages et les questions rapides, avec validation côté serveur et limitation de débit.
- Tester les e-mails reçus, les erreurs d'envoi et la protection anti-spam. Ne pas confondre le module FAQ avec un chat en direct.
- Prévoir un accusé de réception approprié uniquement si la demande a bien été reçue.

## Priorité 2 — Informations légales, données et conformité
- Compléter `/mentions-legales` : identité, statut, SIREN/SIRET et TVA si applicables, coordonnées, responsable de publication, hébergeur.
- Valider `/politique-confidentialite` : finalités, bases légales, destinataires, conservation, sous-traitants, droits et contact RGPD.
- Examiner les cookies et services tiers, prévoir une information / un consentement si nécessaire.
- Vérifier les conditions commerciales (CGV, délais, propriété intellectuelle, garanties, éventuel droit de rétractation) si des prestations sont proposées.

## Priorité 3 — Preuves de savoir-faire
- Les huit cartes du portfolio sont des **projets conceptuels**, affichés comme tels. Ne jamais les présenter comme de vrais contrats.
- Ajouter en priorité 3 à 5 réalisations réelles avec permission de publication, problème client, solution apportée et lien ou capture avant/après.
- Les miniatures de « Nos services » sont aussi des maquettes illustratives. Le bouton de référence mène à un exemple réel indépendant de FORMA.

## Priorité 4 — Clarté commerciale
- Vérifier les affirmations de l'accueil (dont « Livraison en 3 à 7 jours » et « Créations sans IA ») : elles doivent refléter le service réellement rendu.
- Valider la grille de `src/config/pricing.ts` avec un coût minimum viable, les frais récurrents, le temps de travail et le régime de TVA.
- Ajouter une offre de démarrage simple par cible (artisan, commerce, indépendant), sans promesses non mesurées.
- Préparer un processus de réponse aux demandes et un suivi des prospects consentis.

## Priorité 5 — Visibilité et conversion
- Mettre à jour le SEO : titre, description, OG, sitemap, favicon et textes adaptés aux offres et à la zone géographique.
- Vérifier mobile, accessibilité, contraste, performance du grand F, page Contact et formulaires.
- Installer des mesures d'audience respectueuses de la confidentialité si besoin; mesurer demande de contact, clics CTA et consultation du portfolio.
- Publier une version Preview, contrôler avec des utilisateurs, puis déployer `main` après validation explicite.
