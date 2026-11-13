export const plans = [
  {
    id: "landing",
    name: "One Page",
    price: 590,
    pages: "1 page",
    text: "Une présence précise. L’essentiel de votre activité dans une page qui va droit au but.",
    features: [
      "Design responsive",
      "Formulaire de contact",
      "Référencement de base",
    ],
  },
  {
    id: "vitrine",
    name: "Vitrine Essentiel",
    price: 990,
    pages: "Jusqu’à 5 pages",
    text: "Un espace pour présenter votre savoir-faire et donner envie de vous rencontrer.",
    features: [
      "Design personnalisé",
      "Animations fluides",
      "Contact et référencement de base",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 1390,
    pages: "Jusqu’à 8 pages",
    text: "Structurez votre présence digitale autour de vos objectifs et de votre activité.",
    features: [
      "Animations avancées",
      "Fonctionnalités métier à cadrer",
      "Architecture de contenus",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 1990,
    pages: "Jusqu’à 12 pages",
    text: "Une direction artistique singulière et une expérience interactive à votre image.",
    features: [
      "Direction artistique",
      "Expérience interactive",
      "Animations premium",
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    price: 2490,
    pages: "Jusqu’à 30 produits",
    text: "Présentez vos produits et préparez un parcours d’achat clair, de la découverte à la commande.",
    features: [
      "Catalogue et panier",
      "Gestion des commandes",
      "Paiement à connecter",
    ],
  },
  {
    id: "surmesure",
    name: "Sur mesure",
    price: null,
    pages: "Selon votre projet",
    text: "Une idée particulière mérite une réponse qui lui ressemble. Construisons son périmètre ensemble.",
    features: [
      "Étude du besoin",
      "Périmètre personnalisé",
      "Chiffrage après échange",
    ],
  },
];
export const options = [
  {
    id: "contenus",
    name: "Rédaction des contenus",
    text: "Définir les pages, le ton et les textes nécessaires à votre projet.",
  },
  {
    id: "reservation",
    name: "Prise de rendez-vous",
    text: "Préciser vos créneaux, votre organisation et l’outil à connecter.",
  },
  {
    id: "langues",
    name: "Version multilingue",
    text: "Identifier les langues et les contenus à traduire.",
  },
  {
    id: "maintenance",
    name: "Accompagnement & maintenance",
    text: "Définir le suivi, les mises à jour et les interventions souhaitées.",
  },
];
export const families = [
  {
    id: "logiciels",
    num: "02",
    name: "Logiciels & applications",
    line: "Vos outils. Votre manière de travailler.",
    text: "Des interfaces pensées autour des usages, avec un périmètre et des compatibilités définis avant chaque projet.",
    items: ["LocalAiStudio", "LocalAiWeb", "LocalAiVision"],
  },
  {
    id: "identites",
    num: "03",
    name: "Logos & identités",
    line: "Un signe. Tout un univers.",
    text: "Du premier symbole à ses déclinaisons, donnons une forme cohérente à votre marque.",
    items: [
      "Création de logo",
      "Identité visuelle",
      "Charte graphique",
      "Supports numériques",
    ],
  },
  {
    id: "reseaux",
    num: "04",
    name: "Réseaux & publicité",
    line: "Des idées qui prennent leur place.",
    text: "Des contenus conçus pour votre message, votre audience et les supports qui comptent.",
    items: [
      "Visuels de réseaux sociaux",
      "Créations publicitaires",
      "Vidéos promotionnelles",
      "Campagnes & supports",
    ],
  },
];
export const nav = [
  ["sites", "Sites web"],
  ["logiciels", "Logiciels"],
  ["identites", "Logos & identités"],
  ["reseaux", "Réseaux & publicité"],
  ["realisations", "Démonstrations"],
  ["tarifs", "Tarifs"],
  ["contact", "Contact"],
  ["client", "Espace client"],
];
export const money = (n: number | null) =>
  n === null
    ? "Sur devis"
    : new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(n);
