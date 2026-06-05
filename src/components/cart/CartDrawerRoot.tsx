'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/app/store';
import { setCartItems } from '@/src/featuers/cart/cartSlice';
import { getProduct } from '@/src/featuers/product/productSlice';
import { resolveCartImageUrl } from '@/src/lib/products/productImages';
import type { CartItem } from '@/src/types/CartItemTypes';
import SideCartDrawer from './SideCartDrawer';

export default function CartDrawerRoot() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const stored = localStorage.getItem('cartItem');
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItem[];
        const migrated = items.map((item) => ({
          ...item,
          image: resolveCartImageUrl(item.image),
        }));
        dispatch(setCartItems(migrated));
        if (JSON.stringify(migrated) !== stored) {
          localStorage.setItem('cartItem', JSON.stringify(migrated));
        }
      } catch {
        localStorage.removeItem('cartItem');
      }
    }
    dispatch(getProduct());
  }, [dispatch]);

  return <SideCartDrawer />;
}
