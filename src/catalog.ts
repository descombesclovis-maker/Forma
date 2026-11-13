export const plans = [
  {
    id: "landing",
    name: "One Page",
    price: 590,
    pages: "1 page",
  },
  {
    id: "vitrine",
    name: "Vitrine Essentiel",
    price: 990,
    pages: "Jusqu’à 5 pages",
  },
  {
    id: "business",
    name: "Business",
    price: 1390,
    pages: "Jusqu’à 8 pages",
  },
  {
    id: "premium",
    name: "Premium",
    price: 1990,
    pages: "Jusqu’à 12 pages",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    price: 2490,
    pages: "Jusqu’à 30 produits",
  },
  {
    id: "surmesure",
    name: "Sur mesure",
    price: null,
    pages: "Selon votre projet",
  },
];
export const money = (n: number | null) =>
  n === null
    ? "Sur devis"
    : new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(n);
