// Garde-fou FORMA : protège le F 3D, le petit logo animé et l'archive compilée.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const load=(p)=>readFileSync(path.join(root,p),'utf8');
const original=load('public/assets/index-kVG0ynuN.js');
const updated=load('public/assets/forma-catalogue-v1.js');
const css=load('public/assets/index-CQUtWEvu.css');
const reference=load('public/archive/index.html');
const catalogue=load('public/forma-catalogue/index.html');
const app=load('src/App.tsx');
const gitBlobHash=(content)=>{ const normalized=content.replace(/\r\n/g,'\n'); return createHash('sha1').update(`blob ${Buffer.byteLength(normalized,'utf8')}\0`).update(normalized,'utf8').digest('hex'); };
const check=(ok,message)=>{ assert.ok(ok,message); console.log('✓ '+message); };
assert.equal(gitBlobHash(original),'d57f7970c65065ae7a283c27d04e41ea50d12190','Archive JS du vrai FORMA modifiée');
assert.equal(gitBlobHash(css),'77bfa4e4f6612fa38adf69fa123ce9b5ca081b7a','CSS original modifié');
check(reference.includes('/assets/index-kVG0ynuN.js'),'Page originale toujours accessible');
check(catalogue.includes('/assets/forma-catalogue-v1.js'),'Page nouvelle catalogue séparée de l’archive');
check(catalogue.includes('/assets/index-CQUtWEvu.css'),'Styles historiques réutilisés tels quels');
for(const marker of ['clearcoat:1,clearcoatRoughness:.02','build-scene-wrap','BUILDING / FORMA_001','forma-logo--interactive','brand-mini--account','forma-menu__bar']){
  check(original.includes(marker)&&updated.includes(marker),'Élément original préservé : '+marker);
}
for(const piece of ['stem','top','mid']){
  const selector='.forma-logo--mini.forma-logo--interactive:hover .forma-logo__'+piece;
  check(css.includes(selector),'Survol du logo haut gauche : '+piece);
}
check(app.includes('forma-catalogue'),'Vitrine mise à jour chargée dans la même interface FORMA');
for(const label of ['Sites web','Logiciels','Logos','Réseaux','Identités visuelles']){
  check(updated.includes('"label":"'+label+'"'),'Catégorie : '+label);
}
for(const price of ['dès 590 €','dès 990 €','dès 1 390 €','dès 1 990 €','dès 2 490 €','sur devis']){
  check(updated.includes(price),'Tarif : '+price);
}
console.log('FORMA : vérifications structurelles OK. Le rendu navigateur et l’animation dynamique restent à tester.');
