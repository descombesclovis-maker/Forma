import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { etapes } from "../content/commentCaMarche";
import { serviceCatalog, type ServiceItem } from "../content/services";
import { formatEUR, pricing, type PricingCategory } from "../config/pricing";
import { Arrow } from "./Chrome";

type Page = "process" | "pricing" | "services";

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="info-hero"><p className="section-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><span className="info-hero-index">FORMA / STUDIO NUMÉRIQUE</span><div className="info-hero-mark" aria-hidden="true"><i /><i /><i /></div></header>;
}
function ContactCta({ children = "Parlons de votre projet", href = "/nous-contacter" }: { children?: string; href?: string }) {
  return <a className="contact-submit info-cta" href={href}>{children}<Arrow /></a>;
}

function ProcessIcon({ id }: { id: string }) {
  const common = { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (id === "maquette") return <svg {...common}><rect x="5" y="8" width="38" height="27" rx="3" /><path d="M5 15h38M11 12h1M17 12h1M14 26h19M14 30h11M15 41h18M24 35v6" /><rect x="10" y="21" width="8" height="9" rx="1" /></svg>;
  if (id === "echange") return <svg {...common}><path d="M7 10h24a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5H18L9 42v-7a5 5 0 0 1-5-5V15a5 5 0 0 1 3-5Z" /><path d="M13 19h16M13 25h12M33 12h6a5 5 0 0 1 5 5v13" /></svg>;
  if (id === "creation") return <svg {...common}><path d="m24 4 4.5 13.5L42 22l-13.5 4.5L24 40l-4.5-13.5L6 22l13.5-4.5L24 4Z" /><path d="M9 5v8M5 9h8M39 34v9M34.5 38.5h9" /></svg>;
  return <svg {...common}><path d="m6 15 18-9 18 9v23l-18 9L6 38V15Z" /><path d="m6 15 18 10 18-10M24 25v22M15 11l18 10M16 32l5 5 10-11" /></svg>;
}

function ProcessSequence() {
  const sequence = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const root = sequence.current;
      if (!root) return;
      const middle = window.innerHeight * 0.53;
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-step-id]"));
      const crossing = rows.find((row) => {
        const rect = row.getBoundingClientRect();
        return rect.top <= middle && rect.bottom >= middle;
      });
      const id = crossing?.dataset.stepId ?? null;
      setActive((old) => old === id ? old : id);
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(evaluate); };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    request();
    return () => { window.removeEventListener("scroll", request); window.removeEventListener("resize", request); cancelAnimationFrame(raf); };
  }, []);
  return <section className="process-sequence" aria-label="Les quatre étapes d’un projet" ref={sequence}>
    {etapes.map((step) => {
      const expanded = active === step.id;
      return <article className={`process-step ${expanded ? "is-expanded" : ""}`} key={step.id} data-step-id={step.id} data-open={expanded}>
        <span className="process-step-number" aria-hidden="true">{step.numero}</span>
        <div className="process-step-line" aria-hidden="true" />
        <div className="process-step-copy">
          <p>ÉTAPE / {step.numero}</p>
          <h2 className="process-step-title">{step.titre}</h2>
          <div className="process-step-reveal" id={`step-detail-${step.id}`} aria-hidden={!expanded}>
            <div>{step.paragraphes.map((paragraph, index) => <p key={`${step.id}-${index}`}>{paragraph}</p>)}</div>
          </div>
        </div>
        <span className="process-step-symbol"><ProcessIcon id={step.id} /></span>
      </article>;
    })}
  </section>;
}

