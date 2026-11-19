import { useEffect, useRef, useState, type FormEvent } from "react";
import { ProviderIcon } from "./ProviderIcons";
import { Login } from "./Login";
import { authConfigured, currentSession, recovering, loadDashboard, register, requestLoginCode, verifyEmailCode, resendSignupCode, resetPassword, updatePassword, signIn, signOut, socialLogin, type Client, type Session } from "./forma-auth";
import "./client-portal.css";

type Dashboard = Awaited<ReturnType<typeof loadDashboard>>;
type Tab = "overview" | "projects" | "orders" | "notifications" | "activity";
const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Vue d'ensemble" }, { key: "projects", label: "Mes projets" },
  { key: "orders", label: "Mes commandes" }, { key: "notifications", label: "Notifications" },
  { key: "activity", label: "Activité" }
];
function date(value: string) { return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value)); }
function Loading() { return <p className="forma-portal-state" role="status">Ouverture sécurisée de votre espace…</p>; }
const noData = "Aucune information disponible pour le moment.";
export function ClientPortal() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "code" | "signup" | "verify" | "reset" | "change">("signin");
  const [codeFor, setCodeFor] = useState<"signup" | "code">("signup");
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendLockedUntil, setResendLockedUntil] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [tab, setTab] = useState<Tab>("overview");

  const generation = useRef(0);
  async function reconnect() {
    const id = ++generation.current;
    try {
      const current = await currentSession();
      if (id !== generation.current) return;
      setSession(current?.session ?? null);
      setClient(current?.client ?? null);
      setData(null);
      if (current && !recovering()) {
        try {
          const dashboard = await loadDashboard(current.session, current.client.id);
          if (id === generation.current) setData(dashboard);
        } catch {
          if (id === generation.current) setError("Impossible de charger vos dossiers. Actualisez la page pour réessayer.");
        }
      } else if (!current && (recovering() || mode === "change")) {
        setMode("reset"); setError("Lien expiré. Demandez un nouveau lien de récupération.");
      }
    } catch (failure) {
      if (id === generation.current) {
        setData(null); setSession(null); setClient(null);
        setError(failure instanceof Error ? failure.message : "Connexion impossible.");
      }
    }
  }
  useEffect(() => { const timer = window.setInterval(() => setCurrentTime(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    let alive = true;
    if (recovering()) setMode("change");
    reconnect().finally(() => { if (alive) setLoading(false); });
    const resume = () => { if (document.visibilityState === "visible") void reconnect(); };
    document.addEventListener("visibilitychange", resume);
    return () => { alive = false; ++generation.current; document.removeEventListener("visibilitychange", resume); };
  }, []);
  useEffect(() => {
    if (!session) return;
    const delay = (session.expires_at - 60) * 1000 - Date.now();
    const timer = window.setTimeout(() => void reconnect(), Math.max(1000, delay));
    return () => window.clearTimeout(timer);
  }, [session]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setBusy(true);
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "").trim();
    const password = String(values.get("password") || "");
    try {
      if (mode === "verify") {
        if (!pendingEmail) throw new Error("Inscription introuvable. Recommencez votre inscription.");
        const code = String(values.get("otp") || "").trim();
        await verifyEmailCode(pendingEmail, code);
        setMode("signin");
        setPendingEmail("");
        await reconnect();
      } else if (mode === "code") {
        await requestLoginCode(email);
        setCodeFor("code"); setPendingEmail(email); setMode("verify"); setResendLockedUntil(Date.now() + 60000);
        setNotice("Si votre compte est actif, vérifiez votre boîte de réception.");
      } else if (mode === "change") {
        if (!session) throw new Error("Lien expiré : demandez une nouvelle réinitialisation.");
        await updatePassword(password, session);
        await logout(); setMode("signin");
        setNotice("Mot de passe modifié. Connectez-vous à nouveau.");
      } else if (mode === "reset") {
        await resetPassword(email); setNotice("Si ce compte existe, un courriel de réinitialisation sera envoyé.");
      } else if (mode === "signup") {
        const active = await register(email, password);
        if (active) await reconnect();
        else { setCodeFor("signup"); setPendingEmail(email); setMode("verify"); setResendLockedUntil(Date.now() + 60000); setNotice("Un code à six chiffres vous a été envoyé par e-mail."); }
      } else {
        await signIn(email, password); await reconnect();
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Cette opération a échoué."); }
    finally { setBusy(false); }
  }
  async function resendCode() {
    if (!pendingEmail || busy || Date.now() < resendLockedUntil) return;
    setBusy(true); setError(""); setNotice("");
    try { await (codeFor === "signup" ? resendSignupCode(pendingEmail) : requestLoginCode(pendingEmail)); setResendLockedUntil(Date.now() + 60000); setNotice("Un nouveau code de confirmation a été envoyé."); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Impossible de renvoyer le code."); }
    finally { setBusy(false); }
  }
  async function logout() {
    ++generation.current;
    setBusy(true); setError(""); setNotice("");
    setSession(null); setClient(null); setData(null); setTab("overview");
    try { await signOut(); }
    catch { setError("Session fermée sur cet appareil. La révocation distante n’a pas pu être confirmée."); }
    finally { setBusy(false); }
  }
  if (loading) return <Loading />;
  if (!authConfigured) return <section className="forma-portal-unconfigured"><Login /><p role="status">L'espace client sécurisé est en cours de configuration. Aucun compte n'est activé sur ce site pour le moment.</p></section>;

  if (mode === "change" || mode === "verify" || !session || !client) return <section className="forma-portal-entry">
    <div className="forma-portal-art"><iframe src="/original-client/index.html#connexion" title="Animation Forma originale" tabIndex={-1} aria-hidden="true" onLoad={event => { const doc = event.currentTarget.contentDocument; if (!doc) return; const style = doc.createElement("style"); style.textContent = "html,body,#root,.site-shell{height:100%!important;overflow:hidden!important;background:transparent!important}.topbar,.forma-menu,.site-header,.access-form,.client-login__copy,.client-login__meta{display:none!important}.client-login{padding:0!important;height:100vh!important;min-height:0!important;overflow:hidden!important;background:transparent!important}.client-login__stage{display:block!important;min-height:0!important;height:100%!important}.client-login__scene{width:100%!important;height:100%!important;max-width:none!important;min-height:0!important;overflow:visible!important}.client-login__scene canvas{transform:scale(.84)!important;transform-origin:center center!important}"; doc.head.append(style); }} /><p>Votre espace, votre projet.</p></div>
    <div className="forma-portal-auth">
      <p className="forma-portal-kicker">FORMA / ACCÈS PRIVÉ</p>
      <h1>{mode === "code" ? "Connexion par code." : mode === "signup" ? "Créer mon compte." : mode === "reset" ? "Retrouver mon accès." : mode === "verify" ? "Vérifiez votre e-mail." : mode === "change" ? "Nouveau mot de passe." : "Bienvenue."}</h1>
      <p>{mode === "verify" ? `Saisissez le code reçu à ${pendingEmail}. Il est personnel et temporaire.` : "Vos projets et documents restent accessibles uniquement depuis votre compte."}</p>
      <form onSubmit={submit}>
        {mode !== "change" && mode !== "verify" && <label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label>}
        {mode !== "code" && mode !== "reset" && mode !== "verify" && <label>Mot de passe<input name="password" type="password" minLength={mode === "signin" ? 1 : 8} autoComplete={mode === "signup" || mode === "change" ? "new-password" : "current-password"} required /></label>}
        {mode === "verify" && <label htmlFor="forma-signup-otp">Code de confirmation (6 chiffres)<input id="forma-signup-otp" className="forma-otp-input" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" aria-describedby="forma-otp-help" required onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 6); }}/><span id="forma-otp-help" className="forma-otp-help">Vérifiez les courriels indésirables si nécessaire. Ne communiquez jamais ce code.</span></label>}
        <button type="submit" disabled={busy}>{busy ? "Veuillez patienter…" : mode === "signup" ? "Créer le compte" : mode === "verify" ? "Valider les 6 chiffres" : mode === "code" ? "Recevoir mon code" : mode === "reset" ? "Envoyer le lien" : mode === "change" ? "Enregistrer le mot de passe" : "Se connecter"}</button>
      </form>
      {error && <p className="forma-portal-alert" role="alert">{error}</p>}
      {notice && <p className="forma-portal-notice" role="status">{notice}</p>}
      {mode === "verify" && <div className="forma-otp-actions"><button type="button" onClick={resendCode} disabled={busy || currentTime < resendLockedUntil}>Renvoyer un code{currentTime < resendLockedUntil ? ` (${Math.ceil((resendLockedUntil - currentTime) / 1000)} s)` : ""}</button><button type="button" onClick={() => {setMode(codeFor); setError(""); setNotice(""); }}>Corriger mon e-mail</button></div>}
      {mode === "signin" && <div className="forma-social">
        <span>Ou continuer avec</span>
        {(["google", "github", "x"] as const).map(provider => <button type="button" key={provider} className="forma-provider-button" onClick={() => socialLogin(provider)} title={`Continuer avec ${provider === "x" ? "X" : provider === "github" ? "GitHub" : "Google"}`} aria-label={`Continuer avec ${provider === "x" ? "X" : provider === "github" ? "GitHub" : "Google"}`}><ProviderIcon provider={provider} /></button>)}
      </div>}
      <nav className="forma-portal-auth-links" aria-label="Gestion du compte">
        {mode === "signin" && <button type="button" onClick={() => { setMode("code"); setNotice(""); setError(""); }}>Se connecter par code e-mail</button>}
        {mode !== "signup" && mode !== "verify" && <button type="button" onClick={() => { setMode("signup"); setNotice(""); setError(""); }}>Créer un compte</button>}
        {mode !== "signin" && <button type="button" onClick={() => { setMode("signin"); setNotice(""); setError(""); }}>Se connecter</button>}
        {mode === "signin" && <button type="button" onClick={() => { setMode("reset"); setNotice(""); setError(""); }}>Mot de passe oublié ?</button>}
      </nav>
      <p className="forma-portal-privacy">Consultez notre <a href="/politique-confidentialite">politique de confidentialité</a>. L'activation des prestataires externes est soumise à leur configuration.</p>
    </div>
  </section>;

  return <section className="forma-dashboard">
    <header className="forma-dashboard-hero"><p className="forma-portal-kicker">FORMA / PORTAIL CLIENT</p><h1>Votre espace.</h1>
      <p>{client.email || "Compte authentifié"} · Accès personnel</p><button type="button" onClick={logout}>Se déconnecter ↗</button></header>
    <div className="forma-dashboard-grid">
      <nav className="forma-dashboard-tabs" aria-label="Rubriques de mon espace">
        {tabs.map(item => <button key={item.key} type="button" className={tab === item.key ? "active" : ""} aria-current={tab === item.key ? "page" : undefined} onClick={() => setTab(item.key)}>{item.label} <span>↗</span></button>)}
      </nav>
      <main className="forma-dashboard-content" aria-live="polite">
        {error && <p className="forma-portal-alert" role="alert">{error}</p>}
        {tab === "overview" && <><h2>Bonjour, {client.email?.split("@")[0] || "bienvenue"}.</h2>
          <p className="forma-dashboard-subtitle">Retrouvez vos informations réelles, mises à jour par Forma. Aucune donnée de démonstration n'est affichée.</p>
          <div className="forma-dashboard-stats">
            <article><span>Projets</span><strong>{data?.projects.length ?? "—"}</strong></article>
            <article><span>Commandes</span><strong>{data?.orders.length ?? "—"}</strong></article>
            <article><span>Notifications</span><strong>{data?.notifications.length ?? "—"}</strong></article>
          </div>
          <h3>Dernière activité</h3>{data?.activity.length ? data.activity.slice(0,5).map(item => <article className="forma-dashboard-row" key={item.id}><strong>{item.description}</strong><time>{date(item.created_at)}</time></article>) : <p className="forma-dashboard-empty">{noData}</p>}
        </>}
        {tab === "projects" && <><h2>Mes projets</h2>{data?.projects.length ? data.projects.map(item => <article className="forma-dashboard-row" key={item.id}><div><strong>{item.title}</strong><p>État : {item.status}</p></div><div><time>{date(item.created_at)}</time>{item.site_url && <a href={item.site_url} target="_blank" rel="noopener noreferrer">Visiter le site ↗</a>}</div></article>) : <p className="forma-dashboard-empty">{noData}</p>}</>}
        {tab === "orders" && <><h2>Mes commandes</h2>{data?.orders.length ? data.orders.map(item => <article className="forma-dashboard-row" key={item.id}><div><strong>{item.reference}</strong><p>État : {item.status}</p></div><div><strong>{new Intl.NumberFormat("fr-FR", { style:"currency", currency:item.currency }).format(item.amount_cents/100)}</strong><time>{date(item.created_at)}</time></div></article>) : <p className="forma-dashboard-empty">{noData}</p>}</>}
        {tab === "notifications" && <><h2>Notifications</h2>{data?.notifications.length ? data.notifications.map(item => <article className="forma-dashboard-row" key={item.id}><div><strong>{item.title}</strong><p>{item.body}</p></div><time>{date(item.created_at)}</time></article>) : <p className="forma-dashboard-empty">{noData}</p>}</>}
        {tab === "activity" && <><h2>Historique d'activité</h2>{data?.activity.length ? data.activity.map(item => <article className="forma-dashboard-row" key={item.id}><strong>{item.description}</strong><time>{date(item.created_at)}</time></article>) : <p className="forma-dashboard-empty">{noData}</p>}</>}
        <aside className="forma-dashboard-pending"><h3>Services & livraisons</h3><p>Les achats d'options, fichiers chiffrés et identifiants techniques seront activés uniquement après la mise en place des contrôles d'accès serveur et des paiements vérifiés. Aucun téléchargement non sécurisé n'est proposé.</p></aside>
      </main>
    </div>
  </section>;
}
