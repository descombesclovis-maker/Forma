export type ServiceExample = { path: string; mediaType: "image"; provenance: string; link?: string; demo?: string };
export type ServiceItem = { id: string; title: string; description: string; example: ServiceExample };
export type ServiceCategory = { id: string; title: string; description: string; items: ServiceItem[] };

const internalDemos: Record<string,string> = {
  "site-vitrine":"aube", "ecommerce":"halo", "landing-page":"aube", "custom-site":"aube",
  "web-app":"atlas", "mobile-app":"orbit", "desktop-app":"atlas", "business-app":"atlas", "dashboard":"atlas",
  "logos":"mono", "identite":"eclat", "supports":"eclat", "banners":"viva", "presentations":"eclat",
  "photo-ads":"lyra", "video-ads":"lyra", "social-ads":"viva", "promo-animation":"viva", "custom-ads":"viva",
  "editing":"lyra", "motion":"viva", "graphic-animation":"viva", "presentation-video":"lyra", "short-social":"viva",
  "automation":"atlas", "internal-tools":"atlas", "management":"atlas", "integrations":"atlas", "custom-solutions":"atlas"
};
const illustration = (path: string, link?: string): ServiceExample => {
  const id = path.split("/").at(-1)?.replace(".svg","") ?? "";
  return {
    path, link, demo: internalDemos[id], mediaType: "image",
    provenance: "Illustration conceptuelle spécifique au service, avec démonstration FORMA complémentaire quand disponible. Toute référence externe demeure indépendante et n’est pas une réalisation de FORMA."
  };
};

