import { useState } from "react";
import { Arrow } from "./Chrome";
export function Contact() {
  const [status, setStatus] = useState("");
  return (
    <section className="spec-page spec-contact">
      <h1>Contact</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStatus(
            "Le service d’envoi n’est pas encore connecté. Votre message n’a pas été envoyé.",
          );
        }}
      >
        <label htmlFor="contact-name">Nom</label>
        <input id="contact-name" name="name" required autoComplete="name" />
        <label htmlFor="contact-email">Adresse email</label>
        <input
          id="contact-email"
          name="email"
          required
          type="email"
          autoComplete="email"
        />
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={5000}
        />
        <button className="spec-button">
          Envoyer <Arrow />
        </button>
        <p className="spec-connection-note">
          Le service d’envoi n’est pas encore connecté.
        </p>
        {status && (
          <p className="spec-feedback" role="alert">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
export function Legal({ privacy = false }: { privacy?: boolean }) {
  return (
    <section className="spec-page spec-legal">
      <h1>{privacy ? "Politique de confidentialité" : "Termes légaux"}</h1>
      <p>Contenu provisoire à valider avant ouverture commerciale.</p>
      <p>
        {privacy
          ? "Les informations du projet et les photos sont conservées uniquement en mémoire pendant la navigation. Elles ne sont pas transmises ni enregistrées sur un serveur. Le rechargement de la page les efface. Les champs de connexion et de contact ne sont pas transmis. Les polices historiques sont chargées depuis Google Fonts. La politique complète reste à valider avec les services retenus."
          : "L’identité juridique de l’éditeur, ses coordonnées, les mentions d’hébergement et les conditions applicables doivent être fournies et validées par FORMA."}
      </p>
    </section>
  );
}
