import { Arrow } from "./Chrome";

type Page = "process" | "pricing" | "services";

const steps = [
  ["01", "Échange", "Nous discutons du projet, de ses objectifs et de vos attentes."],
  ["02", "Conception", "Nous imaginons une solution adaptée à votre activité, votre identité et vos besoins."],
  ["03", "Création", "Nous concevons et développons le projet avec une attention particulière portée aux détails."],
  ["04", "Livraison", "Nous vérifions le résultat, présentons la réalisation et accompagnons sa mise en service."],
];
const services = [
  { index: "01", title: "Création de sites web", description: "Sites vitrines, sites professionnels et expériences web personnalisées.", tag: "WEB / EXPÉRIENCE" },
  { index: "02", title: "Développement d’applications", description: "Interfaces et applications conçues en fonction des besoins du projet.", tag: "DIGITAL / OUTIL" },
  { index: "03", title: "Création de logos", description: "Conception de symboles graphiques et d’identités reconnaissables.", tag: "IDENTITÉ / SIGNE" },
  { index: "04", title: "Création publicitaire", description: "Conception de supports et de contenus visuels destinés à la communication.", tag: "CAMPAGNE / IMAGE" },
];
const factors = ["Type de prestation", "Complexité du projet", "Fonctionnalités demandées", "Travail de conception", "Niveau de personnalisation", "Besoins complémentaires"];

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="info-hero"><p className="section-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><span className="info-hero-index">FORMA / STUDIO NUMÉRIQUE</span><div className="info-hero-mark" aria-hidden="true"><i /><i /><i /></div></header>;
}
function ContactCta({ children = "Parlons de votre projet" }: { children?: string }) {
  return <a className="contact-submit info-cta" href="/#contact">{children}<Arrow /></a>;
}

export function InfoPage({ page }: { page: Page }) {
  if (page === "process") return <main className="info-page info-process">
    <PageIntro eyebrow="Une collaboration claire" title="De votre idée à sa réalisation." description="Un processus simple, humain et attentif à chaque étape de votre projet." />
    <section className="process-sequence" aria-label="Les quatre étapes d’un projet">
      {steps.map(([number, title, text]) => <article className="process-step" key={number}><span className="process-step-number">{number}</span><div className="process-step-line" aria-hidden="true" /><div className="process-step-copy"><p>ÉTAPE / {number}</p><h2>{title}</h2><span>{text}</span></div><span className="process-step-mark" aria-hidden="true"><i /><i /><i /></span></article>)}
    </section>
    <div className="info-cta-row"><p>Chaque projet est différent. Commençons par en parler.</p><ContactCta /></div>
  </main>;

  if (page === "pricing") return <main className="info-page info-pricing">
    <PageIntro eyebrow="Une estimation juste" title="Chaque projet mérite sa juste mesure." description="Le budget se construit autour de votre besoin réel, du niveau de détail attendu et de la valeur que le projet doit créer." />
    <section className="pricing-content"><div className="pricing-explainer"><p className="section-eyebrow">Ce qui compose un projet</p><h2>Un prix adapté à votre ambition.</h2><p>Chaque estimation est préparée à partir des besoins exprimés. Nous prenons le temps de comprendre le contexte et de définir un périmètre clair avant de vous proposer une approche.</p><ul>{factors.map((factor, i) => <li key={factor}><span>0{i + 1}</span>{factor}<b>+</b></li>)}</ul></div><aside className="pricing-note"><span>UNE ESTIMATION PERSONNALISÉE</span><strong>Sur devis</strong><p>Pas de tarif artificiel ni de formule imposée. Le devis détaille le périmètre et les éléments convenus ensemble.</p><ContactCta>Demander une estimation</ContactCta><small>Sans engagement avant validation du projet.</small></aside></section>
    <section className="pricing-services"><p className="section-eyebrow">Nos domaines</p><h2>Une approche sur mesure, quelle que soit la forme.</h2><div>{["Sites web", "Applications", "Logos", "Publicité"].map((name, i) => <a href="/#contact" key={name}><span>0{i + 1}</span><strong>{name}</strong><b>Sur devis</b><Arrow /></a>)}</div></section>
    <div className="info-cta-row"><p>Un projet en tête ? Échangeons sur vos objectifs et vos besoins.</p><ContactCta /></div>
  </main>;

  return <main className="info-page info-services">
    <PageIntro eyebrow="Un studio, plusieurs terrains d’expression" title="Vos idées. Notre savoir-faire." description="Des créations numériques pensées avec méthode, dessinées avec intention et réalisées avec soin." />
    <section className="service-list" aria-label="Services FORMA">{services.map((service) => <article className="service-row" key={service.index}><div className="service-row-meta"><span>{service.index}</span><small>{service.tag}</small></div><div className="service-row-main"><h2>{service.title}</h2><p>{service.description}</p><a href={`/?service=${encodeURIComponent(service.title)}#contact`}>Discuter de ce service <Arrow /></a></div><div className="service-object" aria-hidden="true"><i /><i /><i /></div></article>)}</section>
    <div className="info-cta-row"><p>Vous avez un projet qui ne rentre dans aucune case ?</p><ContactCta /></div>
  </main>;
}
