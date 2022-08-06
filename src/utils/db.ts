import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import { BoardType, ColumnType, CardType, versions } from "./definitions";

export const kanbanDBPromise = openDB("localKanbanDB", versions.board, {
  upgrade(db) {
    db.createObjectStore("boards", {
      autoIncrement: true,
    });
    db.createObjectStore("columns", {
      autoIncrement: true,
    });
    db.createObjectStore("cards", {
      autoIncrement: true,
    });
  },
});

export function dropDB() {
  return deleteDB("localKanbanDB");
}

export async function asyncGetAllBoards(): Promise<Array<BoardType>> {
  const db = await kanbanDBPromise;
  const tx = db.transaction("boards");
  const store = tx.objectStore("boards");
  const result = await store.getAll();
  return result;
}

export async function asyncGetAllColumns(): Promise<Array<ColumnType>> {
  const db = await kanbanDBPromise;
  const tx = db.transaction("columns");
  const store = tx.objectStore("columns");
  const result = await store.getAll();
  return result;
}

export async function asyncGetAllCards(): Promise<Array<CardType>> {
  const db = await kanbanDBPromise;
  const tx = db.transaction("cards");
  const store = tx.objectStore("cards");
  const result = await store.getAll();
  return result;
}

export async function asyncGetElementById(
  id: number,
  type: "boards" | "columns" | "cards"
): Promise<BoardType | ColumnType | CardType> {
  const db = await kanbanDBPromise;
  const tx = db.transaction(type);
  const store = tx.objectStore(type);
  const result = await store.get(id);
  return result;
}

export async function asyncUpdateBoard(board: BoardType) {
  const db = await kanbanDBPromise;
  const tx = db.transaction("boards", "readwrite");
  const store = tx.objectStore("boards");
  const result = await store.put(board, board.id);
  return result;
}

export async function asyncAddItem(
  item: BoardType | ColumnType | CardType,
  type: "boards" | "columns" | "cards"
): Promise<IDBValidKey> {
  console.log({ item, type });
  const db = await kanbanDBPromise;
  const tx = db.transaction(type, "readwrite");
  const store = tx.objectStore(type);
  const result = await store.add(item, item.id);
  return result;
}

export async function asyncDeleteItem(
  object: BoardType | ColumnType | CardType,
  type: "boards" | "columns" | "cards"
): Promise<void> {
  const db = await kanbanDBPromise;
  const tx = db.transaction(type, "readwrite");
  const store = tx.objectStore(type);
  const result = await store.delete(object.id);
  return result;
}
