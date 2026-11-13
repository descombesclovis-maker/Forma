import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Chrome";

export const demoSlugs = ["aube", "mono", "halo", "atlas", "lyra", "orbit", "eclat", "viva"];
type Demo = { name: string; kind: string; context: string };
const metas: Record<string, Demo> = {
  aube: { name: "AUBE", kind: "Site vitrine", context: "Architecture & espaces" },
  mono: { name: "MONO", kind: "Logo & identité", context: "Identité de studio" },
  halo: { name: "HALO", kind: "E-commerce", context: "Soins botaniques" },
  atlas: { name: "ATLAS", kind: "Application web", context: "Tableau de bord" },
  lyra: { name: "LYRA", kind: "Campagne publicitaire", context: "Parfum & édition" },
  orbit: { name: "ORBIT", kind: "Application multimédia", context: "Écoute sonore" },
  eclat: { name: "ÉCLAT", kind: "Identité visuelle", context: "Savoir-faire & édition" },
  viva: { name: "VIVA", kind: "Publicité digitale", context: "Boisson fruitée" }
};
const products = [
  { name: "Huile botanique", sub: "Soin · 30 ml", price: 24, code: "green" },
  { name: "Sérum essentiel", sub: "Hydratation · 50 ml", price: 36, code: "peach" },
  { name: "Brume végétale", sub: "Fraîcheur · 100 ml", price: 21, code: "blue" },
];
function AubeDemo() {
  const [active, setActive] = useState(0);
  return <div className="concept-aube">
    <div className="concept-aube-top"><strong>AUBE <span>STUDIO</span></strong><nav aria-label="Navigation démonstration AUBE"><a href="#concept-aube-projects">Projets</a><a href="#concept-aube-story">Studio</a></nav></div>
    <div className="concept-aube-hero"><div className="concept-aube-intro"><p>ARCHITECTURE CONTEMPORAINE / ÉTUDE 001</p><h2>L'espace est<br /><em>une émotion.</em></h2><p>Nous dessinons des lieux de vie qui évoluent avec vous. Un rapport sensible à la lumière, au vide et à la matière.</p><a href="#concept-aube-projects">Découvrir les espaces <Arrow /></a></div><div className="concept-aube-building"><span/><i/><b/></div></div>
    <section id="concept-aube-projects" className="concept-aube-projects"><header><p>DES LIEUX À VIVRE / 001—003</p><h2>Projets sélectionnés.</h2></header><div className="concept-aube-options">{["Résidence Sable","Maison Patio","Atelier Lumière"].map((label,i)=><button type="button" className={i===active?"is-active":""} key={label} onClick={()=>setActive(i)}><span>0{i+1}</span>{label}<span aria-hidden="true">↗</span></button>)}</div><div className={`concept-aube-study concept-aube-study--${active}`}><div className="concept-aube-architecture"><i/><i/><i/></div><div><small>PROJET CONCEPTUEL / 0{active+1}</small><h3>{["Résidence Sable","Maison Patio","Atelier Lumière"][active]}</h3><p>Une étude fictive de composition architecturale aux lignes épurées.</p></div></div></section>
    <section id="concept-aube-story" className="concept-aube-story"><small>LE STUDIO / MANIFESTE</small><h2>Construire avec le temps, penser avec la lumière.</h2></section>
  </div>;
}

