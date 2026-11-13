type LegalKind = "privacy" | "legal";
const placeholder = "Information à compléter avant publication définitive.";

export function LegalPage({ page }: { page: LegalKind }) {
  const privacy = page === "privacy";
  return <div className="legal-page">
    <header className="legal-hero"><p className="section-eyebrow">FORMA / INFORMATIONS</p><h1>{privacy ? "Politique de confidentialité" : "Mentions légales"}<span className="contact-page-dot">.</span></h1><p>Informations relatives au site et à son fonctionnement. Les champs signalés doivent être complétés et validés par l'éditeur de FORMA avant la publication définitive.</p></header>
    {privacy ? <article className="legal-content">
      <section><h2>1. Responsable du traitement</h2><p>Identité, forme juridique et coordonnées du responsable : <strong>{placeholder}</strong></p></section>
      <section><h2>2. Données recueillies</h2><p>Le formulaire et la messagerie de contact peuvent recueillir votre nom, adresse e-mail, entreprise, numéro de téléphone facultatif, sujet, catégorie de projet, budget indicatif, message et estimation que vous choisissez de communiquer.</p></section>
      <section><h2>3. Finalités et base légale</h2><p>Ces données servent à traiter votre demande, préparer une réponse et, si vous le souhaitez, discuter d'une prestation. La base légale devra être précisée par l'éditeur selon la finalité effective (mesures précontractuelles ou intérêt légitime, selon les cas).</p></section>
      <section><h2>4. Destinataires et hébergement</h2><p>Le prestataire d'envoi et les éventuels sous-traitants sont à identifier lors de l'activation du service : <strong>{placeholder}</strong> Aucun message n'est envoyé tant que ce service n'est pas configuré.</p></section>
      <section><h2>5. Durée de conservation</h2><p>Les durées de conservation des demandes et messages doivent être déterminées selon leur usage : <strong>{placeholder}</strong></p></section>
      <section><h2>6. Vos droits</h2><p>Vous pouvez demander l'accès, la rectification, l'effacement et, selon votre situation, exercer vos autres droits en matière de données personnelles. Les coordonnées d'exercice des droits doivent être renseignées : <strong>{placeholder}</strong> Vous pouvez également saisir la CNIL.</p></section>
      <section><h2>7. Cookies et mesure d'audience</h2><p>Le site devra répertorier et documenter tous les cookies, traceurs et éventuels outils de mesure activés avant sa publication. La présente rubrique ne constitue pas une déclaration d'absence de cookies tiers.</p></section>
      <section><h2>8. Mise à jour</h2><p>Version de travail — date de validation et de dernière mise à jour : <strong>{placeholder}</strong></p></section>
    </article> : <article className="legal-content">
      <section><h2>1. Éditeur du site</h2><p>Nom / raison sociale, forme juridique, adresse du siège social : <strong>{placeholder}</strong></p><p>SIREN / SIRET, registre d'immatriculation, capital social si applicable, numéro de TVA si applicable : <strong>{placeholder}</strong></p></section>
      <section><h2>2. Direction de publication</h2><p>Identité du responsable de la publication : <strong>{placeholder}</strong></p></section>
      <section><h2>3. Contact</h2><p>Adresse e-mail et téléphone professionnel : <strong>{placeholder}</strong></p><p><a href="/nous-contacter">Accéder à la fiche de contact →</a></p></section>
      <section><h2>4. Hébergeur</h2><p>Nom de l'hébergeur, raison sociale, adresse et contact à confirmer selon l'environnement de production : <strong>{placeholder}</strong></p></section>
      <section><h2>5. Propriété intellectuelle</h2><p>Les maquettes de démonstration FORMA sont des créations conceptuelles et ne représentent pas des commandes ni des clients réels. Les marques et liens externes utilisés comme références appartiennent à leurs propriétaires respectifs.</p></section>
      <section><h2>6. Informations commerciales</h2><p>Les estimations disponibles sur le site sont indicatives, non contractuelles et ne constituent ni commande ni facture. Les conditions applicables aux prestations doivent être établies et validées avant tout engagement.</p></section>
    </article>}
    <nav className="legal-bottom-links" aria-label="Informations complémentaires"><a href="/nous-contacter">Nous contacter →</a><a href={privacy ? "/mentions-legales" : "/politique-confidentialite"}>{privacy ? "Consulter les mentions légales" : "Consulter la politique de confidentialité"} →</a></nav>
  </div>;
}
