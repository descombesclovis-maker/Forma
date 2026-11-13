import { useEffect } from "react";
import { Header, Footer } from "./client-spec/Chrome";
import { Contact } from "./client-spec/Contact";
import { GlobalCursor } from "./client-spec/GlobalCursor";
import { Home } from "./client-spec/Home";
import { Login } from "./client-spec/Login";
import { InfoPage } from "./client-spec/InfoPages";
import { Projects } from "./client-spec/Projects";
import "./client-spec/vitrine.css";

const paths: Record<string, "home" | "process" | "pricing" | "services" | "client"> = {
  "/": "home",
  "/comment-ca-marche": "process",
  "/tarification": "pricing",
  "/nos-services": "services",
  "/espace-client": "client",
};
const clientPaths = new Set(["/connexion", "/login", "/client"]);
const oldPaths = new Set(["/catalogue", "/commande", "/devis", "/paiement", "/produits", "/sites", "/applications", "/logos", "/publicite", "/legal", "/confidentialite"]);

function normalizeAddress() {
  if (clientPaths.has(location.pathname)) { window.location.replace("/espace-client"); return; }
  const hash = window.location.hash;
  if (hash.startsWith("#/")) {
    const legacy = hash.slice(2).split(/[/?]/, 1)[0];
    if (["connexion", "login", "client"].includes(legacy)) {
      window.location.replace("/espace-client");
      return;
    }
    const destinations: Record<string, string> = { accueil: "#accueil", contact: "#contact", catalogue: "#realisations", sites: "#accueil", logiciels: "#accueil", logos: "#accueil", publicite: "#accueil", "choix-site": "#accueil", formulaire: "#accueil", options: "#accueil", legal: "#accueil", confidentialite: "#accueil" };
    const destination = destinations[legacy] ?? "#accueil";
    history.replaceState(null, "", `/${destination}`);
    requestAnimationFrame(() => document.getElementById(destination.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  if (oldPaths.has(location.pathname)) history.replaceState(null, "", "/");
  if (!paths[location.pathname]) history.replaceState(null, "", "/");
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
    {route === "home" ? <main><Home /><Projects /><Contact /></main>
      : route === "client" ? <main><Login /></main>
      : <InfoPage page={route} />}
    <Footer />
  </div>;
}
