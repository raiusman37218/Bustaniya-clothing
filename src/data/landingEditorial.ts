/** Landing-only editorial content (Bustaniya) */

import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';

export type OccasionSlide = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  overlay: string;
  image: string;
  ctaHref: string;
};

export const OCCASION_SLIDES: OccasionSlide[] = [
  {
    id: 'ramadan',
    kicker: "Bustaniya Eid Collection '26",
    title: 'Shop by occasion',
    description:
      'Celebrate Eid in effortless elegance. Timeless shalwar kameez made for moments that matter.',
    overlay: 'RAMADAN EDIT',
    image: PAKISTANI_FASHION.occasion[0],
    ctaHref: '/shop',
  },
  {
    id: 'wedding',
    kicker: 'Ceremony & reception',
    title: 'Wedding season',
    description:
      'Rich embroidery and refined silhouettes for the aisle, the stage, and every celebration in between.',
    overlay: 'BRIDAL EDIT',
    image: PAKISTANI_FASHION.occasion[1],
    ctaHref: '/shop',
  },
  {
    id: 'festive',
    kicker: 'Limited capsules',
    title: 'Festive nights',
    description:
      'Statement shalwar kameez designed to glow under lights — from intimate dinners to grand gatherings.',
    overlay: 'FESTIVE EDIT',
    image: PAKISTANI_FASHION.occasion[2],
    ctaHref: '/shop',
  },
  {
    id: 'everyday',
    kicker: 'Daily wardrobe',
    title: 'Quiet luxury',
    description:
      'Soft lawn and breathable fabrics for elevated everyday dressing, all season long.',
    overlay: 'ESSENTIALS',
    image: PAKISTANI_FASHION.occasion[3],
    ctaHref: '/shop',
  },
];

export const EDITORIAL_TRIPTYCH = [
  {
    title: 'Eid & gatherings',
    subtitle: 'Embroidery · soft palettes',
    image: PAKISTANI_FASHION.editorial[0],
    href: '/shop',
  },
  {
    title: 'Bridal studio',
    subtitle: 'Made-to-feel couture',
    image: PAKISTANI_FASHION.editorial[1],
    href: '/shop',
  },
  {
    title: 'Everyday ease',
    subtitle: 'Lawn suits & layers',
    image: PAKISTANI_FASHION.editorial[2],
    href: '/shop',
  },
];

export type BridalShowcaseItem = {
  id: string;
  name: string;
  priceDisplay: string;
  image: string;
  href: string;
};

export const BRIDAL_SHOWCASE: BridalShowcaseItem[] = [
  {
    id: 'bridal-nairah',
    name: 'Nairah',
    priceDisplay: 'Rs.950,000',
    image: '/images/pakistani-fashion/stock-1.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-mahe',
    name: 'Mahe',
    priceDisplay: 'Rs.930,000',
    image: '/images/pakistani-fashion/stock-2.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-azureh',
    name: 'Azureh',
    priceDisplay: 'Rs.980,000',
    image: '/images/pakistani-fashion/stock-3.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-salome',
    name: 'Salome',
    priceDisplay: 'Rs.900,000',
    image: '/images/pakistani-fashion/stock-4.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-lyra',
    name: 'Lyra',
    priceDisplay: 'Rs.875,000',
    image: '/images/pakistani-fashion/stock-5.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-noor',
    name: 'Noor',
    priceDisplay: 'Rs.920,000',
    image: '/images/pakistani-fashion/stock-6.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-ameera',
    name: 'Ameera',
    priceDisplay: 'Rs.965,000',
    image: '/images/pakistani-fashion/stock-7.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-zara',
    name: 'Zara',
    priceDisplay: 'Rs.890,000',
    image: '/images/pakistani-fashion/stock-8.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-mira',
    name: 'Mira',
    priceDisplay: 'Rs.910,000',
    image: '/images/pakistani-fashion/stock-9.jpg',
    href: '/shop',
  },
  {
    id: 'bridal-laila',
    name: 'Laila',
    priceDisplay: 'Rs.940,000',
    image: '/images/pakistani-fashion/stock-10.jpg',
    href: '/shop',
  },
];
