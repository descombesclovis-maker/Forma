import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Chrome";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function Home() {
  const intro = useRef<HTMLElement>(null);
  const build = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [linksReady, setLinksReady] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    let timer = 0;
    let alive = true;
    let installed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function update() {
      raf = 0;
      const first = intro.current;
      const rootSection = build.current;
      const win = frame.current?.contentWindow;
      const section = win?.document.querySelector<HTMLElement>(".build-section");
      if (!first || !rootSection || !win || !section || !installed) return;

      // Progress is a pure function of the main document scroll. It begins at
      // the first page-scroll pixel, reverses naturally, and reaches 1 exactly
      // as the sticky construction sequence finishes.
      const range = Math.max(1, first.offsetHeight + rootSection.offsetHeight - innerHeight);
      const progress = reduced ? 1 : clamp(window.scrollY / range);
      first.style.setProperty("--intro-progress", String(reduced ? 0 : clamp(window.scrollY / Math.max(1, first.offsetHeight))));
      rootSection.style.setProperty("--f-progress", String(progress));

      const appear = clamp((progress - 0.32) / 0.5);
      rootSection.style.setProperty("--nav-opacity", String(appear));
      rootSection.style.setProperty("--cta-opacity", String(clamp((progress - 0.7) / 0.25)));
      const navCanUse = progress >= 0.76;
      const ctaCanUse = progress >= 0.94;
      rootSection.dataset.navReady = String(navCanUse);
      rootSection.dataset.ctaReady = String(ctaCanUse);
      setLinksReady((current) => current === navCanUse ? current : navCanUse);
      setCtaReady((current) => current === ctaCanUse ? current : ctaCanUse);

      const target = section.getBoundingClientRect().top + win.scrollY;
      const sceneRange = Math.max(0, section.offsetHeight - win.innerHeight);
      const scenePosition = target + sceneRange * progress;
      if (Math.abs(win.scrollY - scenePosition) > 0.5) win.scrollTo(0, scenePosition);
    }
    function request() { if (!raf) raf = requestAnimationFrame(update); }
    function install() {
      const doc = frame.current?.contentDocument;
      if (!doc?.querySelector(".build-section") || !doc.querySelector(".main--ready canvas")) return false;
      installed = true;
      if (alive) setReady(true);
      request();
      return true;
    }
    timer = window.setInterval(() => { if (install()) window.clearInterval(timer); }, 100);
    const fail = window.setTimeout(() => { if (!installed && alive) setFailed(true); }, 20000);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    request();
    return () => {
      alive = false; window.clearInterval(timer); window.clearTimeout(fail); cancelAnimationFrame(raf);
      removeEventListener("scroll", request); removeEventListener("resize", request);
    };
  }, []);

  return <>
    <section className="spec-intro" id="accueil" ref={intro} aria-label="Accueil FORMA — Donnez forme à l’impossible">
      <div className="spec-intro-stage"><div className="spec-intro-content">
        <p className="spec-intro-eyebrow">Studio de création numérique</p>
        <h1>Donnez forme à l’impossible</h1>
        <span className="spec-scroll-guide" aria-hidden="true"><i /><i /><i /></span>
        <ul className="spec-assurances" aria-label="Nos engagements">
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 2" /></svg><span><b>01</b><strong>Livraison en 3 à 7 jours</strong></span></li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5zM8 9h8M8 12h5M8 15h7" /><path d="m4 20 16-16" /></svg><span><b>02</b><strong>Créations sans IA</strong></span></li>
          <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5v-1.2A3.3 3.3 0 0 1 7.3 14h2.4a3.3 3.3 0 0 1 3.3 3.3v1.2M8.5 10.8a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2ZM16 5.2a3 3 0 0 1 0 5.8M16.2 14h.5a3.3 3.3 0 0 1 3.3 3.3v1.2" /></svg><span><b>03</b><strong>Accompagnement client</strong></span></li>
        </ul>
        <div className="spec-scroll-cue" aria-label="Scrollez pour voir la suite"><span>Scrollez pour voir la suite</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v15m-6-6 6 6 6-6" /></svg></div>
      </div></div>
    </section>
    <section className="spec-build" data-ready={ready} data-nav-ready={linksReady} data-cta-ready={ctaReady} ref={build} aria-label="Assemblage du grand F original au défilement">
      <div className="spec-build-sticky">
        <iframe ref={frame} src="/scene/index.html" title="Grand F original de FORMA" className="spec-build-frame" tabIndex={-1} aria-hidden="true" allow="autoplay" />
        {!ready && <p className="spec-build-status" role="status">{failed ? "Le chargement de l’animation prend plus de temps que prévu." : "Chargement de l’animation…"}</p>}
        <nav className="f-orbit-nav" aria-label="Découvrir FORMA">
          <a className="f-orbit-link f-orbit-link--price" href="/tarification" tabIndex={linksReady ? 0 : -1} aria-hidden={!linksReady}>Tarification</a>
          <a className="f-orbit-link f-orbit-link--services" href="/nos-services" tabIndex={linksReady ? 0 : -1} aria-hidden={!linksReady}>Nos services</a>
          <a className="f-orbit-link f-orbit-link--process" href="/comment-ca-marche" tabIndex={linksReady ? 0 : -1} aria-hidden={!linksReady}>Comment ça marche ?</a>
          <a className="f-orbit-link f-orbit-link--contact" href="/#contact" onClick={(event) => { event.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); history.replaceState(null, "", `${location.pathname}${location.search}#contact`); }} tabIndex={ctaReady ? 0 : -1} aria-hidden={!ctaReady}>Parlons de votre projet <Arrow /></a>
        </nav>
      </div>
    </section>
  </>;
}
