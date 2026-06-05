import { MOCK_PRODUCTS } from "@/src/data/mockProducts";
import { getImages } from "@/src/lib/utilits/apImages";

export const getSingleproduct = async (id: string) => {
  const data = await getImages();
  const singleProduct =
    data.find((product) => product.id.toString() === id) ??
    MOCK_PRODUCTS.find((product) => product.id.toString() === id) ??
    null;
  return { singleProduct };
};
