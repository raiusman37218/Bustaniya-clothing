import { MOCK_PRODUCTS } from "@/src/data/mockProducts";
import { getImages } from "@/src/lib/utilits/apImages";
import { createCatalogSupabase } from "@/src/lib/supabase/service";

export const getSingleproduct = async (id: string) => {
  const data = await getImages();
  const singleProduct =
    data.find((product) => product.id.toString() === id) ??
    MOCK_PRODUCTS.find((product) => product.id.toString() === id) ??
    null;

  if (singleProduct) {
    try {
      const supabase = createCatalogSupabase();
      const { data: invData, error } = await supabase
        .from('inventory')
        .select('stock_quantity')
        .eq('product_id', id)
        .maybeSingle();

      if (!error && invData) {
        singleProduct.stock_quantity = invData.stock_quantity ?? 0;
      } else {
        // Fallback for mock products or products without inventory records
        singleProduct.stock_quantity = 4;
      }
    } catch (e) {
      console.error('Failed to fetch inventory:', e);
      singleProduct.stock_quantity = 4;
    }
  }

  return { singleProduct };
};
