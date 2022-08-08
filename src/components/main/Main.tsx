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
import { ClipLoader } from "react-spinners";

function Main(props: { [key: string]: any }): JSX.Element {
  const dispatch = useDispatch();

  const activeBoard = useSelector(
    (state: RootState) => state.activeBoard.value
  );

  const columns = useSelector((state: RootState) => state.columns.value);

  console.log(columns);
  return (
    <div className="main bg-slate-50 flex-1 h-full flex flex-col">
      <div className="w-full bg-indigo-700 text-white p-5">
        <h1>{activeBoard?.name}</h1>
      </div>
      <div className="columns flex flex-1 pl-7">
        <div className="columns w-0 flex flex-1 overflow-x-scroll items-center pl-7 pr-3">
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
                  handleDeleteColumn={handleDeleteColumn}
                />
              );
            })}
        </div>
        <div className="m-3 self-center">
          <button
            className="bg-indigo-500 text-white p-3 rounded-lg m-auto self-center"
            onClick={handleNewColumn}
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );

  async function handleDeleteColumn(column: ColumnType) {
    dispatch(removeColumn(column));
    await asyncDeleteItem("columns", column.id);
  }

  async function handleNewColumn() {
    const newColumn = generateNewColumn(columns.length);
    // add to indexedDB
    await asyncAddItem("columns", newColumn);
    // console.log("Added to indexedDB");
    // add to redux
    dispatch(addColumns([newColumn]));

    // update ActiveBoard to push new column into the board
    const propsToUpdate = {
      columns: [...activeBoard!.columns, newColumn.id],
    };
    const updatedActiveBoard: BoardType = updateExistingBoard(
      activeBoard!,
      propsToUpdate
    );

    console.log({ newColumn, propsToUpdate, activeBoard });

    // update parent board in indexedDB
    await asyncUpdateItem("boards", activeBoard!.id, propsToUpdate);
    // update parent board in redux
    dispatch(updateBoard(updatedActiveBoard));
  }
}

export default Main;
