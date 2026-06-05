import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/app/store';
import { RemoveItem } from '@/src/featuers/cart/cartSlice';
import { CartItem } from '@/src/types/CartItemTypes';

export default function useProductItems() {
  const shopsItem = useSelector((store: RootState) => store.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = (item: CartItem | string) => {
    if (typeof item === 'string') {
      const found = shopsItem.find((i) => i.id === item);
      if (!found) return;
      dispatch(
        RemoveItem({
          id: found.id,
          color: found.color ?? '',
          size: found.size,
        }),
      );
      return;
    }
    dispatch(
      RemoveItem({
        id: item.id,
        color: item.color ?? '',
        size: item.size,
      }),
    );
  };

  return { shopsItem, handleRemove };
}
