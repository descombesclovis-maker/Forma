import { plans, money } from "../catalog";
import { Arrow, href } from "./Chrome";
import { useProject } from "./ProjectState";
import type { SiteType } from "./ProjectState";
export const siteTypes: {
  id: SiteType;
  name: string;
  image: string;
  source: string;
  url: string;
  price: number;
}[] = [
  {
    id: "onepage",
    name: "One Page",
    image: "onepage",
    source: "TodoMVC",
    url: "https://todomvc.com/",
    price: 590,
  },
  {
    id: "vitrine",
    name: "Site vitrine",
    image: "vitrine",
    source: "Bootstrap",
    url: "https://getbootstrap.com/",
    price: 990,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    image: "ecommerce",
    source: "Medusa",
    url: "https://next.medusajs.com/",
    price: 2490,
  },
];
const categories = [
  {
    id: "sites",
    name: "Sites web",
    image: "/examples/vitrine.png",
    description: "One Page, site vitrine et e-commerce.",
    source: "Exemple : Bootstrap",
    url: "https://getbootstrap.com/",
    price: "Dès 590 €",
  },
  {
    id: "logiciels",
    name: "Logiciels",
    image: "/examples/logiciel.png",
    description:
      "LocalAiStudio, LocalAiWeb et LocalAiVision. Disponibilités et capacités à confirmer.",
    source: "Exemple de logiciel : Excalidraw",
    url: "https://excalidraw.com/",
    price: "Sur devis",
  },
  {
    id: "logos",
    name: "Logos",
    image: "/portfolio/identity-forma.svg",
    description: "Création de logos et de leurs déclinaisons.",
    source: "Identité FORMA",
    url: null,
    price: "Dès 149 €",
  },
  {
    id: "publicite",
    name: "Publicité",
    image: "/original-client/portfolio/ad-haier-forma-mono.webp",
    description: "Campagnes publicitaires digitales et visuelles, pensées pour capter l’attention et faire connaître votre offre.",
    source: "Exemple publicitaire — étude de référence",
    url: null,
    price: "Sur devis",
  },
];
export function Example({
  image,
  source,
  url,
  alt,
}: {
  image: string;
  source: string;
  url: string | null;
  alt: string;
}) {
  return (
    <figure className="spec-example">
      <img src={image} alt={alt} loading="lazy" />
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="spec-example-source"
        >
          {source} <Arrow />
        </a>
      ) : (
        <figcaption className="spec-example-source">{source}</figcaption>
      )}
    </figure>
  );
}
export function Catalogue() {
  return (
    <section className="spec-page">
      <h1>Produits digitaux</h1>
      <div className="spec-catalogue-grid">
        {categories.map((c) => (
          <article className="spec-product" key={c.id}>
            <Example
              image={c.image}
              source={c.source}
              url={c.url}
              alt={`Exemple visuel — ${c.name}`}
            />
            <div className="spec-product-copy">
              <a href={href(c.id)} className="spec-product-title">
                <h2>{c.name}</h2>
                <Arrow />
              </a>
              <p>{c.description}</p>
              <span className="spec-product-price">{c.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
export function ProductPage({ id }: { id: string }) {
  const c = categories.find((c) => c.id === id)!;
  return (
    <section className="spec-page">
      <h1>{c.name}</h1>
      <div className="spec-product-overview">
        <Example
          image={c.image}
          source={c.source}
          url={c.url}
          alt={`Exemple visuel — ${c.name}`}
        />
        <div>
          <p>{c.description}</p>
          {id === "sites" ? (
            <a className="spec-button" href={href("choix-site")}>
              Donner forme à mon projet <Arrow />
            </a>
          ) : (
            <p>{c.price}</p>
          )}
        </div>
      </div>
      {id === "sites" ? (
        <div className="spec-pricing">
          {plans.map((p) => (
            <article key={p.id}>
              <h2>{p.name}</h2>
              <p>{p.pages}</p>
              <strong>
                {p.price === null ? "Sur devis" : `Dès ${money(p.price)}`}
              </strong>
            </article>
          ))}
        </div>
      ) : id === "logiciels" ? (
        <div className="spec-software-list">
          {["LocalAiStudio", "LocalAiWeb", "LocalAiVision"].map((name) => (
            <article key={name}>
              <h2>{name}</h2>
              <p>
                Présentation en préparation. Fonctionnalités, licences et
                compatibilités à confirmer.
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
export function SiteChoice() {
  const { project, setProject } = useProject();
  return (
    <section className="spec-page">
      <h1>Choisissez votre type de site.</h1>
      <div className="spec-type-grid">
        {siteTypes.map((t) => (
          <article className="spec-type" key={t.id}>
            <Example
              image={`/examples/${t.image}.png`}
              source={t.source}
              url={t.url}
              alt={`Capture réelle du site ${t.source} — exemple ${t.name}`}
            />
            <button
              className="spec-type-select"
              aria-pressed={project.type === t.id}
              onClick={() => {
                setProject((p) => ({ ...p, type: t.id }));
                location.hash = href("formulaire");
              }}
            >
              <span>
                {t.name}
                <small>Dès {money(t.price)}</small>
              </span>
              <Arrow />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