function PriceEstimator({ category, onClose }: { category: PricingCategory; onClose: () => void }) {
  const [productId, setProductId] = useState(category.products[0]?.id ?? "");
  const [productSelections, setProductSelections] = useState<Record<string, Record<string, number>>>({});
  const [complexitySelections, setComplexitySelections] = useState<Record<string, number>>({});
  const [summaryView, setSummaryView] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const product = category.products.find((item) => item.id === productId) ?? category.products[0];
  const selected = { ...complexitySelections, ...(productSelections[product.id] ?? {}) };
  const availableOptions = [...category.complexity, ...product.options];
  const selectedOptions = availableOptions.filter((option) => (selected[option.id] ?? 0) > 0);
  const optionAmount = (option: PricingCategory["complexity"][number]) => (option.recurring?.amount ?? option.price) * (selected[option.id] ?? 1);
  const oneTimeTotal = product.base + selectedOptions.filter((option) => !option.recurring).reduce((sum, option) => sum + optionAmount(option), 0);
  const recurring = selectedOptions.filter((option) => option.recurring).reduce((sum, option) => sum + optionAmount(option), 0);
  const summary = [
    `Produit : ${category.label} — ${product.label}`,
    `Prix de base : ${formatEUR(product.base)}`,
    ...selectedOptions.map((option) => `${option.label}${option.quantity ? ` × ${selected[option.id]} ${option.quantity.unit}` : ""} : ${option.recurring ? `${formatEUR(optionAmount(option))} / ${option.recurring.period}` : `+ ${formatEUR(optionAmount(option))}`}`),
    `Estimation indicative ponctuelle : ${formatEUR(oneTimeTotal)}`,
    ...(recurring ? [`Frais récurrents estimés : ${formatEUR(recurring)} / mois`] : []),
    "Estimation indicative, non contractuelle. TVA non indiquée; régime fiscal de FORMA à confirmer.",
  ].join("\n");
  const contactHref = `/nous-contacter?service=${encodeURIComponent(`Estimation — ${product.label}`)}&estimate=${encodeURIComponent(summary)}`;

  useEffect(() => {
    if (summaryView) requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("#estimator-title")?.focus());
  }, [summaryView]);

  useEffect(() => {
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => (dialogRef.current?.querySelector<HTMLElement>("#estimator-product") ?? dialogRef.current?.querySelector<HTMLElement>("button"))?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href],select,input:not(:disabled),[tabindex='0']") ?? []);
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = prior; };
  }, [onClose]);

  function changeProduct(event: ChangeEvent<HTMLSelectElement>) {
    setProductId(event.target.value);
    setSummaryView(false);
  }
  function setOptionCount(id: string, amount: number) {
    if (category.complexity.some((option) => option.id === id)) {
      setComplexitySelections((current) => ({ ...current, [id]: amount }));
      return;
    }
    setProductSelections((current) => ({ ...current, [product.id]: { ...(current[product.id] ?? {}), [id]: amount } }));
  }
  function backdrop(event: MouseEvent<HTMLDivElement>) { if (event.target === event.currentTarget) onClose(); }

  return <div className="estimator-backdrop" onMouseDown={backdrop}>
    <section className="estimator-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="estimator-title">
      <button className="estimator-close" type="button" onClick={onClose} aria-label="Fermer l’estimateur">×</button>
      <p className="section-eyebrow">ESTIMATION INDICATIVE / {category.label.toUpperCase()}</p>
      <h2 id="estimator-title" tabIndex={-1}>{summaryView ? "Votre estimation." : "Définissons le périmètre."}</h2>
      {!summaryView ? <>
        <label className="estimator-label" htmlFor="estimator-product">Quel produit vous intéresse ?</label>
        <select id="estimator-product" className="estimator-select" value={product.id} onChange={changeProduct}>
          {category.products.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <fieldset className="estimator-options"><legend>Options et complexité, à la carte</legend>
          {availableOptions.map((option) => <div className="estimator-option" key={option.id}>
            <span>{option.label}</span>
            {option.quantity ? <div className="estimator-quantity" role="group" aria-label={`${option.label}, nombre de ${option.quantity.unit}s`}>
              <button type="button" aria-label={`Réduire ${option.label}`} disabled={!selected[option.id]} onClick={() => setOptionCount(option.id, Math.max(0, (selected[option.id] ?? 0) - 1))}>−</button>
              <output aria-label={`Quantité ${option.label}`}>{selected[option.id] ?? 0}</output>
              <button type="button" aria-label={`Ajouter ${option.label}`} disabled={(selected[option.id] ?? 0) >= option.quantity.max} onClick={() => setOptionCount(option.id, Math.min(option.quantity!.max, (selected[option.id] ?? 0) + 1))}>+</button>
            </div> : <input type="checkbox" aria-label={`Inclure ${option.label}`} checked={(selected[option.id] ?? 0) > 0} onChange={(event) => setOptionCount(option.id, event.target.checked ? 1 : 0)} />}
            <b>{option.recurring ? `${formatEUR(option.recurring.amount)} / ${option.recurring.period}` : `+ ${formatEUR(option.price)}${option.quantity ? ` / ${option.quantity.unit}` : ""}`}</b>
          </div>)}
          {!availableOptions.length && <p className="estimator-muted">Aucune option supplémentaire définie pour ce produit.</p>}
        </fieldset>
        <div className="estimator-live-total"><span>Estimation ponctuelle actuelle</span><strong>{formatEUR(oneTimeTotal)}</strong>{recurring > 0 && <small>+ {formatEUR(recurring)} / mois</small>}</div>
        <button type="button" className="contact-submit estimator-primary" onClick={() => setSummaryView(true)}>Voir le détail de l’estimation<Arrow /></button>
      </> : <>
        <div className="estimator-result">
          <div><span>Produit choisi</span><strong>{product.label}</strong></div>
          <div><span>Prix de base</span><strong>{formatEUR(product.base)}</strong></div>
          {selectedOptions.map((option) => <div key={option.id}><span>{option.label}{option.quantity ? ` × ${selected[option.id]} ${option.quantity.unit}` : ""}</span><strong>{option.recurring ? `${formatEUR(optionAmount(option))} / ${option.recurring.period}` : `+ ${formatEUR(optionAmount(option))}`}</strong></div>)}
          <div className="estimator-result-total"><span>Estimation indicative</span><strong>{formatEUR(oneTimeTotal)}</strong></div>
          {recurring > 0 && <div><span>Frais récurrents estimés</span><strong>{formatEUR(recurring)} / mois</strong></div>}
        </div>
        <p className="estimator-disclaimer">Estimation indicative, non contractuelle. Les frais récurrents sont séparés. TVA non indiquée; le régime fiscal de FORMA reste à confirmer. Aucun paiement ni commande n’est créé.</p>
        <div className="estimator-actions"><button type="button" className="estimator-back" onClick={() => setSummaryView(false)}>Modifier mes choix</button><a className="contact-submit estimator-primary" href={contactHref}>Discuter de ce projet<Arrow /></a></div>
      </>}
      <p className="estimator-footnote">Montants indicatifs en euros — grille de départ modifiable dans <code>src/config/pricing.ts</code>.</p>
    </section>
  </div>;
}

