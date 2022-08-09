import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import {
  BoardType,
  boardSchema,
  ColumnType,
  columnSchema,
  CardType,
  cardSchema,
  KbDatabase,
} from "./definitions";

import { createRxDatabase, addRxPlugin, RxDocumentBase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { $CombinedState } from "@reduxjs/toolkit";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

addRxPlugin(RxDBUpdatePlugin);

export const kanbanDB: KbDatabase = await createRxDatabase<KbDatabase>({
  name: "LocalKanbanDB2",
  storage: getRxStorageDexie(),
});

await kanbanDB.addCollections({
  boards: {
    schema: boardSchema,
  },
  columns: {
    schema: columnSchema,
  },
  cards: {
    schema: cardSchema,
  },
});

export async function asyncGetAllItems(
  type: "boards" | "columns" | "cards"
): Promise<(BoardType | ColumnType | CardType)[]> {
  return await kanbanDB[type]
    .find()
    .exec()
    .then((items) =>
      items.map((item) => item.toJSON() as BoardType | ColumnType | CardType)
    );
}

export async function asyncGetItems(
  type: "boards" | "columns" | "cards",
  ids: string[]
): Promise<(BoardType | ColumnType | CardType)[]> {
  return await kanbanDB[type]
    .find({ selector: { id: { $in: ids } } })
    .exec()
    .then((items) =>
      items.map((item) => item.toJSON() as BoardType | ColumnType | CardType)
    );
}

export function asyncGetItems(
  type: "boards",
  ids: string[]
): Promise<BoardType[]>;
export function asyncGetItems(
  type: "columns",
  ids: string[]
): Promise<ColumnType[]>;
export function asyncGetItems(
  type: "cards",
  ids: string[]
): Promise<CardType[]>;

export async function asyncAddItem(
  type: "boards" | "columns" | "cards",
  item: any
) {
  return await kanbanDB[type].insert(item);
}

export async function asyncUpdateItem(
  type: "boards" | "columns" | "cards",
  id: string,
  updatedValues: { [key: string]: any }
) {
  const query = kanbanDB[type].find({
    selector: {
      id,
    },
  });

  return await query.update({
    $set: updatedValues,
  });
}

export async function asyncDeleteItem(
  type: "boards" | "columns" | "cards",
  id: string
) {
  const query = kanbanDB[type].find({
    selector: {
      id,
    },
  });

  return await query.remove();
}

export function clearEntireDatabase() {
  return Promise.all([
    kanbanDB.boards.remove(),
    kanbanDB.columns.remove(),
    kanbanDB.cards.remove(),
  ]);
}

export function subscribeToQuery(
  type: "boards" | "columns" | "cards",
  ids: string[]
) {
  const query = kanbanDB[type].find({
    selector: {
      id: { $in: ids },
    },
  });

  return query.$.subscribe;
}

export function subscribeToCollection(type: "boards" | "columns" | "cards") {
  const query = kanbanDB[type].find();

  return query.$.subscribe;
}

// export async function updateBoard(board: BoardType) {
//   const query = kanbanDB.boards.find({
//     selector: { id: board.id },
//   })
//   return await kanbanDB.boards.update(board);
// }

// export async function deleteBoard(id: string) {
//   return await kanbanDB.boards.remove({ id });
// }

// export async function getAllColumns() {
//   return await kanbanDB.columns.find().exec();
// }

// export const kanbanDBPromise = openDB("localKanbanDB", versions.board, {
//   upgrade(db) {
//     db.createObjectStore("boards", {
//       autoIncrement: true,
//     });
//     db.createObjectStore("columns", {
//       autoIncrement: true,
//     });
//     db.createObjectStore("cards", {
//       autoIncrement: true,
//     });
//   },
// });

// export function dropDB() {
//   return deleteDB("localKanbanDB");
// }

// export async function asyncGetAllBoards(): Promise<Array<BoardType>> {
//   const db = await kanbanDBPromise;
//   const tx = db.transaction("boards");
//   const store = tx.objectStore("boards");
//   const result = await store.getAll();
//   return result;
// }

// export async function asyncGetAllColumns(): Promise<Array<ColumnType>> {
//   const db = await kanbanDBPromise;
//   const tx = db.transaction("columns");
//   const store = tx.objectStore("columns");
//   const result = await store.getAll();
//   return result;
// }

// export async function asyncGetAllCards(): Promise<Array<CardType>> {
//   const db = await kanbanDBPromise;
//   const tx = db.transaction("cards");
//   const store = tx.objectStore("cards");
//   const result = await store.getAll();
//   return result;
// }

// export async function asyncGetElementById(
//   id: number,
//   type: "boards" | "columns" | "cards"
// ): Promise<BoardType | ColumnType | CardType> {
//   const db = await kanbanDBPromise;
//   const tx = db.transaction(type);
//   const store = tx.objectStore(type);
//   const result = await store.get(id);
//   return result;
// }

// export async function asyncUpdateBoard(board: BoardType) {
//   const db = await kanbanDBPromise;
//   const tx = db.transaction("boards", "readwrite");
//   const store = tx.objectStore("boards");
//   const result = await store.put(board, board.id);
//   return result;
// }

// export async function asyncAddItem(
//   item: BoardType | ColumnType | CardType,
//   type: "boards" | "columns" | "cards"
// ): Promise<IDBValidKey> {
//   console.log({ item, type });
//   const db = await kanbanDBPromise;
//   const tx = db.transaction(type, "readwrite");
//   const store = tx.objectStore(type);
//   const result = await store.add(item, item.id);
//   return result;
// }

// export async function asyncDeleteItem(
//   object: BoardType | ColumnType | CardType,
//   type: "boards" | "columns" | "cards"
// ): Promise<void> {
//   const db = await kanbanDBPromise;
//   const tx = db.transaction(type, "readwrite");
//   const store = tx.objectStore(type);
//   const result = await store.delete(object.id);
//   return result;
// }
