import { useEffect, useRef, useState } from "react";
import { families, money, nav, plans } from "./catalog";
import { link, Arrow, Logo, Action, Heading } from "./ui";
import { Archive } from "./Archive";
import { Configurator, Contact } from "./ProjectFlow";
import { Gallery } from "./Gallery";
import { Client } from "./Client";
import "./premium.css";
function Footer() {
  return (
    <footer className="premium-footer">
      <p className="eyebrow">LA SUITE PREND FORME</p>
      <a className="footer-title" href={link("contact")}>
        Parlons de votre projet. <Arrow />
      </a>
      <div className="footer-links">
        {[
          ["apropos", "À propos"],
          ["methode", "Notre méthode"],
          ["faq", "FAQ"],
          ["legal", "Informations légales"],
          ["confidentialite", "Confidentialité"],
          ["conditions", "Conditions générales"],
        ].map(([id, n]) => (
          <a key={id} href={link(id)}>
            {n}
          </a>
        ))}
      </div>
      <small>FORMA · Création digitale</small>
    </footer>
  );
}
function Plans() {
  return (
    <>
      <Heading
        num="01 / SITES WEB"
        title="Une présence. Une différence."
        text="Six points de départ. Une même attention portée à la forme, au contenu et à vos visiteurs."
      />
      <div className="plan-grid">
        {plans.map((p, i) => (
          <article className="plan" key={p.id}>
            <div className="plan-top">
              <span>0{i + 1}</span>
              <span>{p.pages}</span>
            </div>
            <div className={`plan-art art-${i}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <h2>{p.name}</h2>
            <p>{p.text}</p>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="price">
              <small>
                {p.price === null ? "Étude personnalisée" : "À partir de"}
              </small>
              {money(p.price)}
            </p>
            <Action to={`configurer?offre=${p.id}`}>
              Configurer cette offre
            </Action>
            <a className="text-link" href={link(`contact?offre=${p.id}`)}>
              Demander un devis <Arrow />
            </a>
            <a className="text-link" href={link("realisations")}>
              Voir les démonstrations <Arrow />
            </a>
          </article>
        ))}
      </div>
      <p className="muted">
        Prix de départ issus du catalogue FORMA. Options, hébergement,
        abonnements et périmètre final à préciser dans le devis. Conditions
        fiscales à confirmer.
      </p>
      <Comparison />
    </>
  );
}
function Comparison() {
  return (
    <section className="section">
      <p className="eyebrow">CHOISIR AVEC CLARTÉ</p>
      <h2>Chaque projet a sa mesure.</h2>
      <div className="table-scroll">
        <table>
          <caption>Comparaison des formules de sites web</caption>
          <thead>
            <tr>
              <th>Formule</th>
              <th>Périmètre</th>
              <th>Point de départ</th>
              <th>Spécificité</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.id}>
                <th>
                  <a href={link(`configurer?offre=${p.id}`)}>
                    {p.name} <Arrow />
                  </a>
                </th>
                <td>{p.pages}</td>
                <td>{money(p.price)}</td>
                <td>{p.features[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function Family({ id }: { id: string }) {
  const f = families.find((f) => f.id === id)!;
  return (
    <>
      <Heading
        num={`${f.num} / ${f.name.toUpperCase()}`}
        title={f.line}
        text={f.text}
      />
      <div className="service-grid">
        {f.items.map((item, i) => (
          <article className="service-card" key={item}>
            <div className={`service-art art-${i}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <p className="eyebrow">
              0{i + 1} /{" "}
              {id === "logiciels" ? "ÉCOSYSTÈME LOCALAI" : "CRÉATION FORMA"}
            </p>
            <h2>{item}</h2>
            <p>
              {id === "logiciels"
                ? "Présentation en préparation. Capacités, licences, compatibilités et disponibilité restent à confirmer avant toute proposition commerciale."
                : id === "identites"
                  ? "Une création pensée pour votre activité, votre singularité et les supports de votre marque. Le périmètre sera défini dans votre devis."
                  : "Format, message, déclinaisons : une proposition adaptée à vos supports et à vos objectifs."}
            </p>
            <details>
              <summary>
                {id === "logiciels"
                  ? "Disponibilité & démonstration"
                  : "Ce que nous définirons ensemble"}
              </summary>
              <p>
                {id === "logiciels"
                  ? "Aucune fonction ni licence n’est annoncée comme disponible à ce stade. Contactez FORMA pour préciser votre besoin."
                  : "Brief, livrables, formats, étapes de validation et conditions d’utilisation seront précisés avant la réalisation."}
              </p>
            </details>
            <Action to={`contact?prestation=${id}`}>
              {id === "logiciels"
                ? "Parler de mon besoin"
                : "Demander un devis"}
            </Action>
          </article>
        ))}
      </div>
      {id !== "logiciels" && (
        <Action to="realisations">Explorer les démonstrations</Action>
      )}
    </>
  );
}
const faqs = [
  [
    "Comment choisir ma formule ?",
    "Le nombre de pages et les usages constituent un premier repère. Utilisez le comparateur, puis décrivez vos besoins dans le configurateur. Le devis fixera le périmètre.",
  ],
  [
    "Le prix affiché est-il définitif ?",
    "Il s’agit d’un prix de départ. Les options, abonnements éventuels et besoins spécifiques seront précisés dans le devis.",
  ],
  [
    "Puis-je commander directement ?",
    "Les parcours de configuration et de préparation de demande sont accessibles. La transmission et le paiement ne sont pas encore connectés. Aucun achat n’est réalisé.",
  ],
  [
    "Les projets montrés sont-ils des réalisations clients ?",
    "Les nouvelles explorations sont clairement identifiées comme démonstrations de marques fictives.",
  ],
  [
    "Que devient ma configuration ?",
    "Vous pouvez choisir de la conserver localement sur votre appareil, puis l’effacer ou la télécharger. Vos coordonnées de contact ne sont pas conservées localement.",
  ],
];
function Editorial({ page }: { page: string }) {
  if (page === "faq")
    return (
      <>
        <Heading
          num="09 / QUESTIONS"
          title="Les choses, simplement."
          text="Les réponses utiles avant de donner forme à votre projet."
        />
        <div className="faq">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <Action to="contact">Une autre question ?</Action>
      </>
    );
  if (["legal", "confidentialite", "conditions"].includes(page))
    return (
      <>
        <Heading
          num="INFORMATIONS"
          title={
            page === "legal"
              ? "Informations légales"
              : page === "conditions"
                ? "Conditions générales"
                : "Confidentialité"
          }
          text="Contenu provisoire — validation nécessaire avant l’ouverture commerciale."
        />
        <section className="reading">
          <h2>
            {page === "legal"
              ? "Identité de l’éditeur à compléter"
              : page === "conditions"
                ? "Conditions commerciales à valider"
                : "Traitement des données à préciser"}
          </h2>
          <p>
            {page === "legal"
              ? "Raison sociale, adresse, coordonnées, immatriculation, responsable de publication et mentions d’hébergement doivent être fournis et validés par FORMA."
              : page === "conditions"
                ? "Les modalités de commande, de paiement, de livraison, de révision, les droits d’utilisation et les règles applicables doivent être définis avant toute vente."
                : "Cette interface prépare vos demandes sans les transmettre. La sauvegarde facultative du configurateur utilise le stockage local de votre navigateur. Aucun outil de mesure d’audience ni paiement n’a été ajouté pendant cette mission."}
          </p>
          {page === "confidentialite" && (
            <button
              className="action"
              onClick={(e) => {
                localStorage.removeItem("forma-configuration-v1");
                e.currentTarget.textContent = "Configuration locale effacée";
              }}
            >
              Effacer ma configuration locale
            </button>
          )}
          <p>
            Les ressources historiques chargent les polices Google Fonts. La
            politique complète et les éventuels besoins de consentement devront
            être vérifiés avec les services finalement retenus.
          </p>
        </section>
      </>
    );
  return (
    <>
      <Heading
        num={page === "methode" ? "LA MÉTHODE" : "À PROPOS"}
        title={
          page === "methode"
            ? "De l’idée à sa forme."
            : "La forme suit votre ambition."
        }
        text="Sites web, identités, applications et contenus : une approche cohérente pour construire votre présence digitale."
      />
      <div className="method-grid">
        {[
          [
            "01",
            "Comprendre",
            "Clarifier votre activité, vos publics et les objectifs du projet.",
          ],
          [
            "02",
            "Structurer",
            "Définir le périmètre, les contenus, les livrables et le devis.",
          ],
          [
            "03",
            "Créer",
            "Donner forme à une expérience cohérente, puis la faire évoluer avec vos retours.",
          ],
          [
            "04",
            "Vérifier",
            "Contrôler les parcours, les formats et les conditions de mise en ligne.",
          ],
        ].map(([n, t, d]) => (
          <article key={n}>
            <p className="eyebrow">{n} / FORMA</p>
            <h2>{t}</h2>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <Action to="configurer">Commencer mon projet</Action>
    </>
  );
}
export default function App() {
  const [hash, setHash] = useState(location.hash);
  const [menu, setMenu] = useState(false);
  const main = useRef<HTMLElement>(null);
  const page = hash.startsWith("#/") ? hash.slice(2).split("?")[0] : "accueil";
  const original =
    new URLSearchParams(location.search).get("reference") === "original";
  useEffect(() => {
    const change = () => {
      setHash(location.hash);
      setMenu(false);
      window.scrollTo(0, 0);
      requestAnimationFrame(() => main.current?.focus());
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    addEventListener("keydown", handler);
    return () => removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (menu) {
      document.querySelector<HTMLElement>("#main-menu a")?.focus();
      return () => {
        document.querySelector<HTMLElement>(".menu-toggle")?.focus();
      };
    }
  }, [menu]);
  if (original || page === "accueil") return <Archive original={original} />;
  const known = [
    "univers",
    "sites",
    "tarifs",
    "configurer",
    "contact",
    "realisations",
    "client",
    "apropos",
    "methode",
    "faq",
    "legal",
    "confidentialite",
    "conditions",
    ...families.map((f) => f.id),
  ];
  return (
    <div className="premium">
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Aller au contenu
      </a>
      <header className="premium-header">
        <a className="brand" href={link("accueil")}>
          <Logo />
          <span>FORMA</span>
        </a>
        <nav aria-label="Navigation principale" className="desktop-nav">
          {nav.slice(0, 6).map(([id, n]) => (
            <a
              key={id}
              aria-current={page === id ? "page" : undefined}
              href={link(id)}
            >
              {n}
            </a>
          ))}
        </nav>
        <button
          className={`menu-toggle ${menu ? "open" : ""}`}
          aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menu}
          aria-controls="main-menu"
          onClick={() => setMenu(!menu)}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <i key={i} />
          ))}
        </button>
      </header>
      {menu && (
        <nav
          id="main-menu"
          className="full-menu"
          aria-label="Toutes les rubriques"
        >
          <a href={link("accueil")}>
            Accueil <Arrow />
          </a>
          {nav.map(([id, n], i) => (
            <a key={id} href={link(id)}>
              <small>0{i + 1}</small>
              {n}
              <span>
                <Arrow />
              </span>
            </a>
          ))}
        </nav>
      )}
      <main
        id="main"
        tabIndex={-1}
        ref={main}
        className="premium-main"
        inert={menu}
        key={hash}
      >
        {page === "univers" ? (
          <>
            <Heading
              num="LES UNIVERS FORMA"
              title="Une idée. Toutes ses formes."
              text="Explorez les savoir-faire, comparez les possibilités et construisez un projet à votre mesure."
            />
            <div className="universe-list">
              {nav.map(([id, n], i) => (
                <a key={id} href={link(id)}>
                  <small>0{i + 1}</small>
                  <h2>{n}</h2>
                  <span>
                    <Arrow />
                  </span>
                </a>
              ))}
            </div>
          </>
        ) : page === "sites" ? (
          <Plans />
        ) : page === "tarifs" ? (
          <>
            <Heading
              num="05 / TARIFS"
              title="Le bon point de départ."
              text="Des prix lisibles, un périmètre à définir ensemble. Choisissez votre base, puis précisez vos besoins."
            />
            <Comparison />
            <div className="service-grid">
              {families.map((f) => (
                <article className="service-card" key={f.id}>
                  <h2>{f.name}</h2>
                  <p>
                    Le format et les livrables sont définis selon vos besoins.
                    Proposition personnalisée sur devis.
                  </p>
                  <Action to={f.id}>Découvrir</Action>
                </article>
              ))}
            </div>
            <Action to="configurer">Configurer mon site</Action>
          </>
        ) : page === "configurer" ? (
          <Configurator />
        ) : page === "contact" ? (
          <Contact />
        ) : page === "realisations" ? (
          <Gallery />
        ) : page === "client" ? (
          <Client />
        ) : families.some((f) => f.id === page) ? (
          <Family id={page} />
        ) : known.includes(page) ? (
          <Editorial page={page} />
        ) : (
          <>
            <Heading
              num="404"
              title="Cette forme reste à trouver."
              text="La page demandée n’existe pas. Retrouvez les univers de FORMA."
            />
            <Action to="univers">Explorer FORMA</Action>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
