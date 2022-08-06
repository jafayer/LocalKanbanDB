import { BoardType, ColumnType, CardType } from "./definitions";

export function generateUniqueID(type: "boards" | "columns" | "cards"): string {
  // should return hexadecimal string of length 16 preceeded by the first letter of type
  return type[0] + Math.random().toString(16).slice(2);
}

export function generateNewBoard(order: number): BoardType {
  return {
    id: generateUniqueID("boards"),
    name: "New Board",
    order,
    createdAt: new Date().getTime(),
    updatedAt: null,
    columns: [],
    archived: false,
  };
}

export function updateExistingBoard(
  board: BoardType,
  propsToUpdate: { [key: string]: any }
): BoardType {
  return {
    ...board,
    ...propsToUpdate,
    updatedAt: new Date().getTime(),
  };
}

export function generateNewColumn(order: number): ColumnType {
  return {
    id: generateUniqueID("columns"),
    name: "New Column",
    order,
    createdAt: new Date().getTime(),
    updatedAt: null,
    cards: [],
    archived: false,
  };
}

export function generateNewCard(order: number): CardType {
  return {
    id: generateUniqueID("cards"),
    title: "New Card",
    description: "",
    order,
    customFields: [],
    createdAt: new Date().getTime(),
    updatedAt: null,
    archived: false,
  };
}
