import { useState, useEffect } from "react";
import { plans, options, money } from "./catalog";
import { Heading, Action, Arrow } from "./ui";
type Draft = {
  plan: string;
  options: string[];
  company: string;
  network: string;
};
let preparedDraft: Draft | null = null;
const empty: Draft = { plan: "landing", options: [], company: "", network: "" };
function readDraft(): Draft {
  try {
    const d = JSON.parse(
      localStorage.getItem("forma-configuration-v1") || "null",
    );
    return d && plans.some((p) => p.id === d.plan) && Array.isArray(d.options)
      ? {plan:d.plan, options:d.options.filter((id:unknown)=>options.some(o=>o.id===id)),company:typeof d.company==='string'?d.company.slice(0,100):'',network:typeof d.network==='string'?d.network.slice(0,250):''}
      : {...empty};
  } catch {
    return empty;
  }
}
export function Configurator() {
  const [draft, setDraft] = useState<Draft>(() => ({
    ...(preparedDraft || readDraft()),
    ...(new URLSearchParams(location.hash.split("?")[1]).get("offre")
      ? { plan: new URLSearchParams(location.hash.split("?")[1]).get("offre")! }
      : {}),
  }));
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const plan = plans.find((p) => p.id === draft.plan) || plans[0];
  useEffect(() => {
    preparedDraft = draft;
  }, [draft]);
  const questions = [
    "Quel format pour votre projet ?",
    "Comment s’appelle votre entreprise ?",
    "Un réseau ou un site à partager ?",
    "Quels besoins complémentaires ?",
  ];
  function next() {
    if (step === 1 && !draft.company.trim()) {
      setError("Indiquez le nom de votre entreprise ou de votre projet.");
      return;
    }
    setError("");
    setStep(step + 1);
  }
  function save() {
    try {
      localStorage.setItem("forma-configuration-v1", JSON.stringify(draft));
      setSaved(true);
    } catch {
      setError(
        "Le navigateur ne permet pas l’enregistrement local. Vous pouvez télécharger le récapitulatif.",
      );
    }
  }
  return (
    <>
      <Heading
        num="05 / CONFIGURATION"
        title="Votre projet prend forme."
        text="Quelques questions, un périmètre clair. Votre estimation évolue avec vos choix."
      />
      <div className="config-layout">
        <section className="f-form">
          <div className="f-spine" aria-hidden="true" />
          <p className="eyebrow">
            {step < 4 ? `ÉTAPE ${step + 1} / 4` : "VOTRE RÉCAPITULATIF"}
          </p>
          <div className="past-answers">
            {questions.slice(0, Math.min(step, 4)).map((q, i) => (
              <button key={q} onClick={() => setStep(i)}>
                <span>0{i + 1}</span>
                {i === 0
                  ? plan.name
                  : i === 1
                    ? draft.company
                    : i === 2
                      ? draft.network || "Aucun lien renseigné"
                      : `${draft.options.length} besoin(s)`}
                <span>
                  Modifier <Arrow />
                </span>
              </button>
            ))}
          </div>
          {step < 4 ? (
            <div className="question" key={step}>
              <h2>{questions[step]}</h2>
              {step === 0 ? (
                <div className="choice-grid">
                  {plans.map((p) => (
                    <button
                      aria-pressed={draft.plan === p.id}
                      key={p.id}
                      onClick={() => setDraft({ ...draft, plan: p.id })}
                    >
                      {p.name}
                      <small>{money(p.price)}</small>
                    </button>
                  ))}
                </div>
              ) : step === 1 ? (
                <label>
                  Nom du projet
                  <input
                    autoFocus
                    value={draft.company}
                    maxLength={100}
                    onChange={(e) =>
                      setDraft({ ...draft, company: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") next();
                    }}
                    placeholder="Votre entreprise ou votre idée"
                  />
                </label>
              ) : step === 2 ? (
                <label>
                  Lien public, facultatif
                  <input
                    autoFocus
                    value={draft.network}
                    maxLength={250}
                    onChange={(e) =>
                      setDraft({ ...draft, network: e.target.value })
                    }
                    placeholder="Votre site ou votre profil"
                  />
                </label>
              ) : (
                <div className="option-list">
                  {options.map((o) => (
                    <label key={o.id}>
                      <input
                        type="checkbox"
                        checked={draft.options.includes(o.id)}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            options: e.target.checked
                              ? [...draft.options, o.id]
                              : draft.options.filter((x) => x !== o.id),
                          })
                        }
                      />
                      <span>
                        <strong>{o.name}</strong>
                        <small>{o.text}</small>
                        <em>Sur devis</em>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <button className="action" onClick={next}>
                Valider et continuer <Arrow direction="right" />
              </button>
            </div>
          ) : (
            <div className="question">
              <h2>La première forme de votre projet.</h2>
              <p>
                Vérifiez vos choix, puis préparez votre demande. Aucun achat ni
                envoi ne sera effectué ici.
              </p>
              <button className="action" onClick={save}>
                Conserver ma configuration <Arrow direction="down" />
              </button>
              {saved && (
                <p role="status">
                  Configuration enregistrée sur cet appareil.{" "}
                  <button
                    className="inline"
                    onClick={() => {
                      localStorage.removeItem("forma-configuration-v1");
                      setSaved(false);
                    }}
                  >
                    Effacer
                  </button>
                </p>
              )}
              <button
                className="text-link"
                onClick={() => download("projet-forma.txt", summary(draft))}
              >
                Télécharger le récapitulatif <Arrow direction="down" />
              </button>
              <Action to={`contact?offre=${draft.plan}`}>
                Préparer ma demande de devis
              </Action>
            </div>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </section>
        <aside className="estimate">
          <p className="eyebrow">VOTRE PROJET / EN DIRECT</p>
          <h2>{plan.name}</h2>
          <p>{plan.pages}</p>
          <div className="price" key={plan.price}>
            <small>Base estimative</small>
            {money(plan.price)}
          </div>
          <ul>
            {draft.options.map((id) => (
              <li key={id}>
                {options.find((o) => o.id === id)?.name}{" "}
                <small>Sur devis</small>
              </li>
            ))}
          </ul>
          <p className="muted">
            {draft.options.length
              ? "Total final sur devis : les options ne sont pas encore chiffrées."
              : "Le montant définitif sera confirmé après étude du périmètre."}
          </p>
          <p className="muted">
            La sauvegarde est facultative et reste sur cet appareil.
          </p>
        </aside>
      </div>
    </>
  );
}
function summary(d: Draft) {
  return `FORMA — projet\nFormule : ${plans.find((p) => p.id === d.plan)?.name}\nBase : ${money(plans.find((p) => p.id === d.plan)?.price ?? null)}\nProjet : ${d.company}\nLien : ${d.network}\nOptions sur devis : ${d.options.map((id) => options.find((o) => o.id === id)?.name).join(", ")}\nEstimation non contractuelle. Aucun envoi effectué.`;
}
function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Contact() {
  const [stage, setStage] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    type: new URLSearchParams(location.hash.split("?")[1]).get("offre")
      ? "Sites web"
      : "Sites web",
    budget: "À définir",
    message: "",
    consent: false,
  });
  return (
    <>
      <Heading
        num="06 / CONTACT"
        title="Tout commence par une idée."
        text="Parlez-nous de votre projet. Préparez une demande structurée, à relire avant de la transmettre."
      />
      <div className="contact-layout">
        <div>
          <h2>
            De l’intention
            <br />à la réalisation.
          </h2>
          <p>
            Un besoin, une ambition, une question : posons les premières bases
            ensemble.
          </p>
          <p className="notice">
            La transmission des demandes n’est pas encore connectée. Vous pouvez
            préparer et télécharger votre demande ; rien ne sera envoyé.
          </p>
        </div>
        {stage ? (
          <section className="review" aria-live="polite">
            <p className="eyebrow">DEMANDE PRÉPARÉE / NON ENVOYÉE</p>
            <h2>Relisons votre projet.</h2>
            <dl>
              {[
                ["Nom", data.name],
                ["Email", data.email],
                ["Prestation", data.type],
                ["Budget", data.budget],
                ["Votre besoin", data.message],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt>{a}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
            <button
              className="action"
              onClick={() =>
                download(
                  "demande-forma.txt",
                  Object.entries(data)
                    .filter(([k]) => k !== "consent")
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("\n") +
                    "\n\nDEMANDE NON ENVOYÉE\n" +
                    summary(preparedDraft || readDraft()),
                )
              }
            >
              Télécharger ma demande <Arrow direction="down" />
            </button>
            <button className="text-link" onClick={() => setStage(false)}>
              <Arrow direction="left" /> Modifier
            </button>
          </section>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!data.message.trim()) {
                setError("Décrivez votre besoin pour préparer la demande.");
                return;
              }
              setError("");
              setStage(true);
            }}
          >
            <label>
              Votre nom
              <input
                required
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </label>
            <label>
              Votre adresse email
              <input
                required
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </label>
            <div className="two-cols">
              <label>
                Votre prestation
                <select
                  value={data.type}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                >
                  {[
                    "Sites web",
                    "Logiciels & applications",
                    "Logos & identités",
                    "Réseaux & publicité",
                    "Autre projet",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Budget indicatif
                <select
                  value={data.budget}
                  onChange={(e) => setData({ ...data, budget: e.target.value })}
                >
                  {[
                    "À définir",
                    "Moins de 1 000 €",
                    "1 000 à 2 500 €",
                    "2 500 à 5 000 €",
                    "Plus de 5 000 €",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Votre projet
              <textarea
                required
                rows={5}
                value={data.message}
                maxLength={5000}
                onChange={(e) => setData({ ...data, message: e.target.value })}
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                required
                checked={data.consent}
                onChange={(e) =>
                  setData({ ...data, consent: e.target.checked })
                }
              />
              J’ai compris que cette demande sera préparée sans être envoyée.
            </label>
            {error && <p role="alert">{error}</p>}
            <button className="action">
              Relire ma demande <Arrow direction="right" />
            </button>
            <small>
              Vos coordonnées restent dans cette page, sans sauvegarde locale.
            </small>
          </form>
        )}
      </div>
    </>
  );
}
