import Image from 'next/image';

import { PAKISTANI_FASHION } from '@/src/data/pakistaniFashionImages';

export default function CollectionImageBannerMobile() {
  return (
    <Image
      src={PAKISTANI_FASHION.collectionBanner}
      style={{ width: '100%', objectFit: 'cover' }}
      width={600}
      height={600}
      alt="Pakistani shalwar kameez collection"
      quality={100}
      sizes="100vw"
    />
  );
}
