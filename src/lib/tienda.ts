export type Producto = {
  id: string;
  category: "impresion" | "album" | "cuadro";
  name: string;
  blurb: string;
  /** Precio en ARS (entero, sin decimales). */
  price: number;
  thumb: string;
};

function u(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

export const PRODUCTOS: Producto[] = [
  {
    id: "impr-13x18",
    category: "impresion",
    name: "Impresión 13×18 cm",
    blurb: "Papel fine-art mate, edición limitada.",
    price: 8500,
    thumb: u("1465495976277-4387d4b0b4c6", 600, 600),
  },
  {
    id: "impr-20x30",
    category: "impresion",
    name: "Impresión 20×30 cm",
    blurb: "Tamaño medio, ideal para enmarcar.",
    price: 14500,
    thumb: u("1606216794074-735e91aa2c92", 600, 600),
  },
  {
    id: "impr-30x45",
    category: "impresion",
    name: "Impresión 30×45 cm",
    blurb: "Tamaño grande, fine-art mate.",
    price: 24500,
    thumb: u("1519741497674-611481863552", 600, 600),
  },
  {
    id: "album-20x25",
    category: "album",
    name: "Álbum fine-art 20×25 cm",
    blurb: "30 páginas, tapa dura, papel fotográfico.",
    price: 168000,
    thumb: u("1530103862676-de8c9debad1d", 600, 600),
  },
  {
    id: "album-30x30",
    category: "album",
    name: "Álbum fine-art 30×30 cm",
    blurb: "40 páginas, tapa de lino, premium.",
    price: 245000,
    thumb: u("1537633552985-df8429e8048b", 600, 600),
  },
  {
    id: "cuadro-40x60",
    category: "cuadro",
    name: "Cuadro 40×60 cm",
    blurb: "Impresión en metacrilato, listo para colgar.",
    price: 92000,
    thumb: u("1525258946800-98cfd641d0de", 600, 600),
  },
];

export const CATEGORIAS = [
  { id: "todos", label: "TODOS" },
  { id: "impresion", label: "IMPRESIONES" },
  { id: "album", label: "ÁLBUMES" },
  { id: "cuadro", label: "CUADROS" },
] as const;
