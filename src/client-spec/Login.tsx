import { useRef } from "react";

const oauthStartUrl = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_FORMA_OAUTH_START_URL?.trim();

const providerMarkup: Record<string, string> = {
  google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.42 13.92a6 6 0 0 1 0-3.84v-2.6H3.07a10 10 0 0 0 0 9.04l3.35-2.6Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.93 5.48l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.75-1.32-3.75-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.28-2.61 5.22-5.1 5.5.4.35.76 1.03.76 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.48L5.5 22H2.36l7.25-8.29L1.8 2h6.4l4.43 6.86L18.9 2Zm-1.1 18h1.73L7.27 3.9H5.42L17.8 20Z"/></svg>',
};

/** The verified original portal bundle remains isolated in a same-origin frame. */
export function Login() {
  const frame = useRef<HTMLIFrameElement>(null);

  function harmonizeOriginalPortal() {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    if (!doc.getElementById("forma-portal-harmonization")) {
      const style = doc.createElement("style");
      style.id = "forma-portal-harmonization";
      style.textContent = `
      .topbar,.forma-menu,.client-login__meta{display:none!important}
      .client-login{min-height:calc(100svh - 88px)!important;padding:18px 34px 24px!important;background-color:#f4f4ef!important;background-image:none!important}
      .client-login__grid{background-image:linear-gradient(#11110f0b 1px,transparent 1px),linear-gradient(90deg,#11110f0b 1px,transparent 1px)!important;background-size:90px 90px!important;background-position:0 -88px!important;mask-image:none!important;-webkit-mask-image:none!important}
      .client-login__stage{min-height:0!important;height:calc(100svh - 138px)!important;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr)!important;grid-template-rows:auto minmax(0,1fr)!important;align-items:center!important;gap:8px 32px!important}
      .client-login__copy{grid-column:1/-1!important;grid-row:1!important;align-self:start!important;justify-self:center!important;width:100%!important;text-align:center!important;padding:0!important}
      .client-login__copy>span{display:block!important}
      .client-login__copy h1{margin:8px 0 0!important;font-size:clamp(34px,4vw,54px)!important;line-height:.98!important}
      .client-login__scene{grid-column:1!important;grid-row:2!important;width:100%!important;height:min(32vh,320px)!important;min-height:220px!important;align-self:center!important}
      .client-login__coordinates{bottom:4%!important}
      .access-form{grid-column:2!important;grid-row:2!important;width:100%!important;max-width:620px!important;justify-self:center!important;align-self:center!important}
      .forma-oauth{padding:13px 17px 11px!important;border-top:1px solid rgba(16,16,15,.14)!important}
      .forma-oauth__label{display:block!important;margin-bottom:9px!important;color:#777770!important;font:7px/1.4 Inter,Arial,sans-serif!important;letter-spacing:.16em!important}
      .forma-oauth__buttons{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}
      .forma-oauth__button{min-width:0!important;min-height:40px!important;padding:6px 5px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;border:1px solid rgba(16,16,15,.2)!important;background:#f4f4ef!important;color:#10100f!important;font:600 10px/1 Inter,Arial,sans-serif!important;transition:background .22s ease,color .22s ease,transform .22s ease,border-color .22s ease!important}
      .forma-oauth__button svg{width:16px!important;height:16px!important;flex:0 0 16px!important}
      .forma-oauth__button:hover:not(:disabled){background:#10100f!important;color:#f4f4ef!important;border-color:#10100f!important;transform:translateY(-2px)!important}
      .forma-oauth__button:disabled{opacity:.52!important;cursor:not-allowed!important}
      .forma-oauth__button:focus-visible{outline:2px solid #687151!important;outline-offset:2px!important}
      .forma-oauth__status{margin:8px 0 0!important;min-height:10px!important;color:#777770!important;font:8px/1.4 Inter,Arial,sans-serif!important}
      @media(max-width:850px){
        .client-login{min-height:0!important;padding:16px 18px 22px!important}
        .client-login__stage{display:grid!important;height:auto!important;min-height:0!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto auto!important;gap:14px!important;align-items:start!important}
        .client-login__copy{grid-column:1!important;grid-row:1!important;padding:0!important}
        .client-login__copy h1{font-size:clamp(36px,10vw,52px)!important}
        .access-form{grid-column:1!important;grid-row:2!important;width:100%!important;max-width:560px!important;justify-self:center!important;align-self:start!important}
        .client-login__scene{grid-column:1!important;grid-row:3!important;width:min(100%,500px)!important;height:210px!important;min-height:180px!important;justify-self:center!important}
        .client-login__coordinates{bottom:2%!important}
      }
      @media(max-width:380px){.forma-oauth__button{font-size:9px!important;gap:4px!important}.forma-oauth__buttons{gap:5px!important}.forma-oauth{padding-inline:11px!important}}
      @media(prefers-reduced-motion:reduce){.forma-oauth__button{transition:none!important}}
    `;
      doc.head?.append(style);
    }

    // The legacy portal is same-origin, so mirror FORMA's shared cursor inside its iframe too.
    if (doc.defaultView?.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      doc.documentElement.classList.add("forma-custom-cursor");
      if (!doc.querySelector(".forma-cursor")) {
        const pointer = doc.createElement("div");
        pointer.className = "forma-cursor";
        pointer.setAttribute("aria-hidden", "true");
        pointer.innerHTML = "<i></i>";
        const pointerStyle = doc.createElement("style");
        pointerStyle.textContent = `html.forma-custom-cursor,html.forma-custom-cursor *{cursor:none!important}html.forma-custom-cursor input,html.forma-custom-cursor textarea,html.forma-custom-cursor [contenteditable=true]{cursor:text!important}.forma-cursor{position:fixed;z-index:10000;left:0;top:0;width:23px;height:23px;border:1px solid #11110f;border-radius:50%;background:transparent;pointer-events:none;opacity:0;transition:opacity .14s ease,width .2s ease,height .2s ease;will-change:transform;mix-blend-mode:multiply}.forma-cursor:before{content:'';position:absolute;left:50%;top:50%;width:3px;height:3px;border-radius:50%;background:#11110f;transform:translate(-50%,-50%)}.forma-cursor.is-visible{opacity:1}.forma-cursor.is-active{width:32px;height:32px;background:#11110f0b}.forma-cursor.is-down{width:19px;height:19px}@media(prefers-reduced-motion:reduce){.forma-cursor{transition:none!important}}`;
        doc.head?.append(pointerStyle);
        doc.body?.append(pointer);
        let raf = 0;
        let x = -100;
        let y = -100;
        doc.addEventListener("pointermove", (event) => {
          if (event.pointerType !== "mouse") return;
          x = event.clientX;
          y = event.clientY;
          pointer.classList.add("is-visible");
          if (raf) return;
          raf = doc.defaultView!.requestAnimationFrame(() => {
            pointer.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
            raf = 0;
          });
        }, { passive: true });
        doc.addEventListener("pointerover", (event) => {
          const target = event.target;
          if (!(target instanceof doc.defaultView!.Element)) return;
          pointer.classList.toggle("is-active", !!target.closest("a,button,[role=button]"));
        }, { passive: true });
        doc.addEventListener("pointerdown", (event) => { if (event.pointerType === "mouse") pointer.classList.add("is-down"); }, { passive: true });
        doc.addEventListener("pointerup", () => pointer.classList.remove("is-down"), { passive: true });
        doc.addEventListener("pointerleave", () => pointer.classList.remove("is-visible","is-active","is-down"));
      }
    }

    const form = doc.querySelector<HTMLFormElement>(".access-form");
    const actions = form?.querySelector<HTMLElement>(".access-form__actions");
    if (!form || !actions) {
      if (!doc.documentElement.dataset.formaOauthObserver) {
        doc.documentElement.dataset.formaOauthObserver = "true";
        const observer = new MutationObserver(() => {
          if (doc.querySelector(".access-form__actions")) {
            observer.disconnect();
            delete doc.documentElement.dataset.formaOauthObserver;
            harmonizeOriginalPortal();
          }
        });
        observer.observe(doc.documentElement, { childList: true, subtree: true });
        window.setTimeout(() => observer.disconnect(), 10000);
      }
      return;
    }
    if (form.querySelector(".forma-oauth")) return;

    const group = doc.createElement("section");
    group.className = "forma-oauth";
    group.setAttribute("aria-label", "Connexion rapide");
    const label = doc.createElement("span");
    label.className = "forma-oauth__label";
    label.textContent = "OU CONTINUER AVEC";
    const buttons = doc.createElement("div");
    buttons.className = "forma-oauth__buttons";
    const status = doc.createElement("p");
    status.className = "forma-oauth__status";
    status.setAttribute("role", "status");
    status.textContent = oauthStartUrl
      ? "Connexion sécurisée via votre fournisseur."
      : "Connexion rapide non configurée.";

    ([
      ["google", "Google"],
      ["github", "GitHub"],
      ["x", "X"],
    ] as const).forEach(([provider, name]) => {
      const button = doc.createElement("button");
      button.type = "button";
      button.className = "forma-oauth__button";
      button.setAttribute("aria-label", `Continuer avec ${name}`);
      button.disabled = !oauthStartUrl;
      button.innerHTML = `${providerMarkup[provider]}<span>${name}</span>`;
      button.addEventListener("click", () => {
        if (!oauthStartUrl) return;
        try {
          const target = new URL(oauthStartUrl, window.location.href);
          target.searchParams.set("provider", provider);
          status.textContent = `Redirection sécurisée vers ${name}…`;
          button.disabled = true;
          window.location.assign(target.toString());
        } catch {
          status.textContent = "Adresse de connexion invalide. Réessayez plus tard.";
        }
      });
      buttons.append(button);
    });
    group.append(label, buttons, status);
    actions.insertAdjacentElement("afterend", group);
  }

  return (
    <section className="spec-original-login" aria-label="Espace client FORMA"
      onPointerEnter={() => document.querySelector(".forma-cursor")?.classList.add("is-suspended")}
      onPointerLeave={() => document.querySelector(".forma-cursor")?.classList.remove("is-suspended")}>
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
