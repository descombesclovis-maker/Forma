import { useEffect, useRef, useState } from "react";
import { Arrow, href } from "./Chrome";

export function Home() {
  const intro = useRef<HTMLElement>(null);
  const build = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    let timer = 0;
    let alive = true;
    let installed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function update() {
      raf = 0;
      const first = intro.current;
      if (first) {
        const introProgress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, first.offsetHeight)));
        first.style.setProperty("--intro-progress", String(reduced ? 0 : introProgress));
      }

      const win = frame.current?.contentWindow;
      const section = win?.document.querySelector<HTMLElement>(".build-section");
      const rootSection = build.current;
      if (win && section && rootSection && installed) {
        const sectionRange = Math.max(1, rootSection.offsetHeight - innerHeight);
        const journeyRange = Math.max(1, (intro.current?.offsetHeight ?? innerHeight) + sectionRange);
        const journeyProgress = reduced
          ? 1
          : Math.max(0, Math.min(1, window.scrollY / journeyRange));
        // Start the original scene on the very first page-scroll pixel. It reaches
        // its assembled state just before the CTA becomes fully readable.
        const progress = reduced ? 1 : Math.max(0, Math.min(1, journeyProgress / 0.94));
        rootSection.style.setProperty("--f-progress", String(progress));
        const ctaOpacity = Math.max(0, Math.min(1, (journeyProgress - 0.94) / 0.06));
        rootSection.style.setProperty("--cta-opacity", String(ctaOpacity));
        const ctaIsVisible = journeyProgress >= 0.94;
        const ctaIsReady = journeyProgress >= 0.98;
        rootSection.dataset.ctaVisible = String(ctaIsVisible);
        rootSection.dataset.ctaReady = String(ctaIsReady);
        setCtaVisible((current) => current === ctaIsVisible ? current : ctaIsVisible);
        setCtaReady((current) => current === ctaIsReady ? current : ctaIsReady);
        const target = section.getBoundingClientRect().top + win.scrollY;
        const sceneRange = Math.max(0, section.offsetHeight - win.innerHeight);
        const position = target + sceneRange * progress;
        if (Math.abs(win.scrollY - position) > 0.5) win.scrollTo(0, position);
      }
    }

    function request() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    function install() {
      const doc = frame.current?.contentDocument;
      if (!doc?.querySelector(".build-section") || !doc.querySelector(".main--ready canvas")) return false;
      installed = true;
      if (alive) setReady(true);
      request();
      return true;
    }

    timer = window.setInterval(() => {
      if (install()) window.clearInterval(timer);
    }, 180);
    const fail = window.setTimeout(() => {
      if (!installed && alive) setFailed(true);
    }, 20000);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    request();
    return () => {
      alive = false;
      window.clearInterval(timer);
      window.clearTimeout(fail);
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

  return (
    <>
      <section className="spec-intro" ref={intro} aria-label="Accueil FORMA — Donnez forme à l’impossible">
        <div className="spec-intro-stage">
          <div className="spec-intro-content">
            <p className="spec-intro-eyebrow">Studio de création numérique</p>
            <h1>Donnez forme à l’impossible</h1>
            <div className="spec-scroll-cue" aria-label="Scrollez pour voir la suite">
              <span className="spec-scroll-guide" aria-hidden="true"><i /><i /><i /></span>
              <span>Scrollez pour voir la suite</span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v15m-6-6 6 6 6-6" /></svg>
            </div>
            <ul className="spec-assurances" aria-label="Nos engagements">
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 2" /></svg>
                <span><b>01</b><strong>Livraison en 3 à 7 jours</strong></span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5zM8 9h8M8 12h5M8 15h7" /><path d="m4 20 16-16" /></svg>
                <span><b>02</b><strong>Créations sans IA</strong></span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5v-1.2A3.3 3.3 0 0 1 7.3 14h2.4a3.3 3.3 0 0 1 3.3 3.3v1.2M8.5 10.8a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2ZM16 5.2a3 3 0 0 1 0 5.8M16.2 14h.5a3.3 3.3 0 0 1 3.3 3.3v1.2" /></svg>
                <span><b>03</b><strong>Accompagnement client</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="spec-build" data-ready={ready} data-cta-ready={ctaReady} data-cta-visible={ctaVisible} ref={build} aria-label="Assemblage du grand F original au défilement">
        <div className="spec-build-sticky">
          <iframe
            ref={frame}
            src="/scene/index.html"
            title="Grand F original de FORMA"
            className="spec-build-frame"
            tabIndex={-1}
            aria-hidden="true"
            allow="autoplay"
          />
          {!ready && <p className="spec-build-status" role="status">{failed ? "Le chargement de l’animation prend plus de temps que prévu." : "Chargement de l’animation…"}</p>}
          <a className="spec-build-cta" href={href("catalogue")} tabIndex={ctaReady ? 0 : -1} aria-hidden={!ctaReady}>
            Démarrer mon projet <Arrow />
          </a>
        </div>
      </section>
    </>
  );
}
