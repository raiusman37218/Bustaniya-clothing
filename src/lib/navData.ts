import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';

const nav = PAKISTANI_FASHION.nav;

export const NAV_DATA = [
  {
    name: "Collection",
    id: 1,
    category: [
      "Shop All",
      "Boluses & Top",
      "Pants",
      "Dresses & Jumpsuits",
      "Outwear & Jackets",
      "pullovers",
      "Tees",
      "Shorts & Skirts",
    ],
    featured: ["New In", "Bustaniya Week", "Plus Size", "Best Seller"],
    More: ["Bundles", "Occasion Wear", "Matching Set", "Suiting"],
    nameCat: "Category",
    nameFeat: "Featured ",
    nameMore: "More",
    imageData: [nav[0], nav[1]],
    imageDescription: ["Shalwar Kameez", "Plus Size"],
  },
  {
    name: "New In",
    id: 2,
    category: [
      "Shop All",
      "Tops & Blouses",
      "Tees",
      "Pants",
      "Jackets & Outwears",
      "Pullovers",
      "Dresses & Jumpsuits",
      "Shorts & Skirts",
    ],
    featured: ["Plus Size", "Fall Collection", "Bustaniya Week"],

    nameCat: "Category",
    nameFeat: "Trending ",
    imageData: [nav[2], nav[3], nav[4]],
    imageDescription: ["Eid Collection", "Lawn Suits", "Festive Wear"],
  },
  {
    name: "Bustaniya Week",
    id: 3,
    category: [
      "Shop All",
      "Tops & Blouses",
      "Tees",
      "Pants",
      "Jackets & Outwears",
      "Pullovers",
      "Dresses & Jumpsuits",
      "Shorts & Skirts",
    ],
    nameCat: "Category",
    nameFeat: "Trending ",
    imageData: [nav[5], nav[6]],
    imageDescription: ["Embroidered", "Bridal Lawn"],
  },
  {
    name: "Plus Size",
    id: 4,
    category: [
      "Shop All",
      "Tops & Blouses",
      "Tees",
      "Pants",
      "Jackets & Outwears",
      "Pullovers",
      "Dresses & Jumpsuits",
      "Shorts & Skirts",
    ],
    nameCat: "Category",
    imageData: [nav[7], nav[8], nav[9]],
    imageDescription: ["Formal Suit", "Pink Edit", "Classic Grey"],
  },
  {
    name: "Sustainability",
    id: 5,
    category: [
      "Mission",
      "Processing",
      "Materials",
      "Packaging",
      "Product Care",
      "Our Suppliers",
    ],
    nameCat: "Sustainability ",
    imageData: [nav[10], nav[11]],
  },
];
