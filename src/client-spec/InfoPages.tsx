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

function ProcessSequence() {
  const sequence = useRef<HTMLElement>(null);
  const choices = useRef(new Map<string, boolean>());
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const root = sequence.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.stepId;
        if (id && entry.isIntersecting && entry.intersectionRatio >= .32 && !choices.current.has(id)) {
          setOpen((current) => current[id] ? current : { ...current, [id]: true });
        }
      }
    }, { threshold: [.12, .32, .65], rootMargin: "0px 0px -12% 0px" });
    root.querySelectorAll<HTMLElement>("[data-step-id]").forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  function toggle(id: string) {
    const next = !open[id];
    choices.current.set(id, next);
    setOpen((current) => ({ ...current, [id]: next }));
  }

  return <section className="process-sequence" aria-label="Les quatre étapes d’un projet" ref={sequence}>
    {etapes.map((step) => {
      const expanded = !!open[step.id];
      return <article className={`process-step ${expanded ? "is-expanded" : ""}`} key={step.id} data-step-id={step.id} data-open={expanded}>
        <span className="process-step-number" aria-hidden="true">{step.numero}</span>
        <div className="process-step-line" aria-hidden="true" />
        <div className="process-step-copy">
          <p>ÉTAPE / {step.numero}</p>
          <button className="process-step-toggle" type="button" aria-expanded={expanded} aria-controls={`step-detail-${step.id}`} onClick={() => toggle(step.id)}>
            <span>{step.titre}</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M12 5v14" /></svg>
          </button>
          <div className="process-step-reveal" id={`step-detail-${step.id}`} aria-hidden={!expanded}>
            <div>{step.paragraphes.map((paragraph, index) => <p key={`${step.id}-${index}`}>{paragraph}</p>)}</div>
          </div>
        </div>
        <span className="process-step-mark" aria-hidden="true"><i /><i /><i /></span>
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
            <img src={item.example.path} alt={`Illustration conceptuelle du service ${item.title}`} loading="lazy" /><span className="service-example-caption">{item.title}</span><span className="service-example-source">ILLUSTRATION CONCEPTUELLE</span>
          </button>
        </article>)}</div>
      </section>)}
    </section>
    <div className="info-cta-row"><p>Un besoin particulier ? Parlons du périmètre possible.</p><ContactCta /></div>
    {preview && <div className="service-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePreview(); }}>
      <section className="service-preview-dialog" ref={previewDialog} role="dialog" aria-modal="true" aria-labelledby="service-preview-title">
        <button className="estimator-close" type="button" onClick={closePreview} aria-label="Fermer l’aperçu">×</button>
        <p className="section-eyebrow">EXEMPLE DE PRÉSENTATION · NON-CLIENT</p><h2 id="service-preview-title">{preview.title}</h2>
        <img src={preview.example.path} alt={`Illustration conceptuelle : ${preview.title}`} /><p>{preview.example.provenance}</p>
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
