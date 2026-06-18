// ============================================================
// CASA — Tienda dentro de la galería
// Formatos que el cliente puede pedir de SUS fotos.
// Precios en ARS (entero, sin decimales).
// ============================================================

export type ShopProduct = {
  id: string;
  /** "print" y "frame" se piden para una foto puntual; "album" para la boda entera. */
  kind: "print" | "frame" | "album";
  name: string;
  blurb: string;
  price: number;
};

/** Impresiones y cuadros: aplican a una foto elegida por el cliente. */
export const PRINT_PRODUCTS: ShopProduct[] = [
  {
    id: "print-13x18",
    kind: "print",
    name: "Impresión 13×18 cm",
    blurb: "Papel fine-art mate, edición limitada.",
    price: 8500,
  },
  {
    id: "print-20x30",
    kind: "print",
    name: "Impresión 20×30 cm",
    blurb: "Tamaño medio, ideal para enmarcar.",
    price: 14500,
  },
  {
    id: "print-30x45",
    kind: "print",
    name: "Impresión 30×45 cm",
    blurb: "Tamaño grande, fine-art mate.",
    price: 24500,
  },
  {
    id: "frame-40x60",
    kind: "frame",
    name: "Cuadro 40×60 cm",
    blurb: "Impresión en metacrilato, listo para colgar.",
    price: 92000,
  },
];

/** Álbumes: aplican a la boda completa, no requieren elegir una foto. */
export const ALBUM_PRODUCTS: ShopProduct[] = [
  {
    id: "album-20x25",
    kind: "album",
    name: "Álbum fine-art 20×25 cm",
    blurb: "30 páginas, tapa dura, papel fotográfico.",
    price: 168000,
  },
  {
    id: "album-30x30",
    kind: "album",
    name: "Álbum fine-art 30×30 cm",
    blurb: "40 páginas, tapa de lino, premium.",
    price: 245000,
  },
];

export const ALL_SHOP_PRODUCTS: ShopProduct[] = [
  ...PRINT_PRODUCTS,
  ...ALBUM_PRODUCTS,
];

export function findShopProduct(id: string): ShopProduct | undefined {
  return ALL_SHOP_PRODUCTS.find((p) => p.id === id);
}

export function formatARS(n: number): string {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}
