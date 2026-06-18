import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';

const COLLECTION_NAMES = [
  'Kurti',
  'Freshi Shalwar',
  'Full Dress',
  'Cutomized Dress',
];

/** Masonry tiles on home — paths under /public */
export const ImagesMansory = PAKISTANI_FASHION.masonry.map((src, id) => ({
  src,
  height: [400, 520, 480, 360][id] ?? 400,
  name: COLLECTION_NAMES[id % COLLECTION_NAMES.length],
  id,
}));
