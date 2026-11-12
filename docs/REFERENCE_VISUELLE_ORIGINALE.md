# FORMA — Référence visuelle verrouillée (ne pas reconstruire)

## Source de vérité
La version déjà approuvée utilise :
- une intro **BUILDING / FORMA_001** ;
- le **grand F noir laqué en 3D**, assemblé au scroll avec reflets ponctuels ;
- le **petit logo F animé en haut à gauche au survol** ; ses trois segments bougent indépendamment ;
- le header en six lignes animées et la navigation associée ;
- les couleurs, la grille, les polices et les effets d’origine.

**Tout cela se trouve dans les ressources historiques, conservées à l’identique** :
- `public/assets/index-kVG0ynuN.js`
- `public/assets/index-CQUtWEvu.css`
- `public/archive/index.html`

Le nouveau catalogue réutilise **le même code d’animation et les mêmes CSS**. Il ne faut **jamais** reproduire ces composants par un dessin, une maquette, une image statique ou une nouvelle implémentation non validée.

## Prévisualisation authentique
Sur un clone de la branche `feature/forma-catalogue-tarifs-v1` :

```bash
npm ci
npm run test:archive
npm run test:visual-fidelity
npm run build
npm run dev
```

- `http://127.0.0.1:5173/` : vrai FORMA avec catégories/tarifs actualisés, sans reconstruction graphique.
- `http://127.0.0.1:5173/?reference=original` : vraie archive approuvée, non modifiée.

Pour valider, **comparer en navigateur réel** :
1. intro au chargement ;
2. assemblage F au scroll et inversion à la remontée ;
3. petit logo F du coin haut gauche au survol ;
4. menu en segments animés ;
5. catégories et six nouveaux tarifs ;
6. desktop et mobile.

Les tests statiques vérifient la conservation des ressources : ils ne prouvent pas à eux seuls le rendu WebGL. Aucun test navigateur de cette branche n’a été exécuté dans l’environnement du connecteur GitHub.

## À ne pas utiliser
La fausse prévisualisation HTML illustrée ou le faux logo dessiné lors de l’essai précédent ne constituent **pas** des références. Cette branche conserve le véritable style FORMA.

La reconstruction du F par Quadcode a été annoncée comme **commitée uniquement en local**. Ne pas la supposer présente sur GitHub avant un vrai push.
