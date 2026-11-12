// Reproduit seulement les catégories et tarifs approuvés sans toucher au F 3D.
// Usage : node scripts/build-forma-catalog.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'catalog/forma-pricing.json'),'utf8'));
function buildCatalogue(source,config){
 function replaceSegment(input,start,end,replacement,description){
  const a=input.indexOf(start),b=input.indexOf(end,a+start.length);
  if(a<0||b<0||input.indexOf(start,a+start.length)!==-1)throw Error("Missing or ambiguous marker: "+description);
  return input.slice(0,a)+replacement+input.slice(b);
 }
 let result=replaceSegment(source,"const Qb=",",iV=","const Qb="+JSON.stringify(config.services),"categories");
 result=replaceSegment(result,"const HM=",";function fV","const HM="+JSON.stringify(config.navigation),"header navigation");
 if(result.split(",Vx=[").length!==2 || result.split("];function lf(").length!==2)throw Error("Ambiguous site plan markers");
 result=result.replace(",Vx=[",",Vx=(()=>{const original=[");
 const items=config.plans.map(p=>{
   const price=p.price===null?"sur devis":"dès "+new Intl.NumberFormat("fr-FR").format(p.price).replace(/[\u00a0\u202f]/g," ")+" €";
   const demos=p.demosFrom.length===1
    ? "original.find(z=>z.id==="+JSON.stringify(p.demosFrom[0])+").demos"
    : "["+p.demosFrom.map(id=>"original.find(z=>z.id==="+JSON.stringify(id)+").demos[0]").join(",")+"]";
   return "{id:"+JSON.stringify(p.id)+",label:"+JSON.stringify(p.label)+",price:"+JSON.stringify(price)+",description:"+JSON.stringify(p.description)+",demos:"+demos+"}";
 }).join(",");
 result=result.replace("];function lf(","];return ["+items+"];})();function lf(");
 const target='f==="sites"?r?.():f==="home"?n?.():t?.(),a(!1)';
 if(result.split(target).length!==2)throw Error("Navigation action marker missing or ambiguous");
 result=result.replace(target,'f==="sites"?r?.():f==="home"?n?.():f==="account"?e?.():t?.(),a(!1)');
 new Function(result);
 return result;
}
const original=fs.readFileSync(path.join(root,'public/assets/index-kVG0ynuN.js'),'utf8');
const output=buildCatalogue(original,catalog);
fs.writeFileSync(path.join(root,'public/assets/forma-catalogue-v1.js'),output,'utf8');
console.log('Vitrine FORMA intégrée : catégories et tarifs mis à jour, archives préservées.');
