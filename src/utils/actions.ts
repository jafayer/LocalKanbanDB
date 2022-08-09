import { generateNewCard, generateNewColumn } from "./generate";
import { BoardType, ColumnType } from "./definitions";
import { updateExistingBoard } from "./generate";
// function generates a new column,
// adds it to activeBoard, and returns the
// updated board
export function createNewColumn(
  activeBoard: BoardType
): [{ [key: string]: ColumnType[] }, BoardType] {
  const newColumn = generateNewColumn(activeBoard.columns.length || 0);

  // update board with new column
  // update ActiveBoard to push new column into the board
  const propsToUpdate = {
    columns: [...activeBoard!.columns, newColumn],
  };
  const updatedActiveBoard: BoardType = updateExistingBoard(
    activeBoard,
    propsToUpdate
  );

  return [propsToUpdate as { [key: string]: ColumnType[] }, updatedActiveBoard];
}

export function deleteColumn(
  activeBoard: BoardType,
  columnToDelete: ColumnType
): [{ [key: string]: ColumnType[] }, BoardType] {
  const propsToUpdate = {
    columns: activeBoard.columns.filter(
      (column) => column.id !== columnToDelete.id
    ),
  };
  const updatedActiveBoard: BoardType = updateExistingBoard(
    activeBoard,
    propsToUpdate
  );

  return [propsToUpdate as { [key: string]: ColumnType[] }, updatedActiveBoard];
}

export function createNewCard(
  activeBoard: BoardType,
  columnToAddTo: ColumnType
): [{ [key: string]: ColumnType[] }, BoardType] {
  const newCard = generateNewCard(columnToAddTo.cards.length || 0);

  const propsToUpdate = {
    columns: activeBoard.columns.map((column) => {
      if (column.id === columnToAddTo.id) {
        return {
          ...column,
          cards: [...column.cards, newCard],
        };
      }
      return column;
    }),
  };

  const updatedActiveBoard: BoardType = updateExistingBoard(
    activeBoard,
    propsToUpdate
  );

  return [propsToUpdate as { [key: string]: ColumnType[] }, updatedActiveBoard];
}
