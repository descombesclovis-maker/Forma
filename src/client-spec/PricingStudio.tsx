import { useMemo, useState } from "react";
import { pricing, formatEUR, type PricingOption } from "../config/pricing";
import { Arrow } from "./Chrome";

type CountMap = Record<string, Record<string, number>>;
const leadIn = {
  web: "Votre prochain site, selon ses vraies fonctionnalités.",
  app: "Un outil numérique ajusté à vos besoins.",
  logo: "Un signe distinctif, avec les bonnes déclinaisons.",
  ads: "Une communication visible, au juste périmètre.",
};

const glyphs: Record<string, string> = { web: "W", app: "A", logo: "L", ads: "P" };

export function PricingStudio() {
  const [categoryId, setCategoryId] = useState(pricing[0].id);
  const category = pricing.find((entry) => entry.id === categoryId) ?? pricing[0];
  const [productIds, setProductIds] = useState<Record<string,string>>({});
  const product = category.products.find((entry) => entry.id === productIds[category.id]) ?? category.products[0];
  const [counts, setCounts] = useState<CountMap>({});
  const key = category.id + ":" + product.id;
  const selected = counts[key] ?? {};
  const options = [...category.complexity, ...product.options];
  const picked = options.filter((option) => (selected[option.id] ?? 0) > 0);
  const amount = (option: PricingOption) => (option.recurring?.amount ?? option.price) * (selected[option.id] ?? 0);
  const total = product.base + picked.filter((option) => !option.recurring).reduce((sum, option) => sum + amount(option), 0);
  const recurring = picked.filter((option) => !!option.recurring).reduce((sum, option) => sum + amount(option), 0);
  const summary = useMemo(() => [
    `Type : ${category.label}`,
    `Prestation : ${product.label}`,
    `Prix de base : ${formatEUR(product.base)}`,
    `Inclus : ${(product.included ?? []).join(", ")}`,
    ...picked.map((option) => `Option : ${option.label} × ${selected[option.id]} = ${formatEUR(amount(option))}${option.recurring ? " / " + option.recurring.period : ""}`),
    `Estimation initiale indicative : ${formatEUR(total)}`,
    ...(recurring ? [`Frais récurrents indicatifs : ${formatEUR(recurring)} / mois`] : []),
    "Montants indicatifs, non contractuels; le régime de TVA applicable reste à confirmer."
  ].join("\n"), [category.id, category.label, product.id, product.label, product.base, product.included, counts]); // eslint-disable-line react-hooks/exhaustive-deps
  const contactHref = `/nous-contacter?service=${encodeURIComponent(product.label)}&estimate=${encodeURIComponent(summary)}`;

  const setCount = (option: PricingOption, count: number) => {
    const value = Math.max(0, Math.min(option.quantity?.max ?? 1, count));
    setCounts((old) => ({ ...old, [key]: { ...(old[key] ?? {}), [option.id]: value } }));
  };

  return <main className="pricing-studio" id="estimateur">
    <section className="pricing-studio-hero" aria-labelledby="pricing-studio-title">
      <p className="section-eyebrow">FORMA / ESTIMATEUR SUR MESURE</p>
      <h1 id="pricing-studio-title">Imaginez le projet.<br /><em>Explorez son prix.</em></h1>
      <p>Choisissez votre création, découvrez ce qui est déjà compris et composez uniquement les options dont vous avez besoin.</p>
      <div className="pricing-ghost-f" aria-hidden="true"><i /><i /><i /></div>
      <span className="pricing-hero-index">01 — CATÉGORIE · 02 — PRESTATION · 03 — OPTIONS · 04 — ESTIMATION</span>
    </section>
    <section className="pricing-studio-body" aria-label="Personnaliser votre estimation">
      <div className="pricing-studio-flow">
        <div className="pricing-studio-step"><span>01 / UNIVERS</span><h2>Que souhaitez-vous créer ?</h2></div>
        <div className="pricing-category-grid" role="group" aria-label="Choisir une catégorie">
          {pricing.map((entry) => <button type="button" key={entry.id} className={`pricing-category ${entry.id === category.id ? "is-selected" : ""}`} aria-pressed={entry.id === category.id} onClick={() => setCategoryId(entry.id)}>
            <span className="pricing-category-glyph" aria-hidden="true">{glyphs[entry.id]}</span>
            <strong>{entry.label}</strong><span aria-hidden="true">↗</span>
          </button>)}
        </div>
        <div className="pricing-studio-step"><span>02 / FORMAT</span><h2>Précisez votre besoin.</h2><p>{leadIn[category.id as keyof typeof leadIn]}</p></div>
        <div className="pricing-product-list" role="group" aria-label="Choisir un type de produit">
          {category.products.map((entry, i) => <button type="button" key={entry.id} aria-pressed={entry.id === product.id} className={`pricing-product ${entry.id === product.id ? "is-selected" : ""}`} onClick={() => setProductIds((old) => ({ ...old, [category.id]: entry.id }))}>
            <span>{String(i+1).padStart(2,"0")}</span><strong>{entry.label}</strong><span>À partir de {formatEUR(entry.base)}</span><span aria-hidden="true">↗</span>
          </button>)}
        </div>
        <div className="pricing-studio-step"><span>03 / PERSONNALISATION</span><h2>Ne payez que l'utile.</h2><p>Les éléments compris dans le format de base ne sont jamais facturés deux fois.</p></div>
        <div className="pricing-includes">
          <p className="section-eyebrow">DÉJÀ COMPRIS DANS « {product.label.toUpperCase()} »</p>
          <ul>{(product.included ?? []).map((included) => <li key={included}><span aria-hidden="true">✓</span>{included}</li>)}</ul>
        </div>
        <div className="pricing-option-grid">
          {options.map((option) => <div className="pricing-option-row" key={option.id}>
            <div><strong>{option.label}</strong><span>{option.recurring ? "Abonnement facultatif" : option.quantity ? `Prix par ${option.quantity.unit}` : "Option facultative"}</span></div>
            <span className="pricing-option-price">{option.recurring ? `+${formatEUR(option.recurring.amount)} / ${option.recurring.period}` : `+${formatEUR(option.price)}`}</span>
            {option.quantity ? <div className="pricing-stepper" role="group" aria-label={`Quantité ${option.label}`}><button type="button" onClick={() => setCount(option,(selected[option.id]??0)-1)} disabled={!selected[option.id]} aria-label={`Réduire ${option.label}`}>−</button><output>{selected[option.id] ?? 0}</output><button type="button" disabled={(selected[option.id]??0) >= option.quantity.max} onClick={() => setCount(option,(selected[option.id]??0)+1)} aria-label={`Ajouter ${option.label}`}>+</button></div>
              : <label className="pricing-switch"><input type="checkbox" aria-label={`Inclure ${option.label}`} checked={(selected[option.id]??0)>0} onChange={(event) => setCount(option,event.target.checked?1:0)} /><span aria-hidden="true" /></label>}
          </div>)}
          {!options.length && <p>Ce format inclut l'essentiel. Aucun supplément indispensable.</p>}
        </div>
      </div>
      <aside className="pricing-studio-summary" aria-labelledby="pricing-summary-title">
        <div className="pricing-summary-head"><span>04 / VOTRE ESTIMATION</span><i aria-hidden="true">F</i></div>
        <h2 id="pricing-summary-title">Votre projet,<br />en chiffres.</h2>
        <p className="pricing-summary-name">{product.label}</p>
        <div className="pricing-summary-lines">
          <div><span>Base (éléments inclus)</span><strong>{formatEUR(product.base)}</strong></div>
          {picked.filter((entry) => !entry.recurring).map((option) => <div key={option.id}><span>{option.label}{option.quantity ? ` × ${selected[option.id]}` : ""}</span><strong>+ {formatEUR(amount(option))}</strong></div>)}
          {!picked.length && <p>Aucun supplément sélectionné.</p>}
        </div>
        <div className="pricing-summary-total"><span>Budget ponctuel estimé</span><strong aria-live="polite">{formatEUR(total)}</strong></div>
        {recurring > 0 && <p className="pricing-summary-recurring">+ {formatEUR(recurring)} / mois (frais facultatifs)</p>}
        <a className="pricing-summary-cta" href={contactHref}>Discuter de cette estimation <Arrow /></a>
        <p className="pricing-summary-disclaimer">Estimation indicative sans engagement, non contractuelle. La TVA, les frais d'hébergement et les services tiers éventuels sont à préciser. Aucun paiement n'est demandé ici.</p>
      </aside>
    </section>
  </main>;
}
