import { useState, useRef, type FormEvent } from "react";
import { Arrow } from "./Chrome";

const endpoint = import.meta.env.VITE_FORMA_CONTACT_ENDPOINT?.trim();
type Feedback = { kind: "success" | "error" | "info"; message: string } | null;
const phone = import.meta.env.VITE_FORMA_PHONE?.trim();
type MessagePayload = { kind: "contact" | "quote" | "quick"; name: string; email: string; subject: string; message: string };

const faq = [
  { question: "Quel budget prévoir ?", answer: "Vous pouvez obtenir un premier ordre d'idée dans notre estimateur. Le prix définitif dépend du périmètre validé ensemble.", href: "/tarification", cta: "Explorer les estimations" },
  { question: "Quels services proposez-vous ?", answer: "Sites web, applications, identités graphiques, publicités et solutions numériques : chaque projet est étudié selon vos besoins.", href: "/nos-services", cta: "Découvrir nos services" },
  { question: "Quels sont vos délais ?", answer: "Le délai dépend de la complexité et de vos contenus. Nous confirmons un calendrier réaliste avant tout engagement.", href: "/comment-ca-marche", cta: "Comprendre notre méthode" },
  { question: "Comment recevoir une réponse ?", answer: "Décrivez votre question dans le formulaire ou dans la messagerie ci-dessous. Une adresse e-mail est nécessaire pour pouvoir vous répondre.", href: "#fiche-contact", cta: "Accéder au formulaire" },
];

class ContactError extends Error {}

function failureFeedback(error: unknown, quick = false): NonNullable<Feedback> {
  if (!endpoint) return { kind: "info", message: quick ? "La messagerie n'est pas encore connectée : votre question n'a pas été envoyée." : "L'envoi n'est pas encore configuré. Aucun message n'a été transmis." };
  return { kind: "error", message: error instanceof ContactError ? error.message :
    "Enregistrement non confirmé. Vérifiez votre connexion puis réessayez avec les mêmes informations." };
}

async function deliver(payload: MessagePayload, submission: string): Promise<string> {
  if (!endpoint) throw new Error("not-configured");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      signal: controller.signal,
      body: JSON.stringify({ ...payload, submission, consent: true }),
    });
    if (response.status === 401 || response.status === 403)
      throw new ContactError("Enregistrement non confirmé. Vérifiez votre accès à cette version de Forma puis réessayez.");
    if (response.status === 400 || response.status === 413)
      throw new ContactError("Vérifiez les champs obligatoires, l’adresse e-mail et la longueur du message.");
    if (response.status === 429) throw new ContactError("Trop de demandes. Réessayez dans une heure.");
    if (response.status >= 500) throw new ContactError("Enregistrement non confirmé. Le service est temporairement indisponible. Réessayez avec les mêmes informations.");
    if (!response.ok) throw new Error();
    const receipt = await response.json();
    if (receipt.recorded !== true || typeof receipt.reference !== "string" ||
        !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(receipt.reference)) throw new Error();
    return receipt.reference;
  } finally { window.clearTimeout(timeout); }
}

