import { useEffect, useRef, useState } from "react";
import { Arrow, href } from "./Chrome";
export function Prism({ className = "" }: { className?: string }) {
  return (
    <span className={`spec-prism ${className}`} aria-hidden="true">
      {["front", "back", "top", "bottom", "left", "right"].map((side) => (
        <i key={side} className={`face-${side}`} />
      ))}
    </span>
  );
}
export function Home() {
  const intro = useRef<HTMLElement>(null);
  const build = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let raf = 0;
    let timer = 0;
    let alive = true;
    let installed = false;
    let settleUntil = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    function update() {
      raf = 0;
      const first = intro.current;
      if (first) {
        const progress = Math.max(
          0,
          Math.min(1, -first.getBoundingClientRect().top / innerHeight),
        );
        first.style.setProperty(
          "--intro-progress",
          String(reduced ? 0 : progress),
        );
      }
      const win = frame.current?.contentWindow;
      const section =
        win?.document.querySelector<HTMLElement>(".build-section");
      if (win && section && build.current && installed) {
        const rect = build.current.getBoundingClientRect();
        const p = Math.max(
          0,
          Math.min(1, -rect.top / (build.current.offsetHeight - innerHeight)),
        );
        const target = section.getBoundingClientRect().top + win.scrollY;
        const position =
          target +
          (section.offsetHeight - win.innerHeight) * (reduced ? 0.8 : p);
        if (Math.abs(win.scrollY - position) > 0.5) win.scrollTo(0, position);
      }
      if (performance.now() < settleUntil) raf = requestAnimationFrame(update);
    }
    function request() {
      settleUntil = performance.now() + 300;
      if (!raf) raf = requestAnimationFrame(update);
    }
    function install() {
      const doc = frame.current?.contentDocument;
      if (!doc?.querySelector(".build-section")) return false;
      if (!doc.getElementById("forma-client-view")) {
        const style = doc.createElement("style");
        style.id = "forma-client-view";
        style.textContent =
          ".topbar,.build-overlay,.custom-cursor,.cursor,.cursor-dot,.cursor-ring,.intro,.intro-screen,.intro-loader{visibility:hidden!important;pointer-events:none!important}body{cursor:auto!important}html{scroll-behavior:auto!important}";
        doc.head.append(style);
        doc
          .querySelectorAll("a,button,input,[tabindex]")
          .forEach((el) => el.setAttribute("tabindex", "-1"));
      }
      if (!doc.querySelector(".main--ready canvas")) return false;
      installed = true;
      if (alive) setReady(true);
      request();
      return true;
    }
    timer = window.setInterval(() => {
      if (install()) clearInterval(timer);
    }, 180);
    const fail = window.setTimeout(() => {
      if (!installed && alive) setFailed(true);
    }, 20000);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    request();
    return () => {
      alive = false;
      clearInterval(timer);
      clearTimeout(fail);
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);
  return (
    <>
      <section
        className="spec-intro"
        ref={intro}
        aria-label="Animation géométrique des trois segments de FORMA"
      >
        <div className="spec-intro-stage">
          <div className="spec-orbit">
            <Prism className="intro-piece piece-1" />
            <Prism className="intro-piece piece-2" />
            <Prism className="intro-piece piece-3" />
          </div>
          <span className="spec-scroll-guide" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
      </section>
      <section
        className="spec-build"
        data-ready={ready}
        ref={build}
        aria-label="Assemblage du grand F original au défilement"
      >
        <div className="spec-build-sticky">
          <iframe
            ref={frame}
            src="/archive/index.html"
            title="Grand F original de FORMA"
            className="spec-build-frame"
            tabIndex={-1}
            aria-hidden="true"
            allow="autoplay"
          />
          {!ready && (
            <p className="spec-build-status" role="status">
              {failed
                ? "Le chargement de l’animation prend plus de temps que prévu."
                : "Chargement de l’animation…"}
            </p>
          )}
          <a className="spec-build-cta" href={href("catalogue")}>
            Donner forme à mes idées <Arrow />
          </a>
        </div>
      </section>
    </>
  );
}
