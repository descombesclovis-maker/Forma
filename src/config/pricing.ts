export type PricingOption = { id: string; label: string; price: number; recurring?: { amount: number; period: string }; quantity?: { unit: string; max: number } };
export type PricingProduct = { id: string; label: string; base: number; options: PricingOption[]; included?: string[] };
export type PricingCategory = { id: string; label: string; products: PricingProduct[]; complexity: PricingOption[] };

/** Draft, indicative starting prices in EUR, to review and validate before public commercial use. */
const basePricing: PricingCategory[] = [
  { id: "web", label: "Sites web", complexity: [{ id: "web-function", label: "Fonctionnalité complémentaire", price: 90 }, { id: "web-advanced", label: "Périmètre technique avancé", price: 190 }], products: [
    { id: "landing", label: "Landing page", base: 290, options: [{ id: "form", label: "Formulaire de contact", price: 60 }, { id: "motion", label: "Animations avancées", price: 120 }, { id: "copy", label: "Aide à la rédaction", price: 90 }, { id: "maintenance", label: "Maintenance mensuelle", price: 25, recurring: { amount: 25, period: "mois" } }] },
    { id: "vitrine-simple", label: "Site vitrine simple", base: 490, options: [{ id: "pages", label: "Pages supplémentaires", price: 55, quantity: { unit: "page", max: 12 } }, { id: "form", label: "Formulaire de contact", price: 60 }, { id: "motion", label: "Animations avancées", price: 140 }, { id: "maintenance", label: "Maintenance mensuelle", price: 25, recurring: { amount: 25, period: "mois" } }] },
    { id: "vitrine-multipage", label: "Site vitrine multipage", base: 790, options: [{ id: "pages", label: "Pages supplémentaires", price: 50, quantity: { unit: "page", max: 20 } }, { id: "form", label: "Formulaire avec envoi sécurisé", price: 90 }, { id: "motion", label: "Animations avancées", price: 160 }, { id: "maintenance", label: "Maintenance mensuelle", price: 30, recurring: { amount: 30, period: "mois" } }] },
    { id: "ecommerce", label: "Site e-commerce", base: 1290, options: [{ id: "catalogue", label: "Catalogue produits étendu", price: 250 }, { id: "integration", label: "Intégration externe", price: 180 }, { id: "motion", label: "Animations avancées", price: 150 }, { id: "maintenance", label: "Maintenance mensuelle", price: 45, recurring: { amount: 45, period: "mois" } }] },
    { id: "reservation", label: "Site de réservation", base: 890, options: [{ id: "calendar", label: "Calendrier et disponibilités", price: 220 }, { id: "payment", label: "Intégration de paiement", price: 180 }, { id: "maintenance", label: "Maintenance mensuelle", price: 35, recurring: { amount: 35, period: "mois" } }] },
    { id: "sur-mesure", label: "Site professionnel sur mesure", base: 1190, options: [{ id: "integration", label: "Intégration externe", price: 180 }, { id: "motion", label: "Animations avancées", price: 180 }, { id: "maintenance", label: "Maintenance mensuelle", price: 45, recurring: { amount: 45, period: "mois" } }] },
    { id: "refonte", label: "Refonte de site existant", base: 590, options: [{ id: "pages", label: "Pages supplémentaires (jusqu’à 5)", price: 220 }, { id: "migration", label: "Migration de contenu", price: 140 }, { id: "maintenance", label: "Maintenance mensuelle", price: 30, recurring: { amount: 30, period: "mois" } }] },
  ]},
  { id: "app", label: "Applications", complexity: [{ id: "app-feature", label: "Fonctionnalité métier complémentaire", price: 180 }, { id: "app-complex", label: "Périmètre technique avancé", price: 320 }], products: [
    { id: "web-app", label: "Application web", base: 1590, options: [{ id: "auth", label: "Comptes et authentification", price: 280 }, { id: "database", label: "Stockage de données", price: 280 }, { id: "integration", label: "Intégration externe", price: 220 }, { id: "screens", label: "Écrans supplémentaires", price: 70, quantity: { unit: "écran", max: 24 } }] },
    { id: "mobile-app", label: "Application mobile", base: 2490, options: [{ id: "auth", label: "Comptes et authentification", price: 300 }, { id: "database", label: "Stockage de données", price: 320 }, { id: "integration", label: "Intégration externe", price: 250 }, { id: "prototype", label: "Prototype interactif préalable", price: 240 }] },
    { id: "desktop-app", label: "Application de bureau", base: 2190, options: [{ id: "database", label: "Stockage de données", price: 300 }, { id: "integration", label: "Intégration externe", price: 240 }, { id: "screens", label: "Écrans supplémentaires", price: 70, quantity: { unit: "écran", max: 24 } }] },
    { id: "dashboard", label: "Tableau de bord", base: 1190, options: [{ id: "auth", label: "Comptes et authentification", price: 240 }, { id: "database", label: "Stockage de données", price: 240 }, { id: "integration", label: "Intégration externe", price: 180 }] },
    { id: "business-app", label: "Application métier", base: 1890, options: [{ id: "auth", label: "Comptes et authentification", price: 280 }, { id: "database", label: "Stockage de données", price: 300 }, { id: "integration", label: "Intégration externe", price: 240 }] },
    { id: "prototype", label: "Prototype interactif", base: 490, options: [{ id: "screens", label: "Écrans supplémentaires", price: 45, quantity: { unit: "écran", max: 24 } }, { id: "motion", label: "Interactions animées", price: 120 }] },
    { id: "ai-app", label: "Application avec fonctionnalités d’IA", base: 2490, options: [{ id: "auth", label: "Comptes et authentification", price: 280 }, { id: "database", label: "Stockage de données", price: 300 }, { id: "integration", label: "Intégration d’un service IA", price: 350 }] },
  ]},
  { id: "logo", label: "Logos", complexity: [{ id: "logo-direction", label: "Recherche graphique approfondie", price: 80 }, { id: "logo-brand", label: "Déclinaisons de marque étendues", price: 120 }], products: [
    { id: "minimal", label: "Logo minimaliste", base: 190, options: [{ id: "propositions", label: "Propositions créatives supplémentaires", price: 45, quantity: { unit: "proposition", max: 6 } }, { id: "variants", label: "Déclinaisons supplémentaires", price: 30, quantity: { unit: "déclinaison", max: 10 } }, { id: "source", label: "Fichiers sources vectoriels", price: 35 }] },
    { id: "wordmark", label: "Logo typographique", base: 220, options: [{ id: "propositions", label: "Propositions créatives supplémentaires", price: 45, quantity: { unit: "proposition", max: 6 } }, { id: "variants", label: "Déclinaisons supplémentaires", price: 30, quantity: { unit: "déclinaison", max: 10 } }, { id: "source", label: "Fichiers sources vectoriels", price: 35 }] },
    { id: "illustrated", label: "Logo illustré", base: 320, options: [{ id: "propositions", label: "Propositions créatives supplémentaires", price: 55, quantity: { unit: "proposition", max: 6 } }, { id: "variants", label: "Déclinaisons supplémentaires", price: 30, quantity: { unit: "déclinaison", max: 10 } }, { id: "source", label: "Fichiers sources vectoriels", price: 35 }] },
    { id: "3d", label: "Logo tridimensionnel", base: 390, options: [{ id: "motion", label: "Version animée", price: 140 }, { id: "variants", label: "Déclinaisons supplémentaires", price: 30, quantity: { unit: "déclinaison", max: 10 } }, { id: "source", label: "Fichiers sources", price: 35 }] },
    { id: "redesign", label: "Refonte de logo", base: 240, options: [{ id: "propositions", label: "Propositions créatives supplémentaires", price: 45, quantity: { unit: "proposition", max: 6 } }, { id: "variants", label: "Déclinaisons supplémentaires", price: 30, quantity: { unit: "déclinaison", max: 10 } }, { id: "source", label: "Fichiers sources vectoriels", price: 35 }] },
    { id: "logo-pack", label: "Pack logo avec déclinaisons", base: 360, options: [{ id: "variants", label: "Déclinaisons supplémentaires", price: 30, quantity: { unit: "déclinaison", max: 10 } }, { id: "brand-sheet", label: "Fiche d’utilisation", price: 65 }, { id: "source", label: "Fichiers sources vectoriels", price: 35 }] },
  ]},
  { id: "ads", label: "Publicité", complexity: [{ id: "ads-copy", label: "Conception de variantes de message", price: 70 }, { id: "ads-campaign", label: "Déclinaisons multi-supports", price: 110 }], products: [
    { id: "poster", label: "Affiche publicitaire", base: 160, options: [{ id: "variants", label: "Déclinaisons de format", price: 45 }, { id: "copy", label: "Aide à la rédaction", price: 50 }] },
    { id: "social", label: "Publicité pour réseaux sociaux", base: 120, options: [{ id: "pack", label: "Pack de 3 visuels", price: 110, quantity: { unit: "pack", max: 8 } }, { id: "variants", label: "Déclinaisons de format", price: 35 }] },
    { id: "banner", label: "Bannière numérique", base: 90, options: [{ id: "variants", label: "Déclinaisons de format", price: 35 }, { id: "motion", label: "Version animée", price: 90 }] },
    { id: "short-video", label: "Publicité vidéo courte", base: 290, options: [{ id: "motion", label: "Motion design avancé", price: 140 }, { id: "versions", label: "Déclinaisons supplémentaires", price: 65 }] },
    { id: "promo-video", label: "Vidéo promotionnelle", base: 490, options: [{ id: "motion", label: "Motion design avancé", price: 160 }, { id: "versions", label: "Déclinaisons supplémentaires", price: 75 }] },
    { id: "animation", label: "Animation publicitaire", base: 350, options: [{ id: "duration", label: "Durée supplémentaire", price: 120 }, { id: "versions", label: "Déclinaisons de format", price: 55 }] },
    { id: "ad-pack", label: "Pack de visuels publicitaires", base: 260, options: [{ id: "pack", label: "Pack de 3 visuels supplémentaires", price: 120, quantity: { unit: "pack", max: 8 } }, { id: "variants", label: "Déclinaisons de format", price: 40 }] },
  ]},
];

