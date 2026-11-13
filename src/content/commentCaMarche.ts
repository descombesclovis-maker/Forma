export type Etape = {
  id: string;
  numero: string;
  titre: string;
  /** Paragraphs are kept in content data so they can be edited without touching UI or animation code. */
  paragraphes: string[];
};

export const etapes: Etape[] = [
  { id: "echange", numero: "01", titre: "Échange", paragraphes: ["Texte explicatif à personnaliser."] },
  { id: "conception", numero: "02", titre: "Conception", paragraphes: ["Texte explicatif à personnaliser."] },
  { id: "creation", numero: "03", titre: "Création", paragraphes: ["Texte explicatif à personnaliser."] },
  { id: "livraison", numero: "04", titre: "Livraison", paragraphes: ["Texte explicatif à personnaliser."] },
];
