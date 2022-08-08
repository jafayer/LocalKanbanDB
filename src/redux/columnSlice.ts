import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ColumnType, CardType } from "../utils/definitions";

export interface CounterState {
  value: ColumnType[];
}

const initialState: CounterState = {
  value: [],
};

export const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    addColumns: (state, action: PayloadAction<ColumnType[]>) => {
      // only ids that are not in the state
      const toPush = action.payload.filter(
        (column) => !state.value.some((c) => c.id === column.id)
      );
      state.value.push(...toPush);
    },
    removeColumn: (state, action: PayloadAction<ColumnType>) => {
      state.value = state.value.filter(
        (column) => column.id !== action.payload.id
      );
    },
    clearColumns: (state) => {
      state.value = [];
    },

    setColumns: (state, action: PayloadAction<ColumnType[]>) => {
      state.value = action.payload;
    },

    updateColumn: (state, action: PayloadAction<ColumnType>) => {
      const index = state.value.findIndex(
        (column) => column.id === action.payload.id
      );
      state.value[index] = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addColumns,
  removeColumn,
  setColumns,
  clearColumns,
  updateColumn,
} = columnSlice.actions;

export default columnSlice.reducer;
