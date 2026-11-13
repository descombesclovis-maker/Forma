# FORMA — site vitrine

Site vitrine React, TypeScript et Vite : accueil, animation originale du grand F, portfolio/contact, pages studio (processus, tarification, services) et portail client historique.

## Développement

```sh
npm ci
npm run dev
npm run build
npm test
```

Playwright ouvre le site sur `http://127.0.0.1:5174`. Les captures de validation sont écrites dans `test-results/captures/` (exclu de Git).

## Architecture

- `src/App.tsx` : routage des pages studio et normalisation des anciennes URL.
- `src/client-spec/Home.tsx` : accueil et synchronisation au défilement de la scène 3D originale.
- `src/client-spec/InfoPages.tsx` : accordéons du processus, estimateur et galerie de services.
- `src/content/commentCaMarche.ts` : textes des étapes, modifiables sans toucher aux composants.
- `src/config/pricing.ts` : prix de départ, sous-produits, options, unités et complexité; tous les montants sont des brouillons indicatifs à valider avant publication.
- `src/content/services.ts` : catalogue extensible, chemins des exemples et mentions de provenance.
- `public/service-examples/` : illustrations conceptuelles FORMA, explicitement non présentées comme réalisations client.
- `src/client-spec/Login.tsx` et `public/original-client/` : interface historique compilée et scène d’origine. L’authentification reste désactivée tant qu’un backend sécurisé n’est pas configuré (voir `docs/CLIENT_AUTHENTICATION.md`).
- `src/client-spec/Contact.tsx` : formulaire avec validations et états d’envoi honnêtes; l’estimation peut y transmettre un récapitulatif.
- `src/client-spec/Chrome.tsx` : header, menu et pied de page partagés.
- `public/scene/` : véritable moteur compilé de la scène originale du F. Le fichier `engine.js` et les ressources géométriques / matériaux ne sont pas reconstruits.
- `src/identity.css`, `src/client-spec/vitrine.css`, `src/client-spec/evolution-2.css` : typographie, identité commune et interactions nouvelles.

## Contact

Aucun backend d’envoi ni adresse e-mail officielle vérifiée n’est présent dans le dépôt. Le formulaire ne prétend donc pas envoyer de message avant configuration. Voir [`docs/CONTACT.md`](docs/CONTACT.md) pour le contrat serveur et la variable publique `VITE_FORMA_CONTACT_ENDPOINT`. Aucun secret d’envoi ne doit être exposé dans le bundle frontend.

## Portfolio et informations de l’éditeur

Le dépôt ne contient pas de réalisation suffisamment documentée pour être présentée comme un projet réel de FORMA. La galerie affiche donc un état vide élégant, sans faux clients ni exemples externes. Les liens sociaux et coordonnées ne sont pas inventés. Les mentions relatives à l’identité juridique de l’éditeur et de l’hébergeur doivent être complétées par FORMA avant publication définitive.

## Déploiement

Vercel construit l’application avec `npm ci` puis `npm run build` et sert `dist`. Les anciens chemins et fragments sont ramenés à l’accueil; les ancres `#accueil`, `#realisations` et `#contact` font défiler la même page. La production ne doit être remplacée qu’après validation.
