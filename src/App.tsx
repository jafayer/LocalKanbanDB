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
      dispatch(addBoard(boards));

      // sort boards by least to greatest order
      const activeBoard = boards.sort(
        (a: BoardType, b: BoardType) => b.order - a.order
      )[0];
      dispatch(setActiveBoard(activeBoard));
      return asyncGetItems("columns", activeBoard.columns);
    })
    .then((columns: any) => {
      dispatch(setColumns(columns));
    })
    .then(() => {
      dispatch(setLoading(false));
    });

  // const boards = useSelector((state: RootState) => state.boards.value) || [];

  // asyncGetAllItems("boards")
  //   .then((boards) => boards.sort((a, b) => a.order - b.order))
  //   .then((boards: any) => {
  //     dispatch(setActiveBoard(boards[0].id));
  //     dispatch(addBoard(boards));

  //     return asyncGetItems("columns", boards[0].columns as string[]);
  //   })
  //   .then((activeColumns: any) => {
  //     console.log(activeColumns);
  //     dispatch(clearColumns());
  //     dispatch(addColumns(activeColumns));
  //   });

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