function HaloDemo() {
  const [cart, setCart] = useState<number[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState("Tous");
  const visible = products.filter((p) => filter==="Tous" || (filter==="Soins" ? p.code!=="blue" : p.code==="blue"));
  const total = cart.reduce((sum, index) => sum+products[index].price,0);
  return <div className="concept-halo"><div className="concept-halo-head"><strong>HALO</strong><span>LE SOIN, AUTREMENT.</span><button type="button" onClick={()=>setShowCart(v=>!v)} aria-expanded={showCart}>Panier ({cart.length}) ↗</button></div>
    <div className="concept-halo-hero"><div><small>COLLECTION BOTANIQUE / 001</small><h2>Moins, mais<br /><em>mieux.</em></h2><p>Les essentiels pour ralentir, se recentrer et prendre soin de soi.</p><a href="#halo-collection">Explorer la collection ↓</a></div><div className="concept-halo-bottle concept-halo-bottle--hero"><i/><b>HALO</b></div></div>
    <section id="halo-collection" className="concept-halo-collection"><header><div><small>LA BOUTIQUE / DÉMONSTRATION</small><h2>Nos essentiels.</h2></div><div role="group" aria-label="Filtrer les produits">{["Tous","Soins","Brume"].map(k=><button key={k} aria-pressed={k===filter} className={k===filter?"is-active":""} type="button" onClick={()=>setFilter(k)}>{k}</button>)}</div></header><div className="concept-halo-products">{visible.map(p=>{const index=products.indexOf(p);return <article key={p.name}><div className={`concept-halo-product-art concept-halo-${p.code}`}><div className="concept-halo-bottle"><i/><b>HALO</b></div></div><p>{p.sub}</p><h3>{p.name}</h3><div><span>{p.price} €</span><button type="button" onClick={()=>setCart(old=>[...old,index])} aria-label={`Ajouter ${p.name} au panier`}>Ajouter +</button></div></article>})}</div></section>
    {showCart && <div className="concept-halo-cart" role="dialog" aria-modal="false" aria-label="Panier de démonstration"><button type="button" onClick={()=>setShowCart(false)} aria-label="Fermer le panier">×</button><h2>Votre sélection</h2>{cart.length?cart.map((index,i)=><div key={i}>{products[index].name}<span>{products[index].price} €</span><button type="button" onClick={()=>setCart(old=>old.filter((_,j)=>j!==i))} aria-label={`Retirer ${products[index].name}`}>Retirer</button></div>):<p>Votre panier est vide.</p>}<strong>Total fictif : {total} €</strong><small>Démonstration uniquement : aucune commande ni paiement.</small></div>}
  </div>;
}

const atlasPeriods = [
  { name:"7 jours", audience:"12 480", conversion:"4,8 %", projects:"128", values:[22,32,27,38,47,50,65,60,78] },
  { name:"30 jours", audience:"48 260", conversion:"5,2 %", projects:"364", values:[23,27,34,30,48,58,54,70,87] },
  { name:"90 jours", audience:"139 570", conversion:"5,7 %", projects:"942", values:[18,29,38,35,41,62,70,77,92] },
];
function AtlasDemo() {
  const [period,setPeriod] = useState(1);
  const [selected,setSelected] = useState("Vue d'ensemble");
  const [tasks,setTasks] = useState([false,true,false]);
  const data=atlasPeriods[period];
  const points=data.values.map((v,i)=>`${36+i*70},${225-v*1.9}`).join(" ");
  return <div className="concept-atlas"><aside className="concept-atlas-nav"><strong>ATLAS<span>.</span></strong><small>WORKSPACE / STUDIO</small>{["Vue d'ensemble","Projets","Activité","Réglages"].map(x=><button key={x} type="button" onClick={()=>setSelected(x)} aria-pressed={selected===x}>{x}<span aria-hidden="true">↗</span></button>)}<div className="concept-atlas-avatar">FS</div></aside><div className="concept-atlas-content"><header><div><p>ESPACE DE DÉMONSTRATION · DONNÉES FICTIVES</p><h2>{selected}</h2></div><div role="group" aria-label="Période">{atlasPeriods.map((x,i)=><button type="button" key={x.name} aria-pressed={i===period} onClick={()=>setPeriod(i)}>{x.name}</button>)}</div></header><div className="concept-atlas-stats">{[{k:"VISITEURS",v:data.audience,u:"+ 12,4 %"},{k:"CONVERSION",v:data.conversion,u:"+ 0,8 %"},{k:"PROJETS",v:data.projects,u:"En cours"}].map(x=><article key={x.k}><small>{x.k}</small><strong>{x.v}</strong><span>{x.u}</span></article>)}</div><div className="concept-atlas-chart"><div><h3>Trafic &amp; croissance</h3><p>Évolution fictive · {data.name}</p></div><svg viewBox="0 0 650 250" role="img" aria-label="Courbe d'évolution fictive"><defs><linearGradient id="atlasArea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a5c0ee" stopOpacity=".56"/><stop offset="1" stopColor="#dce8fc" stopOpacity="0"/></linearGradient></defs>{[58,108,158,208].map(y=><path key={y} d={`M20 ${y}H620`} stroke="#dce5f1" strokeWidth="1"/>) }<polygon points={`36,245 ${points} 596,245`} fill="url(#atlasArea)"/><polyline points={points} stroke="#688bbf" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div className="concept-atlas-bottom"><div><h3>Prochaines actions</h3><p>Cochez les étapes pour tester l'interface.</p>{["Valider la maquette","Préparer le lancement","Envoyer le compte rendu"].map((label,i)=><label key={label}><input type="checkbox" checked={tasks[i]} onChange={()=>setTasks(old=>old.map((v,j)=>i===j?!v:v))}/>{label}</label>)}</div><div><h3>Projets actifs</h3>{["Studio AUBE","Collection HALO","Campagne VIVA"].map((label,i)=><p key={label}><span>{label}</span><b>{["Design","En cours","Terminé"][i]}</b></p>)}</div></div></div></div>;
}

const songs = [
  { title:"Night Signals",type:"Synthé / Ambient",freq:[220,261.63,329.63,392] },
  { title:"Quiet Orbit",type:"Minimal / Downtempo",freq:[196,246.94,293.66,349.23] },
  { title:"First Light",type:"Lumineux / Calme",freq:[174.61,220,261.63,329.63] },
];
function OrbitDemo() {
  const [selected,setSelected] = useState(0);
  const [playing,setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext|null>(null);
  useEffect(()=>{
    if(!playing)return;
    if(typeof window.AudioContext==="undefined")return;
    const ctx=new AudioContext();ctxRef.current=ctx;
    let step=0;
    const note=()=>{
      if(ctx.state==="closed")return;
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.type="sine";osc.frequency.value=songs[selected].freq[step++%4];
      gain.gain.setValueAtTime(.0001,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.075,ctx.currentTime+.04);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.45);
      osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.5);
    };
    note();const timer=window.setInterval(note,540);
    return()=>{window.clearInterval(timer);void ctx.close();ctxRef.current=null};
  },[playing,selected]);
  return <div className="concept-orbit"><div className="concept-orbit-sidebar"><strong>ORBIT<span>◉</span></strong><small>VOTRE ÉCOUTE</small><nav><span>Bibliothèque</span><span>Découvertes</span><span>Préférences</span></nav><p>Une interface musicale fictive avec de courtes notes synthétisées localement.</p></div><div className="concept-orbit-main"><p className="concept-orbit-tag">LECTURE / DÉMONSTRATION AUDIO</p><h2>Votre univers,<br /><em>en harmonie.</em></h2><div className="concept-orbit-album"><i/><span/><b>ORBIT</b></div><div className="concept-orbit-player"><div><h3>{songs[selected].title}</h3><p>{songs[selected].type}</p></div><button type="button" onClick={()=>setPlaying(v=>!v)} aria-label={playing?"Mettre en pause la démo":"Écouter la démo sonore"}>{playing?"Ⅱ":"▶"}</button></div><div className="concept-orbit-songs">{songs.map((song,i)=><button type="button" key={song.title} onClick={()=>{setSelected(i);setPlaying(true)}} aria-pressed={selected===i}><span>0{i+1}</span><strong>{song.title}</strong><small>{song.type}</small><span aria-hidden="true">↗</span></button>)}</div></div></div>;
}
function IdentityDemo({ id }: {id:"mono"|"eclat"}) {
  const mono=id==="mono";
  const palettes=mono?["#191919","#eee9de","#c5a18b","#77736e"]:["#6c3039","#f6e6dc","#e3ad92","#a67b72"];
  return <div className={`concept-identity ${mono?"concept-identity--mono":"concept-identity--eclat"}`}><p>IDENTITÉ VISUELLE / CONCEPT ORIGINAL</p><div className="concept-identity-board"><div><img src={`/portfolio-concepts/${id}.svg`} alt={`Planche graphique du logo original ${mono?"MONO":"ÉCLAT"}`} /></div><div><small>UN SIGNE, UN UNIVERS</small><h2>{mono?"Le minimalisme fait sens.":"L'élégance dans le détail."}</h2><p>Symbole original, construction vectorielle, déclinaisons et règles chromatiques : une identité fictive complète créée pour cette démonstration.</p><div className="concept-identity-swatches">{palettes.map(p=><span key={p} style={{background:p}} title={p}/>)}</div></div></div><section><h3>{mono?"MONO":"ÉCLAT"} / SYSTÈME DE MARQUE</h3><div className="concept-identity-cards"><div className="concept-identity-symbol">{mono?"M":"É"}</div><div>TYPOGRAPHIE<br/><strong>{mono?"Aa — Studio":"Aa — Atelier"}</strong></div><div>PALETTE<br/><strong>04 couleurs</strong></div></div></section></div>;
}
function AdDemo({ id }: {id:"lyra"|"viva"}) {
  const perfume=id==="lyra";
  return <div className={`concept-ad concept-ad--${id}`}><div className="concept-ad-intro"><p>CAMPAGNE CONCEPTUELLE / CRÉATION ORIGINALE</p><h2>{perfume?"Un parfum. Une présence.":"L'énergie d'un instant."}</h2><p>{perfume?"Une campagne de lancement pour un parfum imaginaire, pensée en affiche, story et bannière.":"Une campagne visuelle pour une boisson fictive, avec des adaptations adaptées aux réseaux sociaux."}</p></div><div className="concept-ad-layout"><div className="concept-ad-poster"><img src={`/portfolio-concepts/${id}.svg`} alt={`Affiche publicitaire originale ${perfume?"LYRA":"VIVA"}`} /></div><div className="concept-ad-right"><div className="concept-ad-story"><img src={`/portfolio-concepts/${id}.svg`} alt="Adaptation du visuel publicitaire au format story" /></div><div className="concept-ad-tagline"><small>01 / CAMPAGNE</small><strong>{perfume?"Le luxe en mouvement.":"Naturellement vibrant."}</strong><span>Création publicitaire de démonstration. Aucune marque réelle associée.</span></div></div></div></div>;
}

