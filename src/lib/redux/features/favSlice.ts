import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

type favType = {
  favItems: any[];
  favQuantity: number;
};

const initialFavItems =
  typeof window !== "undefined" && localStorage.getItem("favItems")
    ? JSON.parse(localStorage.getItem("favItems")!)
    : [];

const initialState: favType = {
  favItems: initialFavItems,
  favQuantity: 0,
};

const favSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFav: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.favItems.find((item) => item.id === id);
      if (!existingItem) {
        state.favItems.push({ ...action.payload, cartQuantity: 1 });
        toast.success(`${action.payload.title} added to favorites`, {
          position: "top-left",
          autoClose: 2000,
        });
      }
      // Update the LocalStorage
      localStorage.setItem("favItems", JSON.stringify(state.favItems));
    },
    removeFromFav: (state, action) => {
      const { id } = action.payload;
      const itemIndex = state.favItems.findIndex(
        (favItem) => favItem.id === id
      );

      if (itemIndex !== -1) {
        state.favItems[itemIndex];
        state.favItems.splice(itemIndex, 1);
        toast.warning(`${action.payload.title} removed from favorites`, {
          position: "top-left",
          autoClose: 2000,
        });
      }

      // Update the LocalStorage
      localStorage.setItem("favItems", JSON.stringify(state.favItems));
    },
  },
});

export const { addToFav, removeFromFav } = favSlice.actions;

export default favSlice.reducer;
