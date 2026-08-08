export type ShopTheLookImage = {
  src: string;
  alt: string;
};

export type ShopTheLookProduct = {
  id: number | string;
  title: string;
  price: number;
  thumbnail: string;
  href?: string;
};

/** Position (in % of the room image's width/height) of a numbered pin, linked to a product by index. */
export type ShopTheLookHotspot = {
  id: number;
  x: number;
  y: number;
  productIndex: number;
};

export type ShopTheLookRoom = {
  id: string;
  /** Short label shown on the room's tab, e.g. "Bedroom". */
  tabLabel: string;
  /** Caption shown over the room image, e.g. "Bedroom". */
  roomLabel: string;
  images: ShopTheLookImage[];
  hotspots: ShopTheLookHotspot[];
  products: ShopTheLookProduct[];
};

export type ShopTheLookData = {
  eyebrow: string;
  title: string;
  /** Defaults to "Add The Room" when omitted. */
  ctaLabel?: string;
  rooms: ShopTheLookRoom[];
};
