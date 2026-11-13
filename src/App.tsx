import { useEffect } from "react";
import { Header, Footer } from "./client-spec/Chrome";
import { Contact } from "./client-spec/Contact";
import { GlobalCursor } from "./client-spec/GlobalCursor";
import { Home } from "./client-spec/Home";
import { Login } from "./client-spec/Login";
import { InfoPage } from "./client-spec/InfoPages";
import { LegalPage } from "./client-spec/Legal";
import { Projects } from "./client-spec/Projects";
import { DemoPage, demoSlugs } from "./client-spec/Demos";
import "./client-spec/vitrine.css";
import "./client-spec/evolution-2.css";
import "./client-spec/refonte.css";

type Route = "home" | "process" | "pricing" | "services" | "client" | "contact" | "privacy" | "legal";
const paths: Record<string, Route> = {
  "/": "home",
  "/comment-ca-marche": "process",
  "/tarification": "pricing",
  "/nos-services": "services",
  "/espace-client": "client",
  "/nous-contacter": "contact",
  "/politique-confidentialite": "privacy",
  "/mentions-legales": "legal",
};
const clientPaths = new Set(["/connexion", "/login", "/client"]);
const oldPaths = new Set(["/catalogue", "/commande", "/devis", "/paiement", "/produits", "/sites", "/applications", "/logos", "/publicite", "/legal", "/confidentialite", "/contact"]);

function normalizeAddress() {
  if (clientPaths.has(location.pathname)) { window.location.replace("/espace-client"); return; }
  if (location.pathname === "/contact") { window.location.replace("/nous-contacter" + location.search); return; }
  if (location.pathname === "/legal") { window.location.replace("/mentions-legales"); return; }
  if (location.pathname === "/confidentialite") { window.location.replace("/politique-confidentialite"); return; }
  const hash = window.location.hash;
  if (hash.startsWith("#/")) {
    const legacy = hash.slice(2).split(/[/?]/, 1)[0];
    if (["connexion", "login", "client"].includes(legacy)) { window.location.replace("/espace-client"); return; }
    if (["contact", "formulaire"].includes(legacy)) { window.location.replace("/nous-contacter" + location.search); return; }
    if (legacy === "confidentialite") { window.location.replace("/politique-confidentialite"); return; }
    if (legacy === "legal") { window.location.replace("/mentions-legales"); return; }
    const destinations: Record<string, string> = { accueil: "#accueil", catalogue: "#realisations", sites: "#accueil", logiciels: "#accueil", logos: "#accueil", publicite: "#accueil", "choix-site": "#accueil", options: "#accueil" };
    history.replaceState(null, "", "/" + (destinations[legacy] ?? "#accueil"));
  }
  if (location.hash === "#contact" && location.pathname === "/") { window.location.replace("/nous-contacter" + location.search); return; }
  if (location.pathname.startsWith("/demo/") && demoSlugs.includes(location.pathname.slice(6))) return;
  if (oldPaths.has(location.pathname) || !paths[location.pathname]) history.replaceState(null, "", "/");
}

export default function App() {
  useEffect(() => {
    normalizeAddress();
    window.addEventListener("hashchange", normalizeAddress);
    return () => window.removeEventListener("hashchange", normalizeAddress);
  }, []);
  const route = paths[location.pathname] ?? "home";
  return <div className="spec">
    <GlobalCursor />
    <Header />
    {location.pathname.startsWith("/demo/") && demoSlugs.includes(location.pathname.slice(6)) ? <main><DemoPage slug={location.pathname.slice(6)} /></main>
      : route === "home" ? <main><Home /><Projects /></main>
      : route === "client" ? <main><Login /></main>
      : route === "contact" ? <main><Contact /></main>
      : route === "privacy" || route === "legal" ? <main><LegalPage page={route} /></main>
      : <InfoPage page={route} />}
    <Footer />
  </div>;
}
