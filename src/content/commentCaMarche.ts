export type Etape = {
  id: string;
  numero: string;
  titre: string;
  /** Modifiez librement ces paragraphes sans toucher au React ni aux animations. */
  paragraphes: string[];
};

/** Le dépliement dépend exclusivement du scroll au milieu de l'écran. */
export const etapes: Etape[] = [
  { id: "maquette", numero: "01", titre: "Maquette", paragraphes: ["Présentez ici vos premières propositions visuelles et les maquettes que vous allez réaliser."] },
  { id: "echange", numero: "02", titre: "Échange", paragraphes: ["Expliquez ici comment vous validez les besoins, ajustez la direction et recueillez les retours du client."] },
  { id: "creation", numero: "03", titre: "Création", paragraphes: ["Rédigez ici votre méthode de création, vos points de contrôle et les possibilités de suivi."] },
  { id: "livraison", numero: "04", titre: "Livraison", paragraphes: ["Précisez ici les livrables, les validations et l'accompagnement après la remise du projet."] },
];