function PricingPage() {
  const [active, setActive] = useState<PricingCategory | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const closeEstimator = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);
  const services = pricing;
  return <>
    <section className="pricing-services pricing-services--estimator"><span className="pricing-ghost-f" aria-hidden="true"><i /><i /><i /></span><p className="section-eyebrow">ESTIMATIONS INDICATIVES · EN EUROS</p><h1>Choisissez une prestation pour explorer son budget.</h1>
      <p className="pricing-intro-copy">Ces montants de départ sont des repères à affiner ensemble. Ils ne constituent pas un devis contractuel et ne créent aucune commande.</p>
      <div>{services.map((service, i) => <div className="pricing-estimate-row" key={service.id}><span>0{i + 1}</span><strong>{service.label}</strong><button type="button" onClick={(event) => { returnFocus.current = event.currentTarget; setActive(service); }}>Estimer le coût de votre {service.id === "web" ? "site web" : service.id === "app" ? "application" : service.id === "logo" ? "logo" : "publicité"}<Arrow /></button></div>)}</div>
      <p className="pricing-tax-note">Les montants affichés sont hors mention de TVA : le régime fiscal applicable à FORMA doit être confirmé.</p>
    </section>
    {active && <PriceEstimator category={active} onClose={closeEstimator} />}
  </>;
}

