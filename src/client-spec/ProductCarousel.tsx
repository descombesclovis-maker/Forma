import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Arrow } from "./Chrome";

type Product = {
  id: string;
  name: string;
  description: string;
  steps: string[];
  reference: string;
  kind: "site" | "app" | "logo" | "identity";
};

const products: Product[] = [
  {
    id: "sites",
    name: "Sites web",
    description:
      "Des expériences web uniques, pensées pour votre identité, conçues pour impressionner et convertir.",
    steps: [
      "Découverte du projet",
      "Conception graphique",
      "Développement",
      "Animations et interactions",
      "Tests et publication",
    ],
    reference: "Référence visuelle : Tesla",
    kind: "site",
  },
  {
    id: "applications",
    name: "Applications",
    description:
      "Des applications intuitives, performantes et sur mesure, conçues autour de vos besoins.",
    steps: [
      "Analyse des besoins",
      "Architecture",
      "Conception des interfaces",
      "Développement des fonctionnalités",
      "Tests et déploiement",
    ],
    reference: "Référence d’interface : ChatGPT",
    kind: "app",
  },
  {
    id: "logos",
    name: "Logos",
    description:
      "Des symboles uniques qui donnent une identité forte et immédiatement reconnaissable à votre marque.",
    steps: [
      "Recherche créative",
      "Exploration graphique",
      "Construction du symbole",
      "Choix typographiques",
      "Déclinaisons et livraison",
    ],
    reference: "Référence de simplicité : Nike",
    kind: "logo",
  },
  {
    id: "identites",
    name: "Identités visuelles",
    description:
      "Des univers graphiques cohérents et mémorables qui donnent vie à votre marque sur tous les supports.",
    steps: [
      "Positionnement de marque",
      "Direction artistique",
      "Palette de couleurs",
      "Typographie et éléments graphiques",
      "Déclinaisons sur différents supports",
    ],
    reference: "Référence d’identité : McDonald’s",
    kind: "identity",
  },
];

function ProductArtwork({ kind }: { kind: Product["kind"] }) {
  if (kind === "site") {
    return (
      <div className="product-art product-art--site" aria-hidden="true">
        <div className="device-screen tesla-screen">
          <div className="tesla-nav"><span>TESLA</span><i /><i /><i /></div>
          <div className="tesla-copy"><span>MODEL S</span><b>Beyond the ordinary.</b><small>Electric luxury, in motion.</small></div>
          <div className="tesla-car"><i /><b /><em /></div>
          <div className="tesla-actions"><span>ORDER NOW</span><span>EXPLORE INVENTORY</span></div>
        </div>
        <div className="device-stand" />
        <div className="device-foot" />
        <span className="art-label">WEB EXPERIENCE / 01</span>
      </div>
    );
  }
  if (kind === "app") {
    return (
      <div className="product-art product-art--app" aria-hidden="true">
        <div className="app-window">
          <aside className="app-sidebar"><b>◉</b><span>New chat</span><i>Explore</i><i>Library</i><hr /><small>RECENT</small><i>Brand direction</i><i>Launch outline</i></aside>
          <div className="app-main"><header><span>ChatGPT</span><b>•••</b></header><div className="chat-content"><small>FORMA / PROJECT NOTES</small><h3>Let’s shape<br />something useful.</h3><p>Help me turn an early idea into a clear, thoughtful experience.</p><div className="assistant-reply"><b>ChatGPT</b><span>Start with the people it should serve, then make every interaction feel effortless.</span></div><div className="prompt-box">Ask anything <i>↑</i></div></div></div>
        </div>
        <span className="art-label">PRODUCT INTERFACE / 02</span>
      </div>
    );
  }
  if (kind === "logo") {
    return (
      <div className="product-art product-art--logo" aria-hidden="true">
        <div className="logo-sheet"><small>FORM STUDY / 03</small><div className="nike-word">NIKE</div><svg className="nike-mark" viewBox="0 0 240 90"><path d="M18 56c28 7 70-3 111-24L214 4 127 66C83 95 34 84 18 56Z" /></svg><div className="logo-caption"><span>MOVE WITH INTENT</span><i>01 — SYMBOL</i></div></div>
        <span className="art-label">IDENTITY / SYMBOL STUDY</span>
      </div>
    );
  }
  return (
    <div className="product-art product-art--identity" aria-hidden="true">
      <div className="identity-board">
        <div className="identity-sign"><svg viewBox="0 0 100 70"><path d="M7 63h86v-8H7zM12 56V44C12 23 27 7 50 7s38 16 38 37v12h-9V43c0-16-12-27-29-27S21 27 21 43v13z" /></svg><small>GOLDEN ARCHES / SIGN</small></div>
        <div className="identity-cup"><b>M</b><i>i’m lovin’ it</i></div>
        <div className="identity-bag"><b>M</b><span>GOOD TO GO</span></div>
        <div className="identity-poster"><small>MADE FOR</small><b>GOOD<br />MOMENTS.</b><i>GLOBAL CAMPAIGN</i></div>
        <div className="identity-swatches"><i /><i /><i /></div>
      </div>
      <span className="art-label">BRAND SYSTEM / 04</span>
    </div>
  );
}

