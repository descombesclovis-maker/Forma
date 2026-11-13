import { useEffect, useRef, useState } from "react";
export const href = (page: string) => page === "accueil" ? "#/accueil" : `#/${page}`;
export const links: [string, string][] = [
  ["catalogue", "Nos expertises"],
  ["contact", "Contact"],
  ["connexion", "Espace client"],
];
export function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="spec-arrow"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}
export function UserIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.4" /><path d="M5 21v-3a7 7 0 0 1 14 0v3" /></svg>;
}
function NavIcon({ id }: { id: string }) {
  if (id === "catalogue") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx=".5" /><rect x="14" y="4" width="6" height="6" rx=".5" /><rect x="4" y="14" width="6" height="6" rx=".5" /><rect x="14" y="14" width="6" height="6" rx=".5" /></svg>;
  if (id === "contact") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>;
  return <UserIcon />;
}
export function Mark() {
  return <span className="forma-logo forma-logo--mini forma-logo--interactive spec-logo" aria-hidden="true"><span className="forma-logo__stem" /><span className="forma-logo__top" /><span className="forma-logo__mid" /></span>;
}
export function Header({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = [toggle.current, ...Array.from(panel.current?.querySelectorAll<HTMLElement>("a") || [])].filter(Boolean) as HTMLElement[];
        const index = nodes.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        nodes[(index + (e.shiftKey ? -1 : 1) + nodes.length) % nodes.length].focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      toggle.current?.focus();
    };
  }, [open]);
  return (
    <>
      <header className="spec-header">
        <div className="spec-header-left">
          <a className="spec-brand" href={href("accueil")} aria-label="FORMA — accueil"><Mark /></a>
        </div>
        <a className="spec-wordmark" href={href("accueil")} aria-label="FORMA — accueil" onClick={(event) => {
          if (route === "accueil") { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
        }}>Forma®</a>
        <div className="spec-header-right">
          <a className="spec-account" href={href("connexion")} aria-label="Vous connecter"><UserIcon /></a>
          <button className={`spec-menu-toggle ${open ? "is-open" : ""}`} ref={toggle} onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="spec-navigation">
            <i /><i /><i />
          </button>
        </div>
      </header>
      {open && <>
        <button className="spec-menu-shade" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
        <nav ref={panel} id="spec-navigation" className="spec-menu" aria-label="Navigation principale">
          {links.map(([id, label]) => <a key={id} href={href(id)} onClick={() => setOpen(false)}><NavIcon id={id} /><span>{label}</span><Arrow /></a>)}
        </nav>
      </>}
    </>
  );
}
export function Footer() {
  return <footer className="spec-footer">
    <div className="spec-footer-left"><a className="spec-footer-mark" href={href("accueil")}>Forma®</a><a href={href("confidentialite")}>Politique de confidentialité</a></div>
    <div className="spec-footer-right"><nav aria-label="Navigation de pied de page">{links.map(([id, label]) => <a key={id} href={href(id)}>{label}</a>)}</nav><a className="spec-terms" href={href("legal")}>Termes légaux</a></div>
  </footer>;
}
