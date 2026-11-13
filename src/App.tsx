import { useEffect, useRef, useState } from "react";
import { Header, Footer } from "./client-spec/Chrome";
import { Catalogue, ProductPage, SiteChoice } from "./client-spec/Catalogue";
import { ProjectProvider } from "./client-spec/ProjectState";
import { FForm } from "./client-spec/FForm";
import { Options } from "./client-spec/Options";
import { Login } from "./client-spec/Login";
import { Contact, Legal } from "./client-spec/Contact";
import { Home } from "./client-spec/Home";
import "./client-spec/spec.css";
const routes = [
  "accueil",
  "catalogue",
  "sites",
  "logiciels",
  "logos",
  "identite",
  "choix-site",
  "formulaire",
  "options",
  "connexion",
  "contact",
  "legal",
  "confidentialite",
];
export default function App() {
  const [hash, setHash] = useState(location.hash);
  const main = useRef<HTMLElement>(null);
  const requested = hash.replace(/^#\//, "").split("?")[0];
  const route = routes.includes(requested) ? requested : "accueil";
  useEffect(() => {
    const change = () => {
      setHash(location.hash);
      scrollTo(0, 0);
      requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  if (new URLSearchParams(location.search).get("reference") === "original")
    return (
      <div className="spec-reference">
        <iframe src="/archive/index.html" title="Référence FORMA originale" />
      </div>
    );
  return (
    <ProjectProvider>
      <div className="spec">
        <Header route={route} />
        <main ref={main} tabIndex={-1}>
          {route === "accueil" ? (
            <Home />
          ) : route === "catalogue" ? (
            <Catalogue />
          ) : ["sites", "logiciels", "logos", "identite"].includes(route) ? (
            <ProductPage id={route} />
          ) : route === "choix-site" ? (
            <SiteChoice />
          ) : route === "formulaire" ? (
            <FForm />
          ) : route === "options" ? (
            <Options />
          ) : route === "connexion" ? (
            <Login />
          ) : route === "contact" ? (
            <Contact />
          ) : route === "legal" ? (
            <Legal />
          ) : (
            <Legal privacy />
          )}
        </main>
        <Footer />
      </div>
    </ProjectProvider>
  );
}
