import { getImages } from '@/src/lib/utilits/apImages';
import { Product } from '@/src/types/productTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface wishlistType {
  wishListItem: Product[];
  loading: boolean;
  error: boolean;
}

const initialState: wishlistType = {
  wishListItem: [],
  loading: true,
  error: false,
};

export const wishListSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishList: (state, action: PayloadAction<Product>) => {
      const ItemIndex = state.wishListItem.findIndex(
        (item) => item.id === action.payload.id,
      );

      if (ItemIndex >= 0) {
        return;
      } else {
        state.wishListItem.push(action.payload);
        localStorage.setItem(
          'wishlistItem',
          JSON.stringify(state.wishListItem),
        );
      }
    },

    wishItems: (state, action: PayloadAction<Product[]>) => {
      state.wishListItem = action.payload;
      state.loading = false;
    },
    removeFromWishList: (state, action: PayloadAction<string>) => {
      state.wishListItem = state.wishListItem.filter(
        (item) => item.id !== action.payload,
      );
      localStorage.setItem(
        'wishlistItem',
        JSON.stringify(state.wishListItem),
      );
    },
  },
});

export const { addToWishList, wishItems, removeFromWishList } =
  wishListSlice.actions;
export default wishListSlice.reducer;
