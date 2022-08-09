import { useState, useEffect } from "react";

import { ColumnType, BoardType } from "../../utils/definitions";
import { Column } from "./Column";
import { asyncAddItem, asyncGetItems, asyncDeleteItem } from "../../utils/db";
import { generateNewColumn, updateExistingBoard } from "../../utils/generate";
import { useDispatch, useSelector } from "react-redux";
import {
  addColumns,
  removeColumn,
  setColumns,
  updateColumn,
} from "../../redux/columnSlice";
import { updateBoard } from "../../redux/boardSlice";
import { asyncUpdateItem } from "../../utils/db";
import { RootState } from "../../store";

import { createNewColumn } from "../../utils/actions";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function Main(props: { [key: string]: any }): JSX.Element {
  const dispatch = useDispatch();

  const activeBoardId = useSelector(
    (state: RootState) => state.activeBoard.value
  );

  const boards = useSelector((state: RootState) => state.boards.value);

  const activeBoard = boards.find((board) => board.id === activeBoardId);

  const columns = activeBoard?.columns;

  return (
    <div className="main bg-slate-50 flex-1 h-full flex flex-col">
      <div className="w-full bg-indigo-700 text-white p-5">
        <h1>{activeBoard?.name}</h1>
      </div>
      <div className="columns flex flex-1 pl-7">
        <div className="columns w-0 flex flex-1 overflow-x-scroll items-center pl-7 pr-3">
          <DndProvider backend={HTML5Backend}>
            {columns &&
              columns.map((column: any) => {
                return (
                  <Column
                    key={column.id}
                    columnData={{
                      id: column.id,
                      name: column.name,
                      cards: column.cards,
                      order: column.order,
                      createdAt: column.createdAt,
                      updatedAt: column.updatedAt,
                      archived: column.archived,
                    }}
                    cards={column.cards}
                    name={column.name}
                  />
                );
              })}
          </DndProvider>
        </div>
        <div className="m-3 self-center">
          <button
            className="bg-indigo-500 text-white p-3 rounded-lg m-auto self-center disabled:bg-slate-400 cursor:cancel"
            onClick={handleNewColumn}
            disabled={!activeBoard}
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );

  async function handleNewColumn() {
    const [propsToUpdate, updatedBoard] = createNewColumn(
      activeBoard as BoardType
    );

    console.log({ activeBoard, updatedBoard });
    dispatch(updateBoard(updatedBoard));
    await asyncUpdateItem("boards", activeBoard!.id, propsToUpdate);
  }
}

export default Main;
