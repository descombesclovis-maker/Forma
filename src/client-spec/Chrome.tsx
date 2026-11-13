import { useEffect, useRef, useState } from "react";

export function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="spec-arrow"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

const sections = [
  { id: "accueil", label: "Accueil", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v10.5h-6v-6h-5v6h-6z" /></svg> },
  { id: "realisations", label: "Nos réalisations", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" /><rect x="13.5" y="3.5" width="7" height="7" /><rect x="3.5" y="13.5" width="7" height="7" /><rect x="13.5" y="13.5" width="7" height="7" /></svg> },
  { id: "contact", label: "Contact", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4.5 7 7.5 6 7.5-6" /></svg> },
];

function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
  section.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const focusable = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); focusable[0]?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      toggle.current?.focus();
    };
  }, [open]);

  return <>
    <header className="site-header">
      <a className="site-brand" href="#accueil" aria-label="FORMA — revenir à l’accueil" onClick={(event) => { event.preventDefault(); scrollToSection("accueil"); }}>
        <span className="site-brand-mark" aria-hidden="true"><i /><i /><i /></span><span>FORMA<sup>®</sup></span>
      </a>
      <button ref={toggle} className={`site-menu-toggle ${open ? "is-open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="site-navigation">
        <i /><i /><i />
      </button>
    </header>
    {open && <>
      <button className="site-menu-shade" type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
      <nav ref={panel} id="site-navigation" className="site-menu" aria-label="Navigation principale">
        {sections.map(({ id, label, icon }) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); setOpen(false); scrollToSection(id); }}>
          {icon}<span>{label}</span><svg className="site-menu-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
        </a>)}
      </nav>
    </>}
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="site-footer-main">
      <div className="site-footer-brand"><a href="#accueil" onClick={(event) => { event.preventDefault(); scrollToSection("accueil"); }}>FORMA<sup>®</sup></a><p>Studio de création numérique.<br />Des idées singulières, façonnées avec intention.</p></div>
      <div className="site-footer-links"><p className="footer-label">Découvrir</p><a href="#realisations" onClick={(event) => { event.preventDefault(); scrollToSection("realisations"); }}>Nos réalisations</a><a href="#contact" onClick={(event) => { event.preventDefault(); scrollToSection("contact"); }}>Parlons de votre projet <span aria-hidden="true">↗</span></a></div>
      <details className="site-legal"><summary>Informations légales</summary><div><p>Les mentions légales, coordonnées de l’éditeur et informations sur l’hébergeur sont à renseigner par FORMA avant la mise en ligne publique.</p><p>La politique de confidentialité et les informations relatives au traitement des données de contact doivent également être ajoutées avant activation du formulaire.</p></div></details>
    </div>
    <div className="site-footer-bottom"><span>© {new Date().getFullYear()} FORMA. Tous droits réservés.</span><a href="#accueil" onClick={(event) => { event.preventDefault(); scrollToSection("accueil"); }}>Retour en haut ↑</a></div>
  </footer>;
}
