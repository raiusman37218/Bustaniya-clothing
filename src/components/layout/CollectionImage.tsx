import Image from "next/image";
import { PAKISTANI_FASHION } from "@/src/data/pakistaniFashionImages";

const CollectionImageBanner = () => {
  return (
    <Image
      src={PAKISTANI_FASHION.collectionBanner}
      width={1920}
      height={600}
      style={{ objectFit: "cover", width: "100%", height: "auto" }}
      alt="Pakistani shalwar kameez collection banner"
    />
  );
};

export default CollectionImageBanner;
