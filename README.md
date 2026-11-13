# FORMA — site vitrine

Site vitrine React, TypeScript et Vite sur une page : accueil, animation originale du grand F, portfolio et contact.

## Développement

```sh
npm ci
npm run dev
npm run build
npm test
```

Playwright ouvre le site sur `http://127.0.0.1:5174`. Les captures de validation sont écrites dans `test-results/captures/` (exclu de Git).

## Architecture

- `src/App.tsx` : unique page, liens d’ancrage et normalisation des anciennes URL fragmentées.
- `src/client-spec/Home.tsx` : accueil et synchronisation au défilement de la scène 3D originale.
- `src/client-spec/Projects.tsx` : galerie de projets vérifiables et état vide. Les futurs projets s’ajoutent au tableau `portfolioProjects`; ne renseigner que des réalisations réelles dont les droits de présentation sont confirmés.
- `src/client-spec/Contact.tsx` : formulaire avec validations et états d’envoi honnêtes.
- `src/client-spec/Chrome.tsx` : header, menu et pied de page partagés.
- `public/scene/` : véritable moteur compilé de la scène originale. Le fichier `engine.js` et les ressources géométriques / matériaux de la scène ne sont pas reconstruits. Son pilotage par défilement et le rendu 3D sont conservés.
- `src/identity.css` : identité typographique originale; `src/client-spec/vitrine.css` : styles de la vitrine.

Les anciennes pages commerciales et l’espace client ne sont plus montés ni livrés. Les anciennes versions restent consultables dans l’historique Git.

## Contact

Aucun backend d’envoi ni adresse e-mail officielle vérifiée n’est présent dans le dépôt. Le formulaire ne prétend donc pas envoyer de message avant configuration. Voir [`docs/CONTACT.md`](docs/CONTACT.md) pour le contrat serveur et la variable publique `VITE_FORMA_CONTACT_ENDPOINT`. Aucun secret d’envoi ne doit être exposé dans le bundle frontend.

## Portfolio et informations de l’éditeur

Le dépôt ne contient pas de réalisation suffisamment documentée pour être présentée comme un projet réel de FORMA. La galerie affiche donc un état vide élégant, sans faux clients ni exemples externes. Les liens sociaux et coordonnées ne sont pas inventés. Les mentions relatives à l’identité juridique de l’éditeur et de l’hébergeur doivent être complétées par FORMA avant publication définitive.

## Déploiement

Vercel construit l’application avec `npm ci` puis `npm run build` et sert `dist`. Les anciens chemins et fragments sont ramenés à l’accueil; les ancres `#accueil`, `#realisations` et `#contact` font défiler la même page. La production ne doit être remplacée qu’après validation.
