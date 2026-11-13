import { useEffect, useRef, useState } from "react";
import { useProject } from "./ProjectState";
export const optionGroups = [
  {
    id: "contenu",
    name: "Contenu et navigation",
    items: [
      ["blog", "Blog et actualités"],
      ["galerie", "Galerie de photos"],
      ["recherche", "Recherche sur le site"],
      ["documents", "Documents à télécharger"],
    ],
  },
  {
    id: "contact",
    name: "Contact et relation client",
    items: [
      ["formulaire", "Formulaire de contact"],
      ["carte", "Carte et itinéraire"],
      ["newsletter", "Inscription à une newsletter"],
      ["chat", "Messagerie en ligne"],
    ],
  },
  {
    id: "commerce",
    name: "Vente et réservation",
    items: [
      ["catalogue", "Catalogue de produits"],
      ["panier", "Panier et commande"],
      ["paiement", "Paiement en ligne"],
      ["reservation", "Prise de rendez-vous"],
    ],
  },
  {
    id: "visibilite",
    name: "Visibilité et langues",
    items: [
      ["seo", "Référencement naturel"],
      ["langues", "Version multilingue"],
      ["partage", "Partage sur les réseaux sociaux"],
      ["statistiques", "Statistiques de fréquentation"],
    ],
  },
  {
    id: "gestion",
    name: "Gestion et intégrations",
    items: [
      ["administration", "Gestion des contenus"],
      ["comptes", "Comptes utilisateurs"],
      ["crm", "Connexion à un CRM"],
      ["api", "Connexion à un service externe"],
    ],
  },
];
function OptionSection({ group }: { group: (typeof optionGroups)[number] }) {
  const { project, setProject } = useProject();
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    let raf = 0;
    let last = false;
    function update() {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, -rect.top / (el.offsetHeight - innerHeight)),
      );
      const reveal = media.matches
        ? 1
        : Math.max(0, Math.min(1, p / 0.24, (1 - p) / 0.24));
      el.style.setProperty("--open", String(reveal));
      const next = reveal > 0.8;
      if (next !== last) {
        last = next;
        setOpen(next);
      }
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    update();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      media.removeEventListener("change", sync);
    };
  }, []);
  function reveal() {
    const el = section.current;
    if (!el) return;
    const top =
      el.getBoundingClientRect().top +
      scrollY +
      (el.offsetHeight - innerHeight) * 0.48;
    scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  }
  return (
    <section
      className={`spec-option-sequence ${reduced ? "is-reduced" : ""}`}
      ref={section}
      aria-labelledby={`group-${group.id}`}
    >
      <div className="spec-options-sticky">
        <h2 id={`group-${group.id}`}>
          <button
            onClick={reveal}
            aria-expanded={open || reduced}
            aria-controls={`options-${group.id}`}
          >
            {group.name}
          </button>
        </h2>
        <div className="spec-option-machine">
          <div className="spec-option-bar bar-top" aria-hidden="true" />
          <div
            className="spec-option-content"
            id={`options-${group.id}`}
            inert={!open && !reduced}
          >
            <div className="spec-option-grid">
              {group.items.map(([id, name]) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={project.options.includes(id)}
                    onChange={(e) =>
                      setProject((p) => ({
                        ...p,
                        options: e.target.checked
                          ? [...p.options, id]
                          : p.options.filter((v) => v !== id),
                      }))
                    }
                  />
                  <span>
                    {name}
                    <small>Sur devis</small>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="spec-option-bar bar-bottom" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
export function Options() {
  return (
    <>
      <section className="spec-page spec-options-title">
        <h1>
          Choisissez la ou les fonctionnalité(s) et option(s) de votre site.
        </h1>
      </section>
      {optionGroups.map((g) => (
        <OptionSection key={g.id} group={g} />
      ))}
    </>
  );
}
