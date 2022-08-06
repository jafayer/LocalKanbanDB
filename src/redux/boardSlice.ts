import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BoardType, ColumnType, CardType } from "../utils/definitions";

export interface CounterState {
  value: BoardType[];
}

const initialState: CounterState = {
  value: [],
};

export const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<BoardType[]>) => {
      // only ids that are not in the state
      const toPush = action.payload.filter(
        (board) => !state.value.some((b) => b.id === board.id)
      );
      state.value.push(...toPush);
    },
    removeBoard: (state, action: PayloadAction<BoardType>) => {
      state.value = state.value.filter(
        (board) => board.id !== action.payload.id
      );
    },
    updateBoard: (state, action: PayloadAction<BoardType>) => {
      const index = state.value.findIndex(
        (board) => board.id === action.payload.id
      );

      state.value[index] = action.payload;

      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addBoard, removeBoard, updateBoard } = boardSlice.actions;

export default boardSlice.reducer;
