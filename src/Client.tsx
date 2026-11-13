import { useState } from "react";
import { Heading, Action, Arrow } from "./ui";
export function Client() {
  const [tab, setTab] = useState("Projets");
  const [mode, setMode] = useState("Connexion");
  const [error, setError] = useState("");
  return (
    <>
      <Heading
        num="08 / ESPACE CLIENT"
        title="Votre projet, au même endroit."
        text="Suivi, échanges et documents : découvrez l’organisation de votre futur espace."
      />
      <div className="notice">
        Aperçu d’interface. L’authentification et les données clients ne sont
        pas encore connectées. Aucun compte ne peut être créé ici.
      </div>
      <div className="client-layout">
        <section>
          <div className="filters">
            {["Connexion", "Inscription"].map((m) => (
              <button
                key={m}
                aria-pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(
                "Service non connecté. Aucun accès n’a été ouvert et aucune information n’a été transmise.",
              );
            }}
          >
            <h2>{mode}</h2>
            <label>
              Email
              <input type="email" required autoComplete="email" />
            </label>
            <p className="muted">
              Ne renseignez aucun mot de passe dans cet aperçu.
            </p>
            <button className="action">
              Vérifier la disponibilité <Arrow direction="right" />
            </button>
            {error && <p role="status">{error}</p>}
          </form>
        </section>
        <section className="client-preview">
          <p className="eyebrow">APERÇU / AUCUNE DONNÉE CLIENT</p>
          <div className="filters">
            {[
              "Projets",
              "Commandes",
              "Documents",
              "Demandes",
              "Échanges",
              "Compte",
            ].map((t) => (
              <button
                key={t}
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <h2>{tab}</h2>
          <div className="empty-state">
            <span aria-hidden="true">+</span>
            <h3>
              {tab === "Projets"
                ? "Vos idées trouveront leur place ici."
                : `Votre rubrique ${tab.toLowerCase()} est prête à accueillir vos informations.`}
            </h3>
            <p>
              {tab === "Documents"
                ? "Les devis et factures seront accessibles après connexion au service documentaire."
                : tab === "Échanges"
                  ? "Les conversations seront liées à vos projets après connexion du service."
                  : "Les informations apparaîtront après la connexion sécurisée et la mise en service de votre espace."}
            </p>
            <Action to="contact">Préparer un projet</Action>
          </div>
        </section>
      </div>
    </>
  );
}
