import { BoardType, ColumnType, CardType } from "../utils/definitions";
import { asyncAddItem, asyncGetItems, asyncDeleteItem } from "./db";
import { useDispatch } from "react-redux";

export function switchBoard(board: BoardType) {
  const dispatch = useDispatch();
  return async (dispatch) => {
    dispatch(setActiveBoard(board));
  };
}
