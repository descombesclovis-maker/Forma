import { useRef } from "react";

/** The verified original portal bundle remains isolated in a same-origin frame. */
export function Login() {
  const frame = useRef<HTMLIFrameElement>(null);

  function harmonizeOriginalPortal() {
    const doc = frame.current?.contentDocument;
    if (!doc || doc.getElementById("forma-portal-harmonization")) return;
    const style = doc.createElement("style");
    style.id = "forma-portal-harmonization";
    style.textContent = `
      .topbar,.forma-menu,.client-login__meta{display:none!important}
      .client-login{min-height:100svh!important;padding:22px 34px 28px!important;background-color:#f4f4ef!important;background-image:none!important}
      .client-login__grid{background-image:linear-gradient(#11110f0b 1px,transparent 1px),linear-gradient(90deg,#11110f0b 1px,transparent 1px)!important;background-size:90px 90px!important;background-position:0 -88px!important;mask-image:none!important;-webkit-mask-image:none!important}
      .client-login__stage{min-height:calc(100svh - 56px)!important;grid-template-columns:minmax(0,1fr) minmax(340px,.82fr)!important;gap:18px 38px!important}
      .client-login__scene{height:min(48vh,500px)!important;min-height:340px!important}
      @media(max-width:850px){.client-login{padding:18px 20px 24px!important;background-position:0 -76px!important}.client-login__grid{background-position:0 -76px!important}.client-login__stage{min-height:0!important;grid-template-columns:1fr!important;grid-template-rows:auto auto auto!important;gap:14px!important}.client-login__scene{grid-column:1!important;grid-row:1!important;width:min(100%,520px)!important;height:min(43vh,380px)!important;min-height:270px!important;justify-self:center!important}.client-login__copy{grid-column:1!important;grid-row:2!important;padding-top:0!important}.access-form{grid-column:1!important;grid-row:3!important;width:100%!important;max-width:560px!important;justify-self:center!important}}
    `;
    doc.head?.append(style);
  }

  return (
    <section className="spec-original-login" aria-label="Espace client FORMA">
      <iframe
        ref={frame}
        src="/original-client/index.html#connexion"
        title="Espace client original FORMA — interface et formes 3D interactives"
        onLoad={harmonizeOriginalPortal}
        allow="autoplay; fullscreen"
      />
    </section>
  );
}
