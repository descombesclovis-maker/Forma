import { useEffect, useRef, useState } from "react";
import { Header, Footer } from "./client-spec/Chrome";
import { ProductPage, SiteChoice } from "./client-spec/Catalogue";
import { ProductCarousel } from "./client-spec/ProductCarousel";
import { ProjectProvider } from "./client-spec/ProjectState";
import { FForm } from "./client-spec/FForm";
import { Options } from "./client-spec/Options";
import { Login } from "./client-spec/Login";
import { Contact, Legal } from "./client-spec/Contact";
import { Home } from "./client-spec/Home";
import { GlobalCursor } from "./client-spec/GlobalCursor";
import "./client-spec/spec.css";
import "./client-spec/prompt4.css";
import "./client-spec/prompt5.css";
const routes = [
  "accueil",
  "catalogue",
  "sites",
  "logiciels",
  "logos",
  "publicite",
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
  return (
    <ProjectProvider>
      <div className="spec">
        <GlobalCursor />
        <Header route={route} />
        <main ref={main} tabIndex={-1}>
          {route === "accueil" ? (
            <Home />
          ) : route === "catalogue" ? (
            <ProductCarousel />
          ) : ["sites", "logiciels", "logos", "publicite"].includes(route) ? (
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