export function Contact() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [quickSending, setQuickSending] = useState(false);
  const [quickFeedback, setQuickFeedback] = useState<Feedback>(null);
  const [faqChoice, setFaqChoice] = useState<number | null>(null);
  const query = new URLSearchParams(window.location.search);
  const estimateSummary = query.get("estimate")?.slice(0, 4000) ?? "";
  const initialSubject = query.get("service")?.slice(0, 180) ?? "";

  const [kind, setKind] = useState<"contact" | "quote">(estimateSummary || location.pathname === "/devis" || query.get("type") === "devis" ? "quote" : "contact");
  const attempts = useRef(new Map<string, { body: string; key: string }>());
  async function transmit(payload: MessagePayload) {
    const body = JSON.stringify(payload);
    const previous = attempts.current.get(payload.kind);
    const key = previous?.body === body ? previous.key : crypto.randomUUID();
    attempts.current.set(payload.kind, { body, key });
    const reference = await deliver(payload, key);
    attempts.current.delete(payload.kind);
    return reference;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) return;
    setSending(true);
    const details = [["company", "Entreprise"], ["phone", "Téléphone"], ["service", "Prestation"], ["budget", "Budget envisagé"]]
      .filter(([key]) => String(data.get(key) ?? "").trim())
      .map(([key,label]) => label + " : " + String(data.get(key)).trim()).join("\n");
    const payload: MessagePayload = {
      kind,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: `${String(data.get("message") ?? "").trim()}${details ? "\n\n" + details : ""}`,
    };
    try {
      const reference = await transmit(payload);
      setFeedback({ kind: "success", message: `Votre demande a été enregistrée. Référence : ${reference}.` });
      form.reset();
    } catch (error) {
      setFeedback(failureFeedback(error));
    } finally { setSending(false); }
  }

  async function quickSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuickFeedback(null);
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) return;
    setQuickSending(true);
    try {
      const reference = await transmit({
        kind: "quick",
        name: "",
        email: String(data.get("quickEmail") ?? "").trim(),
        subject: "Question rapide depuis FORMA",
        message: String(data.get("quickQuestion") ?? "").trim(),
      });
      setQuickFeedback({ kind: "success", message: `Votre question a été enregistrée. Référence : ${reference}.` });
      form.reset();
    } catch (error) {
      setQuickFeedback(failureFeedback(error, true));
    } finally { setQuickSending(false); }
  }

  return <div className="contact-page">
    <header className="contact-page-hero">
      <p className="section-eyebrow">FORMA / ÉCHANGEONS</p>
      <h1>Parlons de votre projet<span className="contact-page-dot">.</span></h1>
      <p>Un projet précis, une idée encore en construction ou une simple question : écrivez-nous. Pas besoin d'appeler pour obtenir une première information.</p>
      {phone && <p>Téléphone professionnel : <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`}>{phone}</a></p>}
      <span className="contact-hero-index">UN MESSAGE SUFFIT POUR COMMENCER — 01/02</span>
    </header>
    <section className="contact-page-main" aria-label="Vos moyens de contact">
      <div className="contact-page-form-panel" id="fiche-contact">
        <div className="contact-block-heading"><span>01 / CONTACT</span><h2>Votre demande.</h2><p>Nous vous répondrons par e-mail. Les champs marqués * sont obligatoires.</p></div>
        <form className="contact-form contact-form--full" onSubmit={submit}>
          <div className="contact-field"><label htmlFor="request-kind">Type de demande</label><select id="request-kind" value={kind} onChange={e => setKind(e.target.value === "quote" ? "quote" : "contact")}><option value="contact">Renseignements</option><option value="quote">Devis gratuit</option></select></div>
          <div className="contact-field-grid">
            <div className="contact-field"><label htmlFor="contact-name">Prénom *</label><input id="contact-name" name="name" autoComplete="given-name" maxLength={120} required /></div>
            <div className="contact-field"><label htmlFor="contact-email">E-mail *</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
          </div>
          <div className="contact-field-grid">
            <div className="contact-field"><label htmlFor="contact-company">Entreprise / activité</label><input id="contact-company" name="company" autoComplete="organization" maxLength={150} /></div>
            <div className="contact-field"><label htmlFor="contact-phone">Téléphone (facultatif)</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={35} /></div>
          </div>
          <div className="contact-field-grid">
            <div className="contact-field"><label htmlFor="contact-service">Votre besoin</label><select id="contact-service" name="service" defaultValue={initialSubject.includes("Estimation") ? "" : initialSubject}>
              <option value="">Je souhaite être conseillé</option>
              <option value="Site web">Site web</option><option value="Application">Application</option><option value="Logo et identité visuelle">Logo et identité visuelle</option><option value="Publicité">Publicité</option><option value="Solution numérique">Solution numérique</option>
              {initialSubject && !["Site web", "Application", "Logo et identité visuelle", "Publicité", "Solution numérique"].includes(initialSubject) && <option value={initialSubject}>{initialSubject}</option>}
            </select></div>
            <div className="contact-field"><label htmlFor="contact-budget">Budget indicatif</label><select id="contact-budget" name="budget" defaultValue=""><option value="">À définir ensemble</option><option value="Moins de 500 €">Moins de 500 €</option><option value="500 à 1 500 €">500 à 1 500 €</option><option value="1 500 à 3 000 €">1 500 à 3 000 €</option><option value="Plus de 3 000 €">Plus de 3 000 €</option></select></div>
          </div>
          <div className="contact-field"><label htmlFor="contact-subject">Objet de votre message *</label><input id="contact-subject" name="subject" maxLength={180} defaultValue={initialSubject} placeholder="Parlons de votre idée…" required /></div>
          <div className="contact-field"><label htmlFor="contact-message">Présentez votre demande *</label><textarea id="contact-message" name="message" rows={6} maxLength={5000} placeholder="Votre idée, votre objectif, vos questions…" defaultValue={estimateSummary ? `Bonjour, je souhaite discuter de cette estimation :\n\n${estimateSummary}` : ""} required /></div>
          <label className="contact-consent"><input type="checkbox" required /><span>J'ai pris connaissance de la <a href="/politique-confidentialite" target="_blank" rel="noreferrer">politique de confidentialité</a> et j'accepte que les informations transmises soient utilisées pour répondre à ma demande. *</span></label>
          <label className="contact-honeypot" aria-hidden="true">Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <button className="contact-submit" type="submit" disabled={sending}>{sending ? "Envoi en cours…" : "Envoyer ma demande"}<Arrow /></button>
          {feedback && <p className={`contact-feedback contact-feedback--${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"}>{feedback.message}</p>}
          {!endpoint && <p className="contact-setup-note">Formulaire prêt pour un service d'envoi sécurisé. Envoi désactivé tant que celui-ci n'est pas configuré.</p>}
        </form>
      </div>
      <aside className="contact-quick" aria-labelledby="quick-title">
        <div className="contact-block-heading"><span>02 / QUESTION RAPIDE</span><h2 id="quick-title">Une question ?</h2><p>Consultez une réponse immédiate ou laissez une question courte.</p></div>
        <div className="quick-chat" role="region" aria-label="Messagerie et réponses rapides">
          <div className="quick-chat-head"><i aria-hidden="true" /><div><strong>FORMA / Réponses rapides</strong><small>Aucune conversation en direct simulée</small></div></div>
          <div className="quick-chat-bubble quick-chat-bubble--incoming">Bonjour ! Sur quel sujet souhaitez-vous en savoir plus ?</div>
          <div className="quick-chat-choices">
            {faq.map((item, index) => <button type="button" key={item.question} className={faqChoice === index ? "is-selected" : ""} onClick={() => setFaqChoice(index)}>{item.question}</button>)}
          </div>
          {faqChoice !== null && <div className="quick-chat-answer" aria-live="polite"><p>{faq[faqChoice].answer}</p><a href={faq[faqChoice].href}>{faq[faqChoice].cta} <span aria-hidden="true">↗</span></a></div>}
          <form className="quick-chat-form" onSubmit={quickSubmit}>
            <label htmlFor="quick-email">Votre e-mail *</label><input id="quick-email" name="quickEmail" type="email" maxLength={254} autoComplete="email" placeholder="vous@entreprise.fr" required />
            <label htmlFor="quick-question">Votre question *</label><textarea id="quick-question" name="quickQuestion" rows={3} maxLength={1500} placeholder="Posez votre question…" required />
            <label className="contact-consent contact-consent--small"><input type="checkbox" required /><span>J'ai lu la <a href="/politique-confidentialite" target="_blank" rel="noreferrer">politique de confidentialité</a>.</span></label>
            <label className="contact-honeypot" aria-hidden="true">Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <button type="submit" disabled={quickSending}>{quickSending ? "Envoi…" : "Envoyer ma question"}<Arrow /></button>
            {quickFeedback && <p className={`contact-feedback contact-feedback--${quickFeedback.kind}`} role={quickFeedback.kind === "error" ? "alert" : "status"}>{quickFeedback.message}</p>}
            {!endpoint && <p className="contact-setup-note">L'envoi des questions sera disponible après connexion du service de messagerie.</p>}
          </form>
        </div>
      </aside>
    </section>
  </div>;
}