function readSavedSelection(): string | null {
  try {
    return sessionStorage.getItem("forma:selected-product");
  } catch {
    return null;
  }
}

export function ProductCarousel() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string | null>(readSavedSelection);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const product = products[active];

  function goTo(index: number) {
    setActive((index + products.length) % products.length);
  }
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    }
  }
  function onPointerDown(event: PointerEvent<HTMLElement>) {
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
    try {
      sessionStorage.setItem("forma:selected-product", product.id);
    } catch {
      // Selection remains visible for this visit even when storage is disabled.
    }
  }

  return (
    <section className="spec-carousel-page" aria-labelledby="product-carousel-title">
      <div className="carousel-heading">
        <p className="spec-intro-eyebrow">Une idée prend forme</p>
        <h1 id="product-carousel-title">Choisissez ce que nous allons créer.</h1>
        <p>Quatre expertises, une même exigence de justesse.</p>
      </div>
      <div
        className="product-carousel"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Sélection des produits FORMA"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { gesture.current = null; }}
      >
        <button className="product-nav product-nav--previous" type="button" onClick={() => goTo(active - 1)} aria-label="Produit précédent">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.5 5.5 9 16l10.5 10.5M10 16h16" /></svg>
        </button>
        <article className="product-card" key={product.id} aria-live="polite" aria-label={`${product.name}, catégorie ${active + 1} sur ${products.length}`}>
          <div className="product-card-copy">
            <div className="product-card-index"><span>FORMA / PRODUITS</span><span>0{active + 1} — 0{products.length}</span></div>
            <p className="product-card-overline">{product.reference}</p>
            <h2>{product.name}</h2>
            <p className="product-card-description">{product.description}</p>
            <div className="product-process">
              <h3>Notre approche</h3>
              <ol>{product.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
            </div>
            <button className="product-select" type="button" onClick={selectProduct} aria-pressed={selected === product.id}>
              {selected === product.id ? "Produit sélectionné" : "Sélectionner ce produit"}
              <Arrow />
            </button>
            <p className="product-disclaimer">Exemple visuel inspiré d’une référence de marque. Ni réalisation FORMA ni affiliation.</p>
          </div>
          <div className="product-card-visual"><ProductArtwork kind={product.kind} /></div>
        </article>
        <button className="product-nav product-nav--next" type="button" onClick={() => goTo(active + 1)} aria-label="Produit suivant">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12.5 5.5 10.5 10.5-10.5 10.5M22 16H6" /></svg>
        </button>
      </div>
      <div className="carousel-footer">
        <div className="carousel-dots" role="group" aria-label="Choisir une catégorie">
          {products.map((item, index) => (
            <button key={item.id} type="button" aria-label={`Afficher ${item.name}`} aria-current={index === active ? "true" : undefined} onClick={() => goTo(index)}><span /></button>
          ))}
        </div>
        <p aria-live="polite"><strong>0{active + 1}</strong> / 0{products.length} <span>— {product.name}</span></p>
      </div>
    </section>
  );
}
