export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  url?: string;
};

/** Add only real FORMA projects whose image and publication rights have been confirmed. */
export const portfolioProjects: PortfolioProject[] = [];

export function Projects() {
  return <section className="portfolio-section" id="realisations" aria-labelledby="portfolio-title">
    <div className="section-shell">
      <header className="section-heading portfolio-heading">
        <p className="section-eyebrow">Forma / Sélection</p>
        <h2 id="portfolio-title">Nos réalisations</h2>
        <p>Notre regard sur la création, la précision des formes et le soin porté à chaque détail.</p>
      </header>
      {portfolioProjects.length ? <div className="portfolio-grid">
        {portfolioProjects.map((project, index) => <article className="portfolio-project" key={project.id}>
          {project.url ? <a className="portfolio-project-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`Découvrir ${project.title} — nouvelle fenêtre`}>
            <ProjectImage project={project} index={index} />
          </a> : <ProjectImage project={project} index={index} />}
          <div className="portfolio-project-copy"><div><p>{project.category}</p><h3>{project.title}</h3></div>{project.url && <span aria-hidden="true">↗</span>}</div>
          <p className="portfolio-project-description">{project.description}</p>
        </article>)}
      </div> : <div className="portfolio-empty" role="status">
        <span className="portfolio-empty-index">PORTFOLIO / 01</span>
        <div className="portfolio-empty-mark" aria-hidden="true"><i /><i /><i /></div>
        <p>Les réalisations vérifiées de FORMA seront présentées ici prochainement.</p>
      </div>}
    </div>
  </section>;
}

function ProjectImage({ project, index }: { project: PortfolioProject; index: number }) {
  return <div className={`portfolio-project-image portfolio-project-image--${index % 3}`}>
    <img src={project.image} alt={project.imageAlt} loading="lazy" />
    <span className="portfolio-project-open" aria-hidden="true">↗</span>
  </div>;
}
