import { useRef } from "react";

/**
 * The client portal is restored from the verified public production bundle.
 * Its original Three.js scene and pointer interactions remain inside this
 * same-origin frame; this wrapper only connects its return-home control to the
 * current FORMA route.
 */
export function Login() {
  const frame = useRef<HTMLIFrameElement>(null);

  function connectHomeControl() {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    const sharedHeader = doc.createElement("style");
    sharedHeader.textContent = ".topbar,.forma-menu{display:none!important}";
    doc.head?.append(sharedHeader);
    doc.addEventListener(
      "click",
      (event) => {
        const target = event.target as Element | null;
        if (!target || typeof target.closest !== "function") return;
        const button = target.closest("button");
        if (!button || !/PAGE D.?ACCUEIL/i.test(button.textContent || "")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.hash = "#/accueil";
        window.scrollTo({ top: 0, behavior: "auto" });
      },
      true,
    );
  }

  return (
    <section className="spec-original-login" aria-label="Espace client FORMA">
      <iframe
        ref={frame}
        src="/original-client/index.html#connexion"
        title="Espace client original FORMA — interface et formes 3D interactives"
        onLoad={connectHomeControl}
        allow="autoplay; fullscreen"
      />
    </section>
  );
}
