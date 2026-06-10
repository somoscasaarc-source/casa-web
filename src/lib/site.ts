export const SITE = {
  name: "CASA",
  tagline: "Sentite en casa.",
  city: "Villa Crespo, Buenos Aires",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "somoscasa.ar@gmail.com",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_URL ??
    "https://wa.me/5491139295625?text=Hola%20CASA%2C%20quiero%20consultar%20mi%20presupuesto.",
  whatsappRaw: "+54 9 11 3929-5625",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://instagram.com/somos.casa.ar",
  instagramHandle: "@somos.casa.ar",
} as const;

export const NAV = [
  { href: "/bodas", label: "BODAS" },
  { href: "/quinces", label: "QUINCES" },
  { href: "/nosotros", label: "NOSOTROS" },
  { href: "/contacto", label: "CONTACTO" },
] as const;

type Pkg = {
  id: string;
  name: string;
  blurb: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  homeFeatures?: string[];
};

export const PACKAGES: Pkg[] = [
  {
    id: "esencial",
    name: "ESENCIAL",
    blurb:
      "La cobertura justa, sin excesos. Para quienes quieren lo importante, bien hecho.",
    features: [
      "1 Filmmaker · 1 Fotógrafo",
      "Cobertura ceremonia → cierre",
      "Galería digital privada",
      "Selección de fotos editadas",
      "Video resumen · 3 min",
    ],
  },
  {
    id: "clasico",
    name: "CLÁSICO",
    blurb:
      "Nuestro punto de equilibrio. La historia completa del día, de principio a fin.",
    highlight: true,
    badge: "MÁS ELEGIDO",
    features: [
      "2 Filmmakers · 2 Fotógrafos",
      "Civil + Getting Ready + Boda Completa",
      "Galería digital privada + descarga",
      "Selección ampliada de fotos editadas",
      "Video largo · 8 min + teaser",
    ],
    homeFeatures: [
      "2 Filmmakers · 2 Fotógrafos",
      "Civil + Getting Ready + Boda Completa",
      "Galería digital privada + descarga",
      "Selección ampliada de fotos editadas",
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    blurb:
      "La experiencia completa. Cada momento registrado, cada detalle cuidado.",
    features: [
      "3 Filmmakers · 3 Fotógrafos",
      "Cobertura integral · todo el evento",
      "Drone + edición en vivo",
      "Galería completa de fotos editadas",
      "Película documental · 15 min",
      "Álbum fine-art impreso",
    ],
    homeFeatures: [
      "3 Filmmakers · 3 Fotógrafos",
      "Cobertura integral · todo el evento",
      "Drone + edición en vivo",
      "La experiencia completa",
    ],
  },
];

// Warm, golden-hour stock from Unsplash CDN
function u(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

export const IMG = {
  heroBodas: u("1519741497674-611481863552", 1400, 900),
  heroQuinces: u("1583939003579-730e3918a45a", 1400, 900),
  samuel: u("1500648767791-00dcc994a43e", 1200, 1500),
};

type GalleryPhoto = { src: string; alt: string; ratio: "tall" | "wide" | "sq" };

export const GALLERY: GalleryPhoto[] = [
  { src: u("1519741497674-611481863552", 800, 1180), alt: "Boda · Palermo · Catalina y Tomás", ratio: "tall" },
  { src: u("1606216794074-735e91aa2c92", 900, 900), alt: "Detalle · anillos", ratio: "sq" },
  { src: u("1465495976277-4387d4b0b4c6", 1200, 800), alt: "Getting ready", ratio: "wide" },
  { src: u("1511285560929-80b456fea0bc", 800, 1180), alt: "Civil · Villa Crespo", ratio: "tall" },
  { src: u("1530103862676-de8c9debad1d", 900, 900), alt: "El brindis", ratio: "sq" },
  { src: u("1537633552985-df8429e8048b", 800, 1180), alt: "Última hora · fiesta", ratio: "tall" },
];

export const GALLERY_QUINCES: GalleryPhoto[] = [
  { src: u("1583939003579-730e3918a45a", 800, 1180), alt: "Mía · quince · hora dorada", ratio: "tall" },
  { src: u("1519225421980-715cb0215aed", 900, 900), alt: "Valentina · jardín", ratio: "sq" },
  { src: u("1525258946800-98cfd641d0de", 1200, 800), alt: "Sesión · jardín", ratio: "wide" },
  { src: u("1606800052052-a08af7148866", 800, 1180), alt: "Retrato editorial", ratio: "tall" },
  { src: u("1522673607200-164d1b6ce486", 900, 900), alt: "Detalle · ramo", ratio: "sq" },
  { src: u("1591604466107-ec97de577aff", 800, 1180), alt: "Última luz", ratio: "tall" },
];

export const TESTIMONIALS = [
  {
    quote:
      "No sentimos que había un fotógrafo. Sentimos que había alguien más disfrutando con nosotros.",
    attr: "Catalina y Tomás · Boda 2024",
  },
  {
    quote:
      "Las fotos no son lo que pasó. Son lo que se sintió. Es muy difícil explicarlo, pero está todo ahí.",
    attr: "Mía y familia · Quince 2024",
  },
];

export const FAQ_BODAS = [
  {
    q: "¿Cuánto tiempo antes hay que reservar?",
    a: "Lo ideal es entre 8 y 12 meses antes de la fecha. Los sábados de temporada se cierran rápido. Si tu fecha es más cercana, escribinos igual: a veces hay lugar.",
  },
  {
    q: "¿Cómo se reserva una fecha?",
    a: "Charlamos por WhatsApp o por mail, definimos el paquete y enviamos un contrato y una seña del 40%. Con eso queda bloqueada.",
  },
  {
    q: "¿En cuánto tiempo entregan el material?",
    a: "Una preview con 30–50 fotos llega dentro de los 15 días. La galería completa y el video se entregan entre 45 y 90 días, según el paquete.",
  },
  {
    q: "¿Hacen bodas fuera de Buenos Aires?",
    a: "Sí. Trabajamos por todo el país. Para destinos lejanos sumamos viáticos según corresponda.",
  },
  {
    q: "¿Puedo elegir el estilo de edición?",
    a: "Nuestro estilo es editorial, cálido y honesto. Podés contarnos tus referencias y lo ajustamos, pero no hacemos preset extremos ni filtros pesados.",
  },
  {
    q: "¿Imprimen álbumes?",
    a: "Sí. El paquete Premium ya incluye uno. En los otros paquetes lo sumás como adicional. Hacemos álbumes fine-art impresos en papeles seleccionados.",
  },
];

export const FAQ_QUINCES = [
  {
    q: "¿Qué momentos cubren en un quince?",
    a: "Desde el getting ready hasta el cierre de la fiesta. Si querés sumamos una sesión previa o un día anterior, lo armamos a tu medida.",
  },
  {
    q: "¿Hacen también la sesión preliminar?",
    a: "Sí. Es una sesión aparte, en exteriores o en estudio, con tiempo para probar looks y entrarte en clima.",
  },
  {
    q: "¿Cómo se reserva?",
    a: "Igual que las bodas: contrato y seña del 40%. Mientras antes mejor, porque los fines de semana se ocupan rápido.",
  },
  {
    q: "¿Entregan video?",
    a: "Todos los paquetes incluyen video. El largo y formato varía según el paquete. Hablamos antes de qué te gustaría ver.",
  },
  {
    q: "¿Y si quiero algo distinto a los paquetes?",
    a: "Lo armamos. Cada quince es distinto y nuestra forma de trabajar también puede serlo.",
  },
];

export const PILARES = [
  {
    n: "01",
    title: "Calidez antes que prestigio.",
    body:
      "Te queremos cómodos. Si estás cómodo, las fotos cambian. Por eso priorizamos la relación con vos antes que un set de luces espectacular.",
  },
  {
    n: "02",
    title: "Documental, no decorativo.",
    body:
      "No coreografiamos lo que ya pasa. Buscamos los gestos chicos: la mano que tiembla, el chiste de la mesa, la primera mirada después del sí.",
  },
  {
    n: "03",
    title: "Editorial, siempre.",
    body:
      "Cuidamos la luz, la composición y el ritmo. Una boda merece el mismo tratamiento estético que una nota de revista — no menos.",
  },
];
