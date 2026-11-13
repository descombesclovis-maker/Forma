import { useRef } from "react";

function ProviderMark({ provider }: { provider: string }) {
  if (provider === "Google") return <svg className="oauth-brand oauth-google" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.1H12v3.98h5.38a4.6 4.6 0 0 1-2 3.02v2.46h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.46c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H3.06v2.53A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.99a6 6 0 0 1 0-3.98V7.48H3.06a10 10 0 0 0 0 9.04l3.35-2.53Z"/><path fill="#EA4335" d="M12 5.91c1.47 0 2.78.51 3.82 1.52l2.87-2.87C16.95 2.94 14.7 2 12 2a10 10 0 0 0-8.94 5.48l3.35 2.53c.79-2.35 2.99-4.1 5.59-4.1Z"/></svg>;
  if (provider === "Microsoft") return <svg className="oauth-brand" viewBox="0 0 24 24" aria-hidden="true"><path fill="#f25022" d="M2 2h9.5v9.5H2z"/><path fill="#7fba00" d="M12.5 2H22v9.5h-9.5z"/><path fill="#00a4ef" d="M2 12.5h9.5V22H2z"/><path fill="#ffb900" d="M12.5 12.5H22V22h-9.5z"/></svg>;
  if (provider === "GitHub") return <svg className="oauth-brand oauth-mono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.75 1.74 3.4 1.24.1-.73.4-1.23.72-1.52-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.13-1.44 3.07-1.14 3.07-1.14.62 1.54.23 2.68.12 2.96.72.78 1.15 1.77 1.15 2.99 0 4.3-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.05c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>;
  return <svg className="oauth-brand oauth-mono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.5L5.48 22H2.34l7.25-8.3L1.8 2h6.4l4.43 6.92L18.9 2Zm-1.1 17.9h1.73L7.28 3.98H5.43L17.8 19.9Z"/></svg>;
}

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
    <div className="client-oauth-list" aria-label="Fournisseurs OAuth non configurés">{["Google", "Microsoft", "GitHub", "X"].map((provider) => <button key={provider} type="button" disabled aria-disabled="true"><ProviderMark provider={provider} /><span className="client-oauth-label">Continuer avec {provider}</span><span className="client-oauth-status">Indisponible</span></button>)}</div>
  </section>;
}
