'use client';

import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/src/app/store';
import { addCart, openCart } from '@/src/featuers/cart/cartSlice';
import { Product } from '@/src/types/productTypes';
import { buildCartItemFromProduct } from '@/src/utils/buildCartItem';

export default function useAddToCart() {
  const dispatch = useDispatch<AppDispatch>();

  const addToCart = (product: Product, size?: string) => {
    if (product.product_instock === false) {
      toast.error(`${product.product_name} is out of stock.`);
      return;
    }
    const cartItem = buildCartItemFromProduct(product);
    if (size) {
      cartItem.size = size;
    }
    dispatch(addCart(cartItem));
    dispatch(openCart());
  };

  return { addToCart };
}
