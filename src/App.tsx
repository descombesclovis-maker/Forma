import { useEffect } from "react";
import { Header, Footer } from "./client-spec/Chrome";
import { Contact } from "./client-spec/Contact";
import { GlobalCursor } from "./client-spec/GlobalCursor";
import { Home } from "./client-spec/Home";
import { Projects } from "./client-spec/Projects";
import "./client-spec/vitrine.css";

const legacySections: Record<string, string> = {
  accueil: "accueil",
  contact: "contact",
  catalogue: "realisations",
  sites: "accueil",
  logiciels: "accueil",
  logos: "accueil",
  publicite: "accueil",
  "choix-site": "accueil",
  formulaire: "accueil",
  options: "accueil",
  connexion: "accueil",
  legal: "accueil",
  confidentialite: "accueil",
};

function normalizeLegacyHash() {
  const hash = window.location.hash;
  if (!hash.startsWith("#/")) return;
  const legacy = hash.slice(2).split(/[/?]/, 1)[0];
  const destination = legacySections[legacy] ?? "accueil";
  const canonical = `#${destination}`;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${canonical}`);
  requestAnimationFrame(() => document.getElementById(destination)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

export default function App() {
  useEffect(() => {
    normalizeLegacyHash();
    window.addEventListener("hashchange", normalizeLegacyHash);
    return () => window.removeEventListener("hashchange", normalizeLegacyHash);
  }, []);

  return (
    <div className="spec">
      <GlobalCursor />
      <Header />
      <main>
        <Home />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
