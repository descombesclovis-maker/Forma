import { useRef, useState, useEffect } from "react";
import { link, Arrow } from "./ui";
export function Archive({ original = false }: { original?: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (original) return;
    const timer = window.setInterval(() => {
      const doc = frame.current?.contentDocument;
      if (!doc || doc.documentElement.dataset.bridge) return;
      doc.documentElement.dataset.bridge = "true";
      doc.addEventListener(
        "click",
        (e) => {
          const el = (e.target as Element).closest("a,button");
          if (!el) return;
          const text = (el.textContent || "").trim().toLowerCase();
          let route = "";
          if (/sites web/.test(text)) route = "sites";
          else if (/logiciels|applications/.test(text)) route = "logiciels";
          else if (/logos|identités visuelles/.test(text)) route = "identites";
          else if (/réseaux|publicité/.test(text)) route = "reseaux";
          else if (/espace client|connexion/.test(text)) route = "client";
          else if (/lancer mon projet|commencez votre projet/.test(text))
            route = "configurer";
          if (route) {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.location.hash = link(route).slice(1);
          }
        },
        true,
      );
    }, 300);
    return () => clearInterval(timer);
  }, [original]);
  return (
    <div className="forma-shell">
      {!ready && (
        <p className="loading-note" role="status">
          FORMA — chargement…
        </p>
      )}
      <iframe
        ref={frame}
        className="forma-frame"
        src={`/${original ? "archive" : "forma-catalogue"}/index.html`}
        title="Accueil FORMA — animation originale"
        onLoad={() => setReady(true)}
        allow="autoplay; fullscreen"
      />
      {!original && (
        <a className="explore" href={link("univers")}>
          Explorer FORMA{" "}
          <span>
            <Arrow />
          </span>
        </a>
      )}
    </div>
  );
}