function ServiceGallery() {
  const [preview, setPreview] = useState<ServiceItem | null>(null);
  const previewDialog = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closePreview = useCallback(() => {
    setPreview(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);
  useEffect(() => {
    if (!preview) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => previewDialog.current?.querySelector<HTMLElement>("button")?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { closePreview(); return; }
      if (event.key !== "Tab") return;
      const focusable = Array.from(previewDialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href]") ?? []);
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = prior; document.removeEventListener("keydown", key); };
  }, [preview, closePreview]);
  return <>
    <section className="service-catalog" aria-label="Catalogue de services FORMA">
      {serviceCatalog.map((category, categoryIndex) => <section className="service-category" key={category.id} aria-labelledby={`service-category-${category.id}`}>
        <header className="service-category-heading"><span>{String(categoryIndex + 1).padStart(2, "0")}</span><div><h2 id={`service-category-${category.id}`}>{category.title}</h2><p>{category.description}</p></div></header>
        <div className="service-catalog-list">{category.items.map((item, itemIndex) => <article className="service-catalog-row" key={item.id}>
          <span className="service-catalog-number">{String(itemIndex + 1).padStart(2, "0")}</span>
          <div className="service-catalog-copy"><h3>{item.title}</h3><p>{item.description}</p><a href={`/nous-contacter?service=${encodeURIComponent(item.title)}`}>Discuter de ce service<Arrow /></a></div>
          <button className="service-example-button" type="button" onClick={(event) => { returnFocus.current = event.currentTarget; setPreview(item); }} aria-label={`Agrandir l’illustration : ${item.title}`}>
            <img src={item.example.path} alt={`Maquette de démonstration du service ${item.title}`} loading="lazy" /><span className="service-example-caption">{item.title}</span><span className="service-example-source">DÉMONSTRATION GRAPHIQUE</span>
          </button>
        </article>)}</div>
      </section>)}
    </section>
    <div className="info-cta-row"><p>Un besoin particulier ? Parlons du périmètre possible.</p><ContactCta /></div>
    {preview && <div className="service-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePreview(); }}>
      <section className="service-preview-dialog" ref={previewDialog} role="dialog" aria-modal="true" aria-labelledby="service-preview-title">
        <button className="estimator-close" type="button" onClick={closePreview} aria-label="Fermer l’aperçu">×</button>
        <p className="section-eyebrow">EXEMPLE DE PRÉSENTATION · NON-CLIENT</p><h2 id="service-preview-title">{preview.title}</h2>
        <img src={preview.example.path} alt={`Maquette de démonstration : ${preview.title}`} /><p>{preview.example.provenance}</p>{preview.example.link && <a className="service-example-real-link" href={preview.example.link} target="_blank" rel="noopener noreferrer">Voir une référence réelle de ce type de service <span aria-hidden="true">↗</span></a>}
      </section>
    </div>}
  </>;
}

export function InfoPage({ page }: { page: Page }) {
  if (page === "process") return <main className="info-page info-process">
    <PageIntro eyebrow="Une collaboration claire" title="De votre idée à sa réalisation." description="Un processus simple, humain et attentif à chaque étape de votre projet." />
    <ProcessSequence />
    <div className="info-cta-row"><p>Chaque projet est différent. Commençons par en parler.</p><ContactCta /></div>
  </main>;
  if (page === "pricing") return <main className="info-page info-pricing info-pricing--simple"><PricingPage /></main>;
  return <main className="info-page info-services">
    <PageIntro eyebrow="Un studio, plusieurs terrains d’expression" title="Vos idées. Notre savoir-faire." description="Un catalogue de créations numériques à explorer. Le périmètre, les outils et les possibilités sont définis avec vous, projet par projet." />
    <ServiceGallery />
  </main>;
}
