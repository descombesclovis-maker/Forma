import { useState, type FormEvent } from "react";

const endpoint = import.meta.env.VITE_FORMA_CONTACT_ENDPOINT?.trim();

type Feedback = { kind: "success" | "error" | "info"; message: string } | null;

export function Contact() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!endpoint) {
      setFeedback({ kind: "info", message: "Le service sécurisé de contact n’est pas encore configuré. Votre message n’a pas été envoyé." });
      return;
    }
    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) {
      setFeedback({ kind: "info", message: "Votre message n’a pas été transmis." });
      return;
    }
    setSending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "omit",
        signal: controller.signal,
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), subject: data.get("subject"), message: data.get("message") }),
      });
      if (!response.ok) throw new Error("Contact request rejected");
      setFeedback({ kind: "success", message: "Votre message a bien été envoyé. FORMA reviendra vers vous dès que possible." });
      form.reset();
    } catch {
      setFeedback({ kind: "error", message: "L’envoi a échoué. Votre message n’a pas été transmis. Réessayez plus tard." });
    } finally {
      window.clearTimeout(timeout);
      setSending(false);
    }
  }

  const query = new URLSearchParams(window.location.search);
  const estimateSummary = query.get("estimate")?.slice(0, 4000) ?? "";
  const initialSubject = query.get("service")?.slice(0, 180) ?? "";

  return <section className="contact-section" id="contact" aria-labelledby="contact-title">
    <div className="contact-shell">
      <div className="contact-copy">
        <p className="section-eyebrow">À vous de jouer</p>
        <h2 id="contact-title">Donnons forme à votre projet.</h2>
        <p>Vous avez une idée, un projet ou simplement une question ? Échangeons sur vos besoins et imaginons ensemble la meilleure solution.</p>
        <span className="contact-index" aria-hidden="true">FORMA — CONTACT / 03</span>
      </div>
      <form className="contact-form" onSubmit={submit} noValidate>
        <div className="contact-field"><label htmlFor="contact-name">Nom</label><input id="contact-name" name="name" autoComplete="name" maxLength={120} required /></div>
        <div className="contact-field"><label htmlFor="contact-email">Adresse e-mail</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
        <div className="contact-field"><label htmlFor="contact-subject">Sujet</label><input id="contact-subject" name="subject" maxLength={180} defaultValue={initialSubject} required /></div>
        <div className="contact-field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows={5} maxLength={5000} defaultValue={estimateSummary ? `Bonjour, je souhaite discuter de cette estimation :\n\n${estimateSummary}` : ""} required /></div>
        <label className="contact-honeypot" aria-hidden="true">Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <button className="contact-submit" type="submit" disabled={sending}>{sending ? "Envoi en cours…" : "Envoyer mon message"}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button>
        {feedback && <p className={`contact-feedback contact-feedback--${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"}>{feedback.message}</p>}
        {!endpoint && <p className="contact-setup-note">L’envoi n’est pas encore activé; ce formulaire ne transmet pas les données.</p>}
      </form>
    </div>
  </section>;
}