/** Service descriptions and replaceable preview paths. Example visuals are explicitly conceptual, never client work. */
export const serviceCatalog: ServiceCategory[] = [
  { id: "web", title: "Création de sites web", description: "Des expériences web conçues autour de l’activité et des objectifs du projet.", items: [
    { id: "site-vitrine", title: "Sites vitrines", description: "Présenter clairement une activité, son offre et ses coordonnées.", example: illustration("/service-examples/showcase/site-vitrine.svg", "https://www.tesla.com/fr_FR") },
    { id: "ecommerce", title: "Sites e-commerce", description: "Présenter un catalogue et faciliter la découverte de produits en ligne.", example: illustration("/service-examples/showcase/ecommerce.svg", "https://www.ikea.com/fr/fr/") },
    { id: "landing-page", title: "Landing pages", description: "Une page ciblée autour d’une offre, d’un service ou d’une campagne.", example: illustration("/service-examples/showcase/landing-page.svg", "https://www.notion.com/") },
    { id: "reservation-site", title: "Sites de réservation", description: "Une interface dédiée à la présentation des créneaux et à la prise de rendez-vous.", example: illustration("/service-examples/showcase/reservation-site.svg", "https://www.doctolib.fr/") },
    { id: "custom-site", title: "Sites sur mesure", description: "Une expérience web personnalisée selon le périmètre convenu.", example: illustration("/service-examples/showcase/custom-site.svg", "https://www.awwwards.com/websites/") },
  ]},
  { id: "applications", title: "Développement d’applications", description: "Des interfaces et outils numériques adaptés aux usages du projet.", items: [
    { id: "web-app", title: "Applications web", description: "Des outils accessibles depuis un navigateur, pensés pour un usage précis.", example: illustration("/service-examples/showcase/web-app.svg", "https://www.figma.com/") },
    { id: "mobile-app", title: "Applications mobiles", description: "Des interfaces adaptées aux usages sur téléphone et tablette.", example: illustration("/service-examples/showcase/mobile-app.svg", "https://www.duolingo.com/") },
    { id: "desktop-app", title: "Applications de bureau", description: "Des outils conçus pour les environnements de travail sur ordinateur.", example: illustration("/service-examples/showcase/desktop-app.svg", "https://code.visualstudio.com/") },
    { id: "business-app", title: "Applications métier", description: "Des fonctionnalités organisées autour d’un processus professionnel.", example: illustration("/service-examples/showcase/business-app.svg", "https://trello.com/") },
    { id: "dashboard", title: "Tableaux de bord", description: "Une vue claire pour consulter et organiser des informations utiles.", example: illustration("/service-examples/showcase/dashboard.svg", "https://play.grafana.org/") },
  ]},
  { id: "graphic-design", title: "Création graphique", description: "Des éléments graphiques cohérents pour communiquer avec clarté.", items: [
    { id: "logos", title: "Logos", description: "Un symbole ou un logotype pensé pour représenter une activité.", example: illustration("/service-examples/showcase/logos.svg", "https://www.nike.com/fr/") },
    { id: "identite", title: "Identités visuelles", description: "Un ensemble de repères graphiques pour décliner une marque.", example: illustration("/service-examples/showcase/identite.svg", "https://www.mcdonalds.fr/") },
    { id: "supports", title: "Supports de communication", description: "Des compositions adaptées aux supports imprimés ou numériques.", example: illustration("/service-examples/showcase/supports.svg", "https://www.behance.net/search/projects/brochure") },
    { id: "banners", title: "Bannières", description: "Des visuels conçus pour différents emplacements et formats.", example: illustration("/service-examples/showcase/banners.svg", "https://www.canva.com/create/banners/") },
    { id: "presentations", title: "Présentations professionnelles", description: "Une mise en forme soignée pour structurer un message ou une offre.", example: illustration("/service-examples/showcase/presentations.svg", "https://pitch.com/") },
  ]},
  { id: "advertising", title: "Publicité numérique", description: "Des créations visuelles pour soutenir la communication digitale.", items: [
    { id: "photo-ads", title: "Publicités photo", description: "Un visuel statique composé pour présenter une offre ou un message.", example: illustration("/service-examples/showcase/photo-ads.svg", "https://www.adsoftheworld.com/") },
    { id: "video-ads", title: "Publicités vidéo", description: "Un format vidéo court adapté à une intention de communication définie.", example: illustration("/service-examples/showcase/video-ads.svg", "https://www.youtube.com/@Apple/videos") },
    { id: "social-ads", title: "Publicités pour réseaux sociaux", description: "Des visuels préparés pour les formats des plateformes sociales.", example: illustration("/service-examples/showcase/social-ads.svg", "https://www.instagram.com/mcdonaldsfrance/") },
    { id: "promo-animation", title: "Animations promotionnelles", description: "Des éléments animés pour donner du mouvement à une campagne.", example: illustration("/service-examples/showcase/promo-animation.svg", "https://www.behance.net/search/projects/motion%20design") },
    { id: "custom-ads", title: "Contenus publicitaires personnalisés", description: "Une création adaptée au message, au support et au public visé.", example: illustration("/service-examples/showcase/custom-ads.svg", "https://www.adsoftheworld.com/") },
  ]},
  { id: "audiovisual", title: "Production audiovisuelle", description: "Des formats animés ou vidéo définis selon les ressources et le besoin.", items: [
    { id: "editing", title: "Montage vidéo", description: "Assemblage et rythme des séquences à partir des éléments disponibles.", example: illustration("/service-examples/showcase/editing.svg", "https://www.blackmagicdesign.com/products/davinciresolve") },
    { id: "motion", title: "Motion design", description: "Mise en mouvement de formes, de textes ou d’éléments graphiques.", example: illustration("/service-examples/showcase/motion.svg", "https://www.behance.net/search/projects/motion%20graphics") },
    { id: "graphic-animation", title: "Animations graphiques", description: "Des séquences animées pour accompagner un message visuel.", example: illustration("/service-examples/showcase/graphic-animation.svg", "https://www.behance.net/search/projects/animation") },
    { id: "presentation-video", title: "Vidéos de présentation", description: "Un format vidéo pour présenter une activité, une offre ou un projet.", example: illustration("/service-examples/showcase/presentation-video.svg", "https://www.youtube.com/@Apple/videos") },
    { id: "short-social", title: "Contenus courts pour réseaux sociaux", description: "Des formats courts préparés pour les usages sociaux.", example: illustration("/service-examples/showcase/short-social.svg", "https://www.instagram.com/nike/") },
  ]},
  { id: "digital-solutions", title: "Solutions numériques professionnelles", description: "Des outils et connexions numériques dont le périmètre est défini avec le client.", items: [
    { id: "automation", title: "Automatisations", description: "Des tâches répétitives pouvant être étudiées pour une automatisation adaptée.", example: illustration("/service-examples/showcase/automation.svg", "https://zapier.com/") },
    { id: "internal-tools", title: "Outils internes", description: "Des interfaces dédiées à un besoin d’organisation ou de suivi.", example: illustration("/service-examples/showcase/internal-tools.svg", "https://www.appsmith.com/") },
    { id: "management", title: "Interfaces de gestion", description: "Des vues organisées pour consulter ou mettre à jour des données.", example: illustration("/service-examples/showcase/management.svg", "https://www.odoo.com/fr_FR") },
    { id: "integrations", title: "Intégrations entre services", description: "Étude de connexions possibles entre les outils déjà utilisés.", example: illustration("/service-examples/showcase/integrations.svg", "https://www.make.com/") },
    { id: "custom-solutions", title: "Solutions numériques personnalisées", description: "Une réponse à définir selon les contraintes, les outils et le périmètre du projet.", example: illustration("/service-examples/showcase/custom-solutions.svg", "https://retool.com/") },
  ]},
];
