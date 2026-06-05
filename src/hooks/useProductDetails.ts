import { useState } from 'react';
import useProductItems from './useProductItems';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function useProductDetails() {
  const { shopsItem } = useProductItems();
  const [counts, setCounts] = useState(() => shopsItem.map(() => 0));

  const handleChangeHandle = (index: number) => {
    setCounts((preview) =>
      preview.map((count, i) => (i === index ? count + 1 : count)),
    );
  };

  const handleChangeHandleMinus = (index: number) => {
    setCounts((preview) =>
      preview.map((count, i) => {
        if (i !== index) return count;
        const lineQty = Math.max(1, count + (shopsItem[i]?.quantity ?? 1));
        if (lineQty <= 1) return count;
        return count - 1;
      }),
    );
  };

  const itemsEl = shopsItem.map(
    (item, index) => Math.max(1, counts[index] + item.quantity),
  );
  const Tax = useSelector((store: RootState) => store.cart.Tax);
  const total = shopsItem
    .map((item, index) => Number(item.price) * Math.max(1, counts[index] + item.quantity))
    .reduce((acc, cur) => acc + cur, 0);
  const Order = Number(Tax) + Number(total);

  return {
    itemsEl,
    Tax,
    total,
    Order,
    handleChangeHandle,
    handleChangeHandleMinus,
    counts,
  };
}
