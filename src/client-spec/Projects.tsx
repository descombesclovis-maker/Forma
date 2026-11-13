export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  url?: string;
};
/** Fictional concepts created to show the design direction; never actual FORMA client references. */
export const portfolioProjects: PortfolioProject[] = [
  { id: "aube", title: "AUBE — Architecture", category: "Site web · Démonstration", description: "Une page éditoriale imaginée pour un atelier d'architecture : volumes, contraste et navigation épurée.", image: "/portfolio-concepts/aube.svg", url: "/demo/aube", imageAlt: "Maquette fictive d'un site d'architecture AUBE avec compositions architecturales." },
  { id: "mono", title: "MONO — Identité", category: "Logo · Démonstration", description: "Un monogramme vectoriel conçu pour une marque fictive, décliné sur des supports premium.", image: "/portfolio-concepts/mono.svg", url: "/demo/mono", imageAlt: "Identité de marque fictive MONO : monogramme géométrique original sur fond sombre." },
  { id: "halo", title: "HALO — Boutique", category: "E-commerce · Démonstration", description: "Un concept de boutique soignée avec une présentation immersive des produits.", image: "/portfolio-concepts/halo.svg", url: "/demo/halo", imageAlt: "Maquette e-commerce fictive HALO avec produits de soin et interface boutique." },
  { id: "atlas", title: "ATLAS — Analytics", category: "Application web · Démonstration", description: "Une interface de données fictive, conçue pour rendre les indicateurs immédiatement lisibles.", image: "/portfolio-concepts/atlas.svg", url: "/demo/atlas", imageAlt: "Tableau de bord fictif ATLAS avec graphiques, indicateurs et navigation." },
  { id: "lyra", title: "LYRA — Édition", category: "Publicité · Démonstration", description: "Un univers de campagne imaginé autour d'un parfum : photographie stylisée et direction artistique.", image: "/portfolio-concepts/lyra.svg", url: "/demo/lyra", imageAlt: "Affiche publicitaire conceptuelle LYRA pour un parfum fictif." },
  { id: "orbit", title: "ORBIT — Studio", category: "Application mobile · Démonstration", description: "Un aperçu mobile immersif pour une application de musique fictive.", image: "/portfolio-concepts/orbit.svg", url: "/demo/orbit", imageAlt: "Deux maquettes de téléphones présentant une application musicale fictive ORBIT." },
  { id: "eclat", title: "ÉCLAT — Collection", category: "Logo & identité · Démonstration", description: "Une identité fictive avec symbole original, palette et applications imprimées.", image: "/portfolio-concepts/eclat.svg", url: "/demo/eclat", imageAlt: "Identité visuelle fictive ÉCLAT sur cartes et support papeterie." },
  { id: "viva", title: "VIVA — Campagne", category: "Publicité digitale · Démonstration", description: "Une composition publicitaire conceptuelle vive, pensée pour les formats sociaux.", image: "/portfolio-concepts/viva.svg", url: "/demo/viva", imageAlt: "Création publicitaire fictive VIVA pour une boisson fruitée." },
];

export function Projects() {
  return <section className="portfolio-section" id="realisations" aria-labelledby="portfolio-title">
    <div className="section-shell">
      <header className="section-heading portfolio-heading">
        <p className="section-eyebrow">Forma / Laboratoire créatif</p>
        <h2 id="portfolio-title">Nos réalisations</h2>
        <p>Des directions artistiques et des interfaces imaginées pour montrer notre approche du design numérique.</p>
        <p className="portfolio-demo-note">Portfolio de démonstration : projets et marques fictifs, sans commande client ni partenariat revendiqué.</p>
      </header>
      <div className="portfolio-grid">
        {portfolioProjects.map((project, index) => <article className="portfolio-project" key={project.id}>
          <a className={`portfolio-project-image portfolio-project-image--${index % 3}`} href={project.url} aria-label={`Explorer la démonstration interactive de ${project.title}`}>
            <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
            <span className="portfolio-demo-label">DÉMONSTRATION INTERACTIVE ↗</span>
            <span className="portfolio-project-open" aria-hidden="true">↗</span>
          </a>
          <div className="portfolio-project-copy"><div><p>{project.category}</p><h3>{project.title}</h3></div><a className="portfolio-explore-text" href={project.url}>Explorer le concept ↗</a></div>
          <p className="portfolio-project-description">{project.description}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
