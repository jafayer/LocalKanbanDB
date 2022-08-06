export interface BoardType {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  columns: String[];
  archived: boolean;
}

export interface ColumnType {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number | null;
  cards: String[];
  archived: boolean;
}

export interface CardType {
  id: string;
  title: string;
  description: string;
  order: number;
  customFields: Object[];
  createdAt: number;
  updatedAt: number | null;
  archived: boolean;
}

export const versions = {
  app: 1,
  board: 1,
  column: 1,
  card: 1,
};
