import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxJsonSchema,
  RxDocument,
} from "rxdb";

export type BoardType = {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  columns: String[];
  archived: boolean;
};

export const boardSchema = {
  title: "Kanban Boards",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
      unique: true,
    },
    name: {
      type: "string",
    },
    order: {
      type: "integer",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "name", "order", "createdAt"],
  indexes: ["id"],
};

type BoardDocMethods = {
  scream: (v: string) => string;
};

export type boardDocument = RxDocument<BoardType, BoardDocMethods>;

type boardCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

type BoardCollection = RxCollection<
  BoardType,
  boardDocument,
  boardCollectionMethods
>;

export type ColumnType = {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  cards: String[];
  archived: boolean;
};

export const columnSchema = {
  title: "Kanban Columns",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
      unique: true,
    },
    name: {
      type: "string",
    },
    order: {
      type: "integer",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
    cards: {
      type: "array",
    },
  },
  required: ["id", "name", "order", "createdAt", "cards"],
  indexes: ["id"],
};

type ColumnDocMethods = {
  scream: (v: string) => string;
};

export type columnDocument = RxDocument<ColumnType, ColumnDocMethods>;

type ColumnCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

type ColumnCollection = RxCollection<
  ColumnType,
  columnDocument,
  ColumnCollectionMethods
>;

export type CardType = {
  id: string;
  title: string;
  description: string;
  order: number;
  customFields: Object[];
  createdAt: number;
  updatedAt: number | null;
  archived: boolean;
};

export const cardSchema = {
  title: "Kanban Cards",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
      unique: true,
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
    order: {
      type: "integer",
    },
    customFields: {
      type: "array",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
    archived: {
      type: "boolean",
    },
  },
  required: [
    "id",
    "title",
    "description",
    "order",
    "customFields",
    "createdAt",
  ],
  indexes: ["id"],
};

type CardDocMethods = {
  scream: (v: string) => string;
};

export type cardDocument = RxDocument<CardType, CardDocMethods>;

type CardCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

type CardCollection = RxCollection<
  CardType,
  cardDocument,
  CardCollectionMethods
>;

export type kbDatabaseCollections = {
  boards: BoardCollection;
  columns: ColumnCollection;
  cards: CardCollection;
};

export type KbDatabase = RxDatabase<kbDatabaseCollections>;
