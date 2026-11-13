import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Arrow } from "./Chrome";

type Product = {
  id: string;
  name: string;
  description: string;
  steps: string[];
  reference: string;
  kind: "site" | "app" | "logo" | "advertising";
  sourceName: string;
  sourceLabel: string;
  sourceUrl: string;
  orderLabel: string;
};

const products: Product[] = [
  {
    id: "sites",
    name: "Sites web",
    description: "Des expériences web uniques, pensées pour votre identité, conçues pour impressionner et convertir.",
    steps: ["Découverte du projet", "Conception graphique", "Développement", "Animations et interactions", "Tests et publication"],
    reference: "Référence externe — site officiel Tesla",
    kind: "site",
    sourceName: "Tesla.com",
    sourceLabel: "Consulter le site officiel",
    sourceUrl: "https://www.tesla.com/",
    orderLabel: "Commander mon site web",
  },
  {
    id: "applications",
    name: "Applications",
    description: "Des applications intuitives, performantes et sur mesure, conçues autour de vos besoins.",
    steps: ["Analyse des besoins", "Architecture", "Conception des interfaces", "Développement des fonctionnalités", "Tests et déploiement"],
    reference: "Référence externe — interface officielle ChatGPT",
    kind: "app",
    sourceName: "ChatGPT",
    sourceLabel: "Ouvrir l’interface officielle",
    sourceUrl: "https://chatgpt.com/",
    orderLabel: "Commander mon application",
  },
  {
    id: "logos",
    name: "Logos",
    description: "Des symboles uniques qui donnent une identité forte et immédiatement reconnaissable à votre marque.",
    steps: ["Recherche créative", "Exploration graphique", "Construction du symbole", "Choix typographiques", "Déclinaisons et livraison"],
    reference: "Référence externe — histoire officielle du Swoosh",
    kind: "logo",
    sourceName: "Nike — The Swoosh",
    sourceLabel: "Voir la source officielle Nike",
    sourceUrl: "https://investors.nike.com/company-information/who-we-are",
    orderLabel: "Commander mon logo",
  },
  {
    id: "publicite",
    name: "Publicité",
    description: "Des campagnes publicitaires créatives et cohérentes pour capter l’attention, valoriser votre offre et faire agir votre audience.",
    steps: ["Objectif et audience", "Concept créatif", "Création des visuels", "Déclinaisons multi-supports", "Diffusion et optimisation"],
    reference: "Référence externe — campagne officielle McDonald’s × Minecraft",
    kind: "advertising",
    sourceName: "McDonald’s × A Minecraft Movie",
    sourceLabel: "Découvrir la campagne officielle",
    sourceUrl: "https://corporate.mcdonalds.com/corpmcd/our-stories/article/minecraft-movie-global-meal.html",
    orderLabel: "Commander ma publicité",
  },
];

function ProductArtwork({ product }: { product: Product }) {
  const externalLink = (
    <a className="reference-link" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
      <span>{product.sourceLabel}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3h6v6M17 3 9 11M15 11v5H4V5h5" /></svg>
    </a>
  );

  if (product.kind === "site") {
    return (
      <div className="product-art product-art--site">
        <div className="device-screen reference-screen" aria-label="Écran du moniteur, lien vers le site officiel Tesla">
          <div className="reference-screen-kicker"><span>RÉFÉRENCE OFFICIELLE</span><span>01 / WEB</span></div>
          <div className="reference-screen-content"><span className="reference-mark">{product.sourceName.replace(".com", "").toUpperCase()}</span><h3>Une expérience numérique de marque.</h3><p>Consultez l’interface actuelle directement à sa source.</p>{externalLink}</div>
          <span className="reference-screen-url">TESLA.COM</span>
        </div>
        <div className="device-stand" /><div className="device-foot" />
        <span className="art-label">ORDINATEUR 3D / LIEN VERS LA SOURCE OFFICIELLE</span>
      </div>
    );
  }
  if (product.kind === "app") {
    return (
      <div className="product-art product-art--app">
        <div className="reference-device reference-device--app">
          <div className="reference-device-bar"><span className="reference-device-dot" /><span className="reference-device-dot" /><span className="reference-device-dot" /><b>RÉFÉRENCE PRODUIT</b></div>
          <div className="reference-device-body"><span className="reference-mark reference-mark--openai">{product.sourceName}</span><h3>Interface officielle</h3><p>Aucune maquette reconstituée : découvrez le produit en direct sur chatgpt.com.</p>{externalLink}</div>
          <span className="reference-device-url">CHATGPT.COM</span>
        </div>
        <span className="art-label">APPLICATION / SOURCE OFFICIELLE EXTERNE</span>
      </div>
    );
  }
  if (product.kind === "logo") {
    return (
      <div className="product-art product-art--logo">
        <div className="reference-plinth reference-plinth--logo">
          <span className="reference-plinth-index">ÉTUDE DE RÉFÉRENCE / 03</span>
          <span className="reference-plinth-symbol" aria-hidden="true">S</span>
          <h3>{product.sourceName} — histoire du Swoosh</h3>
          <p>Le symbole original n’est pas reproduit ici. Consultez le récit officiel publié par Nike.</p>
          {externalLink}
          <span className="reference-plinth-foot">FORME · MÉMOIRE · RECONNAISSANCE</span>
        </div>
        <span className="art-label">RÉFÉRENCE DE MARQUE / SANS REPRODUCTION DU LOGO</span>
      </div>
    );
  }
  return (
    <div className="product-art product-art--advertising">
      <div className="reference-campaign-gallery">
        <div className="reference-poster reference-poster--back"><span>FICHE DE RÉFÉRENCE</span><b>ARCHIVE<br />EXTERNE</b><i>OUVRIR LA SOURCE</i></div>
        <div className="reference-poster reference-poster--front"><span>CAMPAGNE OFFICIELLE / 04</span><h3>{product.sourceName}</h3><p>Campagne annoncée officiellement par McDonald’s.</p>{externalLink}</div>
        <span className="art-label">CAMPAGNE RÉELLE / SOURCE CORPORATE McDONALD’S</span>
      </div>
    </div>
  );
}

