import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  price: string;
  color: string | undefined;
  size: string;
}

interface CartState {
  items: CartItem[];
  Tax: number;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: [],
  Tax: 0,
  isCartOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size,
      );
      if (index !== -1) {
        state.items[index].quantity =
          state.items[index].quantity + action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem('cartItem', JSON.stringify(state.items));
    },
    RemoveItem: (
      state,
      action: PayloadAction<{ id: string; color: string; size: string }>,
    ) => {
      const RemoveItem = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.color === action.payload.color &&
            item.size === action.payload.size
          ),
      );
      state.items = RemoveItem;

      localStorage.setItem('cartItem', JSON.stringify(RemoveItem));
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        color: string | undefined;
        size: string;
        quantity: number;
      }>,
    ) => {
      const { id, color, size, quantity } = action.payload;
      const index = state.items.findIndex(
        (item) =>
          item.id === id && item.color === color && item.size === size,
      );
      if (index === -1) return;

      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
      localStorage.setItem('cartItem', JSON.stringify(state.items));
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cartItem', JSON.stringify([]));
    },
  },
});

export const {
  addCart,
  RemoveItem,
  setCartItems,
  updateItemQuantity,
  openCart,
  closeCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
