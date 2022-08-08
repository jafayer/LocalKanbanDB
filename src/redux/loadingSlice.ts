import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoardType, ColumnType, CardType } from "../utils/definitions";

export interface LoadingState {
  value: boolean;
}

const initialState: LoadingState = {
  value: true,
};

export const loadingSlice = createSlice({
  name: "loadingState",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