export function DemoPage({ slug }: { slug: string }) {
  const meta=metas[slug];
  if(!meta)return <p>Démonstration introuvable.</p>;
  return <div className="demo-page">
    <div className="demo-context"><a href="/#realisations">← Retour aux réalisations</a><span>FORMA / LABORATOIRE CRÉATIF</span></div>
    <div className="demo-heading"><div><p className="section-eyebrow">{meta.kind} · PROJET FICTIF</p><h1>{meta.name}<span>®</span></h1></div><p>{meta.context}. Démonstration originale conçue pour illustrer un savoir-faire; ce projet n'a pas été commandé par un client.</p></div>
    <div className="demo-runtime">
      {slug==="aube"?<AubeDemo/>:slug==="halo"?<HaloDemo/>:slug==="atlas"?<AtlasDemo/>:slug==="orbit"?<OrbitDemo/>:slug==="mono"||slug==="eclat"?<IdentityDemo id={slug}/>:<AdDemo id={slug as "lyra"|"viva"}/>}
    </div>
    <div className="demo-bottom-cta"><div><p className="section-eyebrow">ET SI NOUS IMAGINIONS LE VÔTRE ?</p><h2>Créons quelque chose d'unique.</h2></div><a href="/nous-contacter">Parlons de votre projet <Arrow/></a></div>
  </div>;
}
