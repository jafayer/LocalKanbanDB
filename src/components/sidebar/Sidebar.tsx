import { EffectCallback, useEffect, useState } from "react";
import { BoardType } from "../../utils/definitions";
import {
  asyncAddItem,
  asyncGetAllBoards,
  asyncDeleteItem,
  asyncUpdateBoard,
} from "../../utils/db";
import { generateNewBoard } from "../../utils/generate";
import { useSelector, useDispatch } from "react-redux";
import { addBoard, removeBoard, updateBoard } from "../../redux/boardSlice";
import { setActiveBoard } from "../../redux/activeBoardSlice";

import { BoardButton } from "./BoardButton";
import { RootState } from "../../store";
import { ClipLoader } from "react-spinners";

function Sidebar(props: { [key: string]: any }): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const [overrideScreenSizeCollapse, setOverrideScreenSizeCollapse] =
    useState(false);

  const [openMenu, setMenuIsOpen] = useState(-1);
  const [renamingBoard, setRenamingBoard] = useState(-1);

  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards.value);
  const activeBoardId = useSelector(
    (state: RootState) => state.activeBoard.value
  );
  const activeBoard = activeBoardId
    ? boards.find((board: BoardType) => board.id === activeBoardId)
    : null;

  useEffect(() => {
    // add event listener to close sidebar when window is resized less than 768px
    // unless user has expanded the sidebar after it was closed this way
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen && !overrideScreenSizeCollapse) {
        setIsOpen(false);
      } else if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
  }, []);

  if (!activeBoard) {
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
      <div
        className={`sidebar ${
          isOpen ? "sidebar__content open" : ""
        } bg-stone-900 text-white flex flex-col p-0 pb-5 pt-5`}
      >
        <button
          className="toggle bg-indigo-600 text-white rounded-lg p-1 font-bold transition-all hover:bg-indigo-500"
          onClick={handleClick}
        >
          {isOpen ? "Close" : "Open"}
        </button>
        <div className="sidebar__header">
          <h1 className="font-b text-xl text-center pt-5 font-bold">
            Local Kanban Board
          </h1>
        </div>
        <div className="sidebar__content flex flex-col align-top h-full">
          <div className="flex mt-5 flex-col pt-5">
            {boards &&
              boards.map((board: BoardType) =>
                BoardButton({
                  board,
                  activeBoard,
                  handleSelectBoard,
                  setMenuIsOpen,
                  openMenu,
                  handleDeleteBoard,
                  handleRenameBoard,
                  setRenamingBoard,
                  renamingBoard,
                })
              )}
          </div>
          <button
            className="m-auto mb-0 bg-indigo-500 w-1/2 p-3 rounded-md hover:bg-indigo-400 transition-all"
            onClick={createNewBoard}
          >
            Add Board
          </button>
        </div>
      </div>
    );
  }

  function createNewBoard(): void {
    const newBoard = generateNewBoard(boards.length);
    asyncAddItem(newBoard, "boards");
    dispatch(addBoard([newBoard]));
  }

  function handleClick(): void {
    setIsOpen(!isOpen);
    if (window.innerWidth < 768) {
      setOverrideScreenSizeCollapse(true);
    }
  }

  function handleSelectBoard(board: BoardType): void {
    dispatch(setActiveBoard(board.id));
  }

  async function handleDeleteBoard(board: BoardType): Promise<void> {
    await asyncDeleteItem(board, "boards");
    if (board.id === activeBoardId) {
      // select the closest board to the one that was deleted
      const closestBoard = boards.find((b: BoardType) => b.id !== board.id);
      dispatch(setActiveBoard(closestBoard.id));
    }

    dispatch(removeBoard(board));
  }
  async function handleRenameBoard(board: BoardType): Promise<void> {
    await asyncUpdateBoard(board);
    dispatch(updateBoard(board));
  }
}

export default Sidebar;