export const formatEUR = (amount: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

/**
 * Options bundled into each product type are included in the starting price;
 * they cannot be charged again as extras. Edit these entries when the
 * commercial scope changes. Base prices remain draft estimates, not quotes.
 */
const bundles: Record<string, { included: string[]; remove?: string[]; replace?: Record<string, { label: string; price: number }> }> = {
  landing: { included: ["Une page responsive", "Mise en page personnalisée", "Bouton d'appel à l'action", "Mise en ligne initiale"] },
  "vitrine-simple": { included: ["Jusqu'à 3 pages responsives", "Formulaire de contact standard", "Navigation et pied de page", "Optimisation SEO de base"], remove: ["form"] },
  "vitrine-multipage": { included: ["Jusqu'à 6 pages responsives", "Formulaire de contact standard", "Menu et navigation multipages", "Optimisation SEO de base"], replace: { form: { label: "Formulaire avancé avec traitement serveur", price: 120 } } },
  ecommerce: { included: ["Jusqu'à 10 fiches produits", "Catalogue, panier et passage en caisse", "Paramétrage initial d'un paiement standard", "Interface responsive"] },
  reservation: { included: ["Calendrier et créneaux de réservation standards", "Formulaire de réservation", "Gestion simple des demandes", "Interface responsive"], replace: { calendar: { label: "Synchronisation calendrier externe", price: 140 } } },
  "sur-mesure": { included: ["Étude du périmètre", "Conception personnalisée", "Version responsive", "Mise en ligne initiale"] },
  refonte: { included: ["Audit visuel rapide", "Nouvelle direction UI", "Reprise de la structure existante", "Compatibilité mobile"] },
  "web-app": { included: ["Interface responsive", "Jusqu'à 4 écrans", "Navigation et états UI"], },
  "mobile-app": { included: ["Interface mobile", "Jusqu'à 5 écrans", "Navigation adaptée au tactile"] },
  "desktop-app": { included: ["Application de bureau", "Jusqu'à 5 vues", "Navigation et packaging standard"] },
  dashboard: { included: ["Tableau de bord de base", "Visualisation d'indicateurs", "Jusqu'à 4 vues"] },
  "business-app": { included: ["Cadrage du processus métier", "Jusqu'à 5 vues", "Gestion des états d'interface"] },
  prototype: { included: ["Maquette interactive", "Jusqu'à 5 écrans", "Parcours principal cliquable"] },
  "ai-app": { included: ["Interface applicative", "Parcours de démonstration", "Design responsive"], },
  minimal: { included: ["Une proposition vectorielle", "Version couleur + monochrome", "Fichiers PNG et SVG"], remove: ["source"] },
  wordmark: { included: ["Logotype vectoriel", "Version couleur + monochrome", "Fichiers PNG et SVG"], remove: ["source"] },
  illustrated: { included: ["Illustration originale", "Déclinaison monochrome", "Fichiers PNG et SVG"], remove: ["source"] },
  "3d": { included: ["Logo 3D fixe", "Deux angles d'export", "Images PNG haute résolution"] },
  redesign: { included: ["Analyse de l'ancien logo", "Proposition remaniée", "Fichiers PNG et SVG"], remove: ["source"] },
  "logo-pack": { included: ["Logo vectoriel principal", "Trois déclinaisons", "Fichiers sources SVG", "Exports numériques"], remove: ["source"] },
  poster: { included: ["Une affiche finalisée", "Un format principal", "Export pour diffusion"] },
  social: { included: ["Un visuel social finalisé", "Une version principale", "Export web"] },
  banner: { included: ["Une bannière finalisée", "Un format principal", "Export web"] },
  "short-video": { included: ["Un format court", "Montage simple", "Export pour diffusion"] },
  "promo-video": { included: ["Une vidéo de présentation", "Montage standard", "Export final"] },
  animation: { included: ["Animation graphique courte", "Un format principal", "Export vidéo"] },
  "ad-pack": { included: ["Pack initial de trois visuels", "Formats web standards", "Fichiers finaux"] },
};

export const pricing: PricingCategory[] = basePricing.map((category) => ({
  ...category,
  products: category.products.map((product) => {
    const bundle = bundles[product.id];
    return {
      ...product,
      included: bundle?.included ?? ["Conception et export du produit de base"],
      options: product.options
        .filter((option) => !bundle?.remove?.includes(option.id))
        .map((option) => ({ ...option, ...(bundle?.replace?.[option.id] ?? {}) })),
    };
  }),
}));
