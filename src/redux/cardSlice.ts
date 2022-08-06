import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CardType } from "../utils/definitions";

export interface CounterState {
  value: CardType[];
}

const initialState: CounterState = {
  value: [],
};

export const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<CardType[]>) => {
      // only ids that are not in the state
      const toPush = action.payload.filter(
        (card) => !state.value.some((c) => c.id === card.id)
      );
      state.value.push(...toPush);
    },
    removeCard: (state, action: PayloadAction<CardType>) => {
      state.value = state.value.filter((card) => card.id !== action.payload.id);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCard, removeCard } = cardSlice.actions;

export default cardSlice.reducer;
