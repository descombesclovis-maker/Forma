import { useRef } from "react";

/** The archived production portal is served intact in a same-origin frame. */
export function Login() {
  const frame = useRef<HTMLIFrameElement>(null);
  function adaptOriginalPortal() {
    const doc = frame.current?.contentDocument;
    if (!doc || doc.getElementById("forma-client-integration")) return;
    const integration = doc.createElement("style");
    integration.id = "forma-client-integration";
    integration.textContent = `
      html,body,#root,.site-shell{height:auto!important;min-height:0!important;overflow:visible!important;background:transparent!important}
      .topbar,.forma-menu,.site-header,.client-login__meta{display:none!important}
      .client-login{min-height:0!important;padding:34px clamp(18px,4vw,58px) 40px!important;background:transparent!important;overflow:visible!important}
      .client-login__grid{opacity:.18!important}
      .client-login__stage{min-height:0!important;max-width:1380px;margin:0 auto;grid-template-columns:minmax(0,1.05fr) minmax(350px,.95fr)!important;grid-template-rows:auto auto!important;align-items:center!important;gap:12px clamp(25px,5vw,72px)!important}
      .client-login__copy{grid-column:1/-1;grid-row:1;align-self:start!important;padding:0!important;text-align:center!important}
      .client-login__copy h1{font-size:clamp(40px,5.5vw,72px)!important}
      .client-login__scene{grid-column:1;grid-row:2;height:min(60vh,560px)!important;min-height:380px!important}
      .access-form{grid-column:2;grid-row:2;align-self:center!important;width:100%!important}
      @media(max-width:760px){.client-login{padding:22px 16px 32px!important}.client-login__stage{display:flex!important;flex-direction:column!important;gap:13px!important}.client-login__copy{order:1;width:100%!important;align-self:start!important}.client-login__copy h1{font-size:clamp(34px,9vw,54px)!important}.access-form{order:2;width:100%!important}.client-login__scene{order:3;width:100%;height:28vh!important;min-height:205px!important;max-height:290px!important}.client-login__gravity-label{top:3%!important}}
    `;
    doc.head?.append(integration);
    const emailForm = doc.querySelector<HTMLFormElement>(".access-form");
    const emailSubmit = emailForm?.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (emailSubmit) { emailSubmit.disabled = true; emailSubmit.setAttribute("aria-label", "Authentification non configurée"); }
    emailForm?.addEventListener("submit", (event) => { event.preventDefault(); event.stopImmediatePropagation(); }, true);
  }
  return <section className="spec-original-login" aria-label="Espace client FORMA">
    <iframe ref={frame} src="/original-client/index.html#connexion" title="Espace client original FORMA — formes 3D interactives" onLoad={adaptOriginalPortal} allow="autoplay; fullscreen" />
    <div className="client-auth-state" role="note"><span className="client-auth-dot" />Le portail visuel est restauré, mais l’authentification réelle n’est pas configurée. Le formulaire e-mail et les fournisseurs OAuth restent indisponibles; aucune connexion ne sera simulée.</div>
    <div className="client-oauth-list" aria-label="Fournisseurs OAuth non configurés">{["Google", "GitHub", "X"].map((provider) => <button key={provider} type="button" disabled aria-disabled="true">Continuer avec {provider}<span>Configuration requise</span></button>)}</div>
  </section>;
}