function readSavedSelection(): string | null {
  try {
    const saved = sessionStorage.getItem("forma:selected-product");
    return products.some((product) => product.id === saved) ? saved : null;
  } catch {
    return null;
  }
}

export function ProductCarousel() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string | null>(readSavedSelection);
  const [showWaiting, setShowWaiting] = useState(false);
  const waitingAction = useRef<HTMLButtonElement>(null);
  const orderButton = useRef<HTMLButtonElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const product = products[active];

  useEffect(() => {
    if (!showWaiting) {
      orderButton.current?.focus({ preventScroll: true });
      return;
    }
    waitingAction.current?.focus({ preventScroll: true });
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setShowWaiting(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showWaiting]);

  function goTo(index: number) {
    setActive((index + products.length) % products.length);
  }
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
  }
  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    gesture.current = { x: event.clientX, y: event.clientY };
  }
  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (!gesture.current) return;
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    gesture.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(active + (dx < 0 ? 1 : -1));
  }
  function selectProduct() {
    setSelected(product.id);
    try { sessionStorage.setItem("forma:selected-product", product.id); } catch { /* Selection remains in this visit. */ }
    setShowWaiting(true);
  }

  return (
    <section className="spec-carousel-page" aria-labelledby="product-carousel-title">
      <div className="carousel-heading">
        <p className="spec-intro-eyebrow">Une idée prend forme</p>
        <h1 id="product-carousel-title">Choisissez ce que nous allons créer.</h1>
        <p>Quatre expertises, une même exigence de justesse.</p>
      </div>
      <div className="product-carousel" role="region" aria-roledescription="carrousel" aria-label="Sélection des produits FORMA" tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { gesture.current = null; }}>
        <button className="product-nav product-nav--previous" type="button" onClick={() => goTo(active - 1)} aria-label="Produit précédent"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.5 5.5 9 16l10.5 10.5M10 16h16" /></svg></button>
        <article className="product-card" key={product.id} aria-live="polite" aria-label={`${product.name}, catégorie ${active + 1} sur ${products.length}`}
          onPointerMove={(event: PointerEvent<HTMLElement>) => {
            if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 2.4}deg`);
            event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 2.8}deg`);
            event.currentTarget.style.setProperty("--light-x", `${x * 100}%`);
            event.currentTarget.style.setProperty("--light-y", `${y * 100}%`);
          }}
          onPointerLeave={(event: PointerEvent<HTMLElement>) => {
            ["--tilt-x", "--tilt-y", "--light-x", "--light-y"].forEach((name) => event.currentTarget.style.removeProperty(name));
          }}>
          <div className="product-card-copy">
            <div className="product-card-index"><span>FORMA / PRODUITS</span><span>0{active + 1} — 0{products.length}</span></div>
            <p className="product-card-overline">{product.reference}</p>
            <h2>{product.name}</h2>
            <p className="product-card-description">{product.description}</p>
            <div className="product-process"><h3>Notre approche</h3><ol>{product.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol></div>
            <button ref={orderButton} className="product-select" type="button" onClick={selectProduct} aria-pressed={selected === product.id}>
              {product.orderLabel}<Arrow />
            </button>
            <p className="product-disclaimer">Référence externe. Les marques et contenus appartiennent à leurs titulaires. FORMA n’en est ni l’auteur ni un affilié.</p>
          </div>
          <div className="product-card-visual"><ProductArtwork product={product} /></div>
        </article>
        <button className="product-nav product-nav--next" type="button" onClick={() => goTo(active + 1)} aria-label="Produit suivant"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12.5 5.5 10.5 10.5-10.5 10.5M22 16H6" /></svg></button>
      </div>
      <div className="carousel-footer"><div className="carousel-dots" role="group" aria-label="Choisir une catégorie">{products.map((item, index) => <button key={item.id} type="button" aria-label={`Afficher ${item.name}`} aria-current={index === active ? "true" : undefined} onClick={() => goTo(index)}><span /></button>)}</div><p aria-live="polite"><strong>0{active + 1}</strong> / 0{products.length} <span>— {product.name}</span></p></div>
      {showWaiting && <div className="order-waiting-shade" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowWaiting(false); }}>
        <section className="order-waiting" role="dialog" aria-modal="true" aria-labelledby="order-waiting-title">
          <p className="spec-intro-eyebrow">Choix enregistré · {product.id}</p>
          <h2 id="order-waiting-title">{product.name}</h2>
          <p>Votre sélection est mémorisée. Le parcours de commande correspondant n’est pas encore disponible.</p>
          <p className="order-waiting-note">Aucune commande ni paiement n’a été effectué.</p>
          <button ref={waitingAction} className="product-select" type="button" onClick={() => setShowWaiting(false)}>Retourner au carrousel <Arrow /></button>
        </section>
      </div>}
    </section>
  );
}
