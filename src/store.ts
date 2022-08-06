import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./redux/boardSlice";
import columnSlice from "./redux/columnSlice";
import cardSlice from "./redux/cardSlice";
import activeBoardSlice from "./redux/activeBoardSlice";

export const store = configureStore({
  reducer: {
    boards: boardSlice,
    columns: columnSlice,
    cards: cardSlice,
    activeBoard: activeBoardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
