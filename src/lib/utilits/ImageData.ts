import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';

/** Masonry tiles on home — paths under /public */
export const ImagesMansory = PAKISTANI_FASHION.masonry.map((src, id) => ({
  src,
  height: [400, 520, 480, 360][id] ?? 400,
  name: 'Shop',
  id,
}));
