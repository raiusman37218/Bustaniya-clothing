/**
 * Professional Pakistani shalwar kameez imagery (women).
 * Photography: Muneeb Malhotra — https://unsplash.com/@muneebmalhotra (Unsplash License)
 */

const BASE = '/images/pakistani-fashion';

/** Build optimized Unsplash URL when downloading or referencing remotely */
export function unsplashPhoto(
  photoId: string,
  width = 1200,
): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=85`;
}

const PHOTO_IDS = [
  'photo-1773439877245-79b5ac3244a8',
  'photo-1773439878258-3c5fa24afa75',
  'photo-1773439878437-11da66df98e9',
  'photo-1773439878392-74abd38c55ec',
  'photo-1773439878222-c383967772de',
  'photo-1773439877127-ecfe17c9eb62',
  'photo-1773439877255-55e63cf17b2c',
  'photo-1773439877918-8b7253ac852e',
  'photo-1773439877904-39a38b3584da',
  'photo-1773439878338-c61b0fe9ed48',
  'photo-1773439878760-cdb8c7aa13fa',
  'photo-1773439877295-15e34acb4ae0',
  'photo-1773439878676-b0ab6febe677',
  'photo-1773439878503-1e96ace29e1b',
  'photo-1773439877634-e6ef9f571c12',
  'photo-1773439878916-eaeacd159a68',
  'photo-1773439879035-4a2f33b30bbc',
  'photo-1773439878174-201b8b441e75',
  'photo-1773439878398-696c801b72f4',
  'photo-1773439879064-53483d0ce0d1',
  'photo-1773439878390-05ec136e70a8',
  'photo-1773439878720-1d2410dee362',
  'photo-1773439878067-4cdadc0b1124',
] as const;

export const PAKISTANI_FASHION_PHOTOS = PHOTO_IDS;

export const productStockImage = (index: number): string =>
  `${BASE}/stock-${(index % 18) + 1}.jpg`;

export const PAKISTANI_FASHION = {
  productStock: Array.from({ length: 18 }, (_, i) => productStockImage(i)),
  hero: `${BASE}/hero.jpg`,
  /** Home hero carousel: hero1 → hero4 sequence */
  heroSlides: [
    {
      src: '/images/suit_variation_olive.png',
      alt: 'Bustaniya — Premium Pastel Suit Collection',
      objectPosition: 'center center',
    },
    {
      src: '/images/suit_black_white.png',
      alt: 'Bustaniya — Elegant Black & White Suit Collection',
      objectPosition: 'center center',
    },
    {
      src: '/images/suit_variation_maroon (1).png',
      alt: 'Bustaniya — Radiant Yellow & White Suit Collection',
      objectPosition: 'center center',
    },
  ],
  login: `${BASE}/login.jpg`,
  collectionBanner: `${BASE}/collection-banner.jpg`,
  sustainability: `${BASE}/sustainability.jpg`,
  occasion: [
    `${BASE}/occasion-1.jpg`,
    `${BASE}/occasion-2.jpg`,
    `${BASE}/occasion-3.jpg`,
    `${BASE}/occasion-4.jpg`,
  ],
  editorial: [
    `${BASE}/editorial-1.jpg`,
    `${BASE}/editorial-2.jpg`,
    `${BASE}/editorial-3.jpg`,
  ],
  masonry: [
    `${BASE}/masonry-1.jpg`,
    `${BASE}/masonry-2.jpg`,
    `${BASE}/masonry-3.jpg`,
    `${BASE}/masonry-4.jpg`,
  ],
  followUs: [
    `${BASE}/follow-1.jpg`,
    `${BASE}/follow-2.jpg`,
    `${BASE}/follow-3.jpg`,
    `${BASE}/follow-4.jpg`,
    `${BASE}/follow-5.jpg`,
    `${BASE}/follow-6.jpg`,
  ],
  modiWeek: [
    `${BASE}/week-1.jpg`,
    `${BASE}/week-2.jpg`,
    `${BASE}/week-3.jpg`,
    `${BASE}/week-4.jpg`,
    `${BASE}/week-5.jpg`,
    `${BASE}/week-6.jpg`,
    `${BASE}/week-7.jpg`,
  ],
  nav: [
    `${BASE}/nav-1.jpg`,
    `${BASE}/nav-2.jpg`,
    `${BASE}/nav-3.jpg`,
    `${BASE}/nav-4.jpg`,
    `${BASE}/nav-5.jpg`,
    `${BASE}/nav-6.jpg`,
    `${BASE}/nav-7.jpg`,
    `${BASE}/nav-8.jpg`,
    `${BASE}/nav-9.jpg`,
    `${BASE}/nav-10.jpg`,
    `${BASE}/nav-11.jpg`,
    `${BASE}/nav-12.jpg`,
  ],
} as const;
