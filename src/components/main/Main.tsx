import { useState, useEffect } from "react";

import { ColumnType, BoardType } from "../../utils/definitions";
import { Column } from "./column";
import {
  asyncAddItem,
  asyncGetAllColumns,
  asyncDeleteItem,
} from "../../utils/db";
import { generateNewColumn, updateExistingBoard } from "../../utils/generate";
import { useDispatch, useSelector } from "react-redux";
import { addColumn, removeColumn } from "../../redux/columnSlice";
import { updateBoard } from "../../redux/boardSlice";
import { asyncUpdateBoard } from "../../utils/db";
import { RootState } from "../../store";
import { ClipLoader } from "react-spinners";

function Main(props: { [key: string]: any }): JSX.Element {
  const dispatch = useDispatch();

  const boards = useSelector((state: RootState) => state.boards.value);

  const activeBoardId = useSelector(
    (state: RootState) => state.activeBoard.value
  );

  const activeBoard = activeBoardId
    ? boards.find((board: BoardType) => board.id === activeBoardId)
    : null;

  const allColumns = useSelector((state: RootState) => state.columns.value);
  const columns = selectColumnsToRender(allColumns, activeBoard!);

  if (!columns) {
    return (
      <ClipLoader
        color="#5046e4"
        size="50px"
        cssOverride={{
          justifySelf: "center",
          alignSelf: "center",
          margin: "auto",
        }}
      />
    );
  } else {
    return (
      <div className="main bg-slate-50 flex-1 h-full flex flex-col">
        <div className="w-full bg-indigo-700 text-white p-5">
          <h1>{activeBoard?.name}</h1>
        </div>
        <div className="columns flex flex-1 pl-7">
          <div className="columns w-0 flex flex-1 overflow-x-scroll items-center pl-7 pr-3">
            {columns.map((column: any) => {
              return (
                <Column
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
                  key={column.id}
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
  }

  async function handleNewColumn() {
    const newColumn = generateNewColumn(columns.length);
    console.log("Generating new column!", newColumn);
    // add to indexedDB
    await asyncAddItem(newColumn, "columns");
    // console.log("Added to indexedDB");
    // add to redux
    dispatch(addColumn([newColumn]));

    // update ActiveBoard to push new column into the board
    const propsToUpdate = {
      columns: [...activeBoard!.columns, newColumn.id],
    };
    const updatedActiveBoard: BoardType = updateExistingBoard(
      activeBoard!,
      propsToUpdate
    );

    console.log({ newColumn, propsToUpdate, activeBoard, updatedActiveBoard });

    // update parent board in indexedDB
    await asyncUpdateBoard(updatedActiveBoard);
    // update parent board in redux
    dispatch(updateBoard(updatedActiveBoard));
  }

  function selectColumnsToRender(
    allColumns: ColumnType[],
    activeBoard: BoardType | null
  ) {
    if (activeBoard) {
      return allColumns
        .filter((column: ColumnType) => {
          return activeBoard.columns.includes(column.id);
        })
        .sort((a: ColumnType, b: ColumnType) => {
          return a.order - b.order;
        });
    } else {
      return [];
    }
  }
}

export default Main;
