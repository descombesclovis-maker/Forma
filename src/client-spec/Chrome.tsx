import { useEffect, useRef, useState, type MouseEvent } from "react";

export function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="spec-arrow"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

const sections = [
  { href: "/#accueil", label: "Accueil", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v10.5h-6v-6h-5v6h-6z" /></svg> },
  { href: "/#realisations", label: "Nos réalisations", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" /><rect x="13.5" y="3.5" width="7" height="7" /><rect x="3.5" y="13.5" width="7" height="7" /><rect x="13.5" y="13.5" width="7" height="7" /></svg> },
  { href: "/nos-services", label: "Nos services", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5h16M6 16V9m6 7V4m6 12v-5" /><circle cx="6" cy="7" r="2" /><circle cx="12" cy="2.8" r="1.2" /><circle cx="18" cy="9" r="2" /></svg> },
  { href: "/comment-ca-marche", label: "Comment ça marche ?", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></svg> },
  { href: "/tarification", label: "Tarification", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 12h5M8 15h8" /></svg> },
  { href: "/#contact", label: "Contact", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4.5 7 7.5 6 7.5-6" /></svg> },
  { href: "/espace-client", label: "Espace client", icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5 20v-1.3a7 7 0 0 1 14 0V20z" /></svg> },
];

function scrollHomeSection(id: string) {
  if (location.pathname !== "/") {
    location.href = `/#${id}`;
    return;
  }
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

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (href === "/#accueil" || href === "/#realisations" || href === "/#contact") {
      event.preventDefault(); setOpen(false); scrollHomeSection(href.split("#")[1]);
    } else setOpen(false);
  }

  return <>
    <header className="site-header">
      <a className="site-brand" href="/#accueil" aria-label="FORMA — revenir à l’accueil" onClick={(event) => { event.preventDefault(); scrollHomeSection("accueil"); }}>
        <span className="site-brand-mark" aria-hidden="true"><i /><i /><i /></span><span>FORMA<sup>®</sup></span>
      </a>
      <div className="site-header-actions">
        <a className="site-account" href="/espace-client" aria-label="Accéder à l’espace client" title="Espace client">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5 20v-1.3a7 7 0 0 1 14 0V20z" /></svg>
        </a>
        <button ref={toggle} className={`site-menu-toggle ${open ? "is-open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="site-navigation"><i /><i /><i /></button>
      </div>
    </header>
    {open && <>
      <button className="site-menu-shade" type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
      <nav ref={panel} id="site-navigation" className="site-menu" aria-label="Navigation principale">
        {sections.map(({ href, label, icon }) => <a key={href + label} href={href} onClick={(event) => navigate(event, href)}>
          {icon}<span>{label}</span><svg className="site-menu-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
        </a>)}
      </nav>
    </>}
  </>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="site-footer-main">
      <div className="site-footer-brand"><a href="/#accueil">FORMA<sup>®</sup></a><p>Studio de création numérique.<br />Des idées singulières, façonnées avec intention.</p></div>
      <div className="site-footer-links"><p className="footer-label">Découvrir</p><a href="/nos-services">Nos services</a><a href="/comment-ca-marche">Comment ça marche ?</a><a href="/tarification">Tarification</a><a href="/espace-client">Espace client</a><a href="/#realisations">Nos réalisations</a><a href="/#contact">Parlons de votre projet <span aria-hidden="true">↗</span></a></div>
      <details className="site-legal"><summary>Informations légales</summary><div><p>Les mentions légales, coordonnées de l’éditeur et informations sur l’hébergeur sont à renseigner par FORMA avant la mise en ligne publique.</p><p>La politique de confidentialité et les informations relatives au traitement des données de contact doivent également être ajoutées avant activation du formulaire.</p></div></details>
    </div>
    <div className="site-footer-bottom"><span>© {new Date().getFullYear()} FORMA. Tous droits réservés.</span><a href="/#accueil">Retour en haut ↑</a></div>
  </footer>;
}
