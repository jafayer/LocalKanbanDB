import { EffectCallback, useEffect, useState } from "react";
import "./App.css";
import "./index.css";

import { BoardType, ColumnType, CardType } from "./utils/definitions";
import {
  asyncGetAllItems,
  asyncAddItem,
  asyncGetItems,
  asyncUpdateItem,
  clearEntireDatabase,
  subscribeToQuery,
  subscribeToCollection,
  asyncDeleteItem,
} from "./utils/db";
import { generateNewBoard } from "./utils/generate";
//@ts-ignore
import Sidebar from "./components/sidebar/Sidebar";
//@ts-ignore
import Main from "./components/main/Main";
//@ts-ignore

import { useSelector, useDispatch, RootState } from "react-redux";

import { addBoard, removeBoard } from "./redux/boardSlice";
import { addColumns, clearColumns, setColumns } from "./redux/columnSlice";
import { addCard, removeCard } from "./redux/cardSlice";
import { setActiveBoard } from "./redux/activeBoardSlice";
import { setLoading } from "./redux/loadingSlice";
import { kanbanDB } from "./utils/db";

function App() {
  const dispatch = useDispatch();

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  asyncGetAllItems("boards")
    .then((boards: any) => {
      const ordered =
        boards.sort((a: BoardType, b: BoardType) => a.order - b.order) || [];

      dispatch(addBoard(boards));

      // sort boards by least to greatest order
      const activeBoard = ordered ? ordered[0] : null;

      dispatch(setActiveBoard(activeBoard));
    })
    .then(() => {
      dispatch(setLoading(false));
    });

  return (
    <div className="App">
      {!isLoading && (
        <>
          <Sidebar />
          <Main />
        </>
      )}
    </div>
  );
}

export default App;
