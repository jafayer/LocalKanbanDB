import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoardType, ColumnType, CardType } from "../utils/definitions";
export interface ActiveBoardState {
  value: string | null;
}

const initialState: ActiveBoardState = {
  value: null,
};

export const setActiveBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<BoardType>) => {
      state.value = action.payload.id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActiveBoard } = setActiveBoardSlice.actions;

export default setActiveBoardSlice.reducer;
