import { useState, useRef, useEffect } from "react";
import { Heading, Action, Arrow } from "./ui";
const demos = [
  {
    id: "atelier",
    name: "Atelier",
    cat: "Sites web",
    text: "Une vitrine éditoriale pour un atelier imaginaire.",
    theme: "sand",
  },
  {
    id: "objet",
    name: "Objet / 01",
    cat: "Sites web",
    text: "Une exploration de catalogue et de fiches produits.",
    theme: "dark",
  },
  {
    id: "signe",
    name: "Signe",
    cat: "Identités",
    text: "Un système de marque géométrique exploratoire.",
    theme: "mint",
  },
  {
    id: "cadence",
    name: "Cadence",
    cat: "Réseaux",
    text: "Une composition animée pour les supports sociaux.",
    theme: "coral",
  },
];
function DemoArt({ name, theme }: { name: string; theme: string }) {
  return (
    <div className={`demo-art ${theme}`}>
      <span>FORMA / ÉTUDE CRÉATIVE</span>
      <strong>{name}</strong>
      <div className="demo-shape">
        <i />
        <i />
        <i />
      </div>
      <small>Démonstration · Marque fictive</small>
    </div>
  );
}
export function Gallery() {
  const [filter, setFilter] = useState("Tout");
  const [selected, setSelected] = useState<(typeof demos)[number] | null>(null);
  const [device, setDevice] = useState("Ordinateur");
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement;
    close.current?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "Tab") {
        const els = Array.from(
          document.querySelectorAll<HTMLElement>('[role="dialog"] button'),
        );
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [selected]);
  return (
    <>
      <Heading
        num="07 / EXPLORATIONS"
        title="Des idées en mouvement."
        text="Des démonstrations pour explorer les possibilités. Les marques et projets présentés ici sont fictifs ; ils ne constituent pas des références clients."
      />
      <div className="filters" aria-label="Filtrer les démonstrations">
        {["Tout", "Sites web", "Identités", "Réseaux"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="demo-grid">
        {demos
          .filter((d) => filter === "Tout" || d.cat === filter)
          .map((d) => (
            <button
              className="demo-card"
              key={d.id}
              onClick={() => {
                setSelected(d);
                setDevice("Ordinateur");
              }}
            >
              <DemoArt name={d.name} theme={d.theme} />
              <div>
                <h2>
                  {d.name} <Arrow />
                </h2>
                <p>{d.cat} · Démonstration</p>
              </div>
            </button>
          ))}
      </div>
      {selected && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            className="premium-demo-modal"
          >
            <div className="modal-top">
              <h2 id="demo-title">{selected.name}</h2>
              <button
                ref={close}
                onClick={() => setSelected(null)}
                aria-label="Fermer la démonstration"
              >
                Fermer ×
              </button>
            </div>
            <div className="filters">
              {["Ordinateur", "Tablette", "Téléphone"].map((d) => (
                <button
                  key={d}
                  aria-pressed={device === d}
                  onClick={() => setDevice(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className={`device-preview device-${device}`}>
              <DemoArt name={selected.name} theme={selected.theme} />
            </div>
            <p>
              {selected.text} Étude visuelle, sans commande ni service connecté.
            </p>
            <Action to="contact">Imaginer mon projet</Action>
          </section>
        </div>
      )}
    </>
  );
}
