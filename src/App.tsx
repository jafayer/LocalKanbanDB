import { EffectCallback, useEffect, useState } from "react";
import "./App.css";
import "./index.css";

import { BoardType, ColumnType, CardType } from "./utils/definitions";
import {
  asyncGetAllBoards,
  asyncGetAllCards,
  asyncGetAllColumns,
} from "./utils/db";
//@ts-ignore
import Sidebar from "./components/sidebar/Sidebar";
//@ts-ignore
import Main from "./components/main/Main";
//@ts-ignore

import { useSelector, useDispatch } from "react-redux";

import { addBoard, removeBoard } from "./redux/boardSlice";
import { addColumn, removeColumn } from "./redux/columnSlice";
import { addCard, removeCard } from "./redux/cardSlice";
import { setActiveBoard } from "./redux/activeBoardSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    asyncGetAllBoards()
      .then((boardsData: BoardType[]) => {
        // boards is data from db
        console.log({ boardsData });
        // sort boardsData by Order
        const sortedBoardsData = boardsData.sort((a, b) => {
          return a.order - b.order;
        });

        dispatch(addBoard(sortedBoardsData));
        // find board with lowest order number and set as active board
        const activeBoard = boardsData.reduce(
          (prev: BoardType, curr: BoardType) =>
            prev.order < curr.order ? prev : curr
        );
        dispatch(setActiveBoard(activeBoard.id));
      })
      .then(() => {
        return asyncGetAllColumns();
      })
      .then((columnsData: ColumnType[]) => {
        console.log({ columnsData });
        dispatch(addColumn(columnsData));
      })
      .then(() => {
        return asyncGetAllCards();
      })
      .then((cardsData: CardType[]) => {
        console.log({ cardsData });
        dispatch(addCard(cardsData));
      });
  });
  return (
    <div className="App">
      <Sidebar />
      <Main />
    </div>
  );
}

export default App;
