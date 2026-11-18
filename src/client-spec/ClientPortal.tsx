import { useEffect, useState, type FormEvent } from "react";
import { Login } from "./Login";
import { authConfigured, currentSession, loadDashboard, register, resetPassword, signIn, signOut, socialLogin, type Client, type Session } from "./forma-auth";
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
  const [mode, setMode] = useState<"signin" | "signup" | "reset" | "change">("signin");
  const [tab, setTab] = useState<Tab>("overview");

  async function reconnect() {
    try {
      const current = await currentSession();
      setSession(current?.session || null);
      setClient(current?.client || null);
      if (current) setData(await loadDashboard(current.session));
      else setData(null);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Connexion impossible."); }
  }
  useEffect(() => { let alive = true; reconnect().finally(() => { if (alive) setLoading(false); }); return () => { alive = false; }; }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setBusy(true);
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "").trim();
    const password = String(values.get("password") || "");
    try {
      if (mode === "reset") {
        await resetPassword(email); setNotice("Si ce compte existe, un courriel de réinitialisation sera envoyé.");
      } else if (mode === "signup") {
        const active = await register(email, password);
        if (active) await reconnect();
        else setNotice("Vérifiez votre boîte e-mail pour confirmer votre inscription avant de vous connecter.");
      } else {
        await signIn(email, password); await reconnect();
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Cette opération a échoué."); }
    finally { setBusy(false); }
  }
  async function logout() { await signOut(); setSession(null); setClient(null); setData(null); setTab("overview"); }
  if (loading) return <Loading />;
  if (!authConfigured) return <section className="forma-portal-unconfigured"><Login /><p role="status">L'espace client sécurisé est en cours de configuration. Aucun compte n'est activé sur ce site pour le moment.</p></section>;

  if (!session || !client) return <section className="forma-portal-entry">
    <div className="forma-portal-art" aria-hidden="true"><span>F</span><p>Votre espace, votre projet.</p></div>
    <div className="forma-portal-auth">
      <p className="forma-portal-kicker">FORMA / ACCÈS PRIVÉ</p>
      <h1>{mode === "signup" ? "Créer mon compte." : mode === "reset" ? "Retrouver mon accès." : "Bienvenue."}</h1>
      <p>Vos projets et documents restent accessibles uniquement depuis votre compte.</p>
      <form onSubmit={submit}>
        <label>Adresse e-mail<input name="email" type="email" autoComplete="email" required /></label>
        {mode !== "reset" && <label>Mot de passe<input name="password" type="password" minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></label>}
        <button type="submit" disabled={busy}>{busy ? "Veuillez patienter…" : mode === "signup" ? "Créer le compte" : mode === "reset" ? "Envoyer le lien" : "Se connecter"}</button>
      </form>
      {error && <p className="forma-portal-alert" role="alert">{error}</p>}
      {notice && <p className="forma-portal-notice" role="status">{notice}</p>}
      {mode === "signin" && <div className="forma-social">
        <span>Ou continuer avec</span>
        {(["google", "github", "x"] as const).map(provider => <button type="button" key={provider} onClick={() => socialLogin(provider)}>{provider === "x" ? "X" : provider === "github" ? "GitHub" : "Google"}</button>)}
      </div>}
      <nav className="forma-portal-auth-links" aria-label="Gestion du compte">
        {mode !== "signup" && <button type="button" onClick={() => { setMode("signup"); setNotice(""); setError(""); }}>Créer un compte</button>}
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
