import { EffectCallback, useEffect, useState } from "react";
import { BoardType } from "../../utils/definitions";
import {
  asyncAddItem,
  asyncGetItems,
  asyncUpdateItem,
  asyncDeleteItem,
} from "../../utils/db";
import { generateNewBoard } from "../../utils/generate";
import { useSelector, useDispatch } from "react-redux";
import { addBoard, removeBoard, updateBoard } from "../../redux/boardSlice";
import { setActiveBoard } from "../../redux/activeBoardSlice";
import { addColumns, clearColumns } from "../../redux/columnSlice";

import { BoardButton } from "./BoardButton";
import { RootState } from "../../store";
import { ClipLoader } from "react-spinners";

function Sidebar(props: { [key: string]: any }): JSX.Element {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [overrideScreenSizeCollapse, setOverrideScreenSizeCollapse] =
    useState(false);

  const [openMenu, setMenuIsOpen] = useState(-1);
  const [renamingBoard, setRenamingBoard] = useState(-1);

  const boards = useSelector((state: RootState) => state.boards.value);

  const activeBoard = useSelector(
    (state: RootState) => state.activeBoard.value
  );

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
              boards.map((board: BoardType) => (
                <BoardButton
                  key={board.id}
                  board={board}
                  setMenuIsOpen={setMenuIsOpen}
                  setRenamingBoard={setRenamingBoard}
                  handleSelectBoard={handleSelectBoard}
                  openMenu={openMenu}
                  renamingBoard={renamingBoard}
                  activeBoard={activeBoard}
                  handleDeleteBoard={handleDeleteBoard}
                />
              ))}
          </div>
          <button
            className="m-auto mb-0 bg-indigo-500 w-1/2 p-3 rounded-md hover:bg-indigo-400 transition-all"
            onClick={handleCreateBoard}
          >
            Add Board
          </button>
        </div>
      </div>
    );
  }

  function handleCreateBoard(): void {
    const newBoard = generateNewBoard(boards.slice().length);
    asyncAddItem("boards", newBoard);
    dispatch(addBoard([newBoard]));
    dispatch(setActiveBoard(newBoard));
  }

  async function handleDeleteBoard(e: Event, board: BoardType): Promise<void> {
    e.stopPropagation();
    e.preventDefault();

    if (board.id === activeBoard!.id) {
      const oldActiveIndex = boards.findIndex(
        (b: BoardType) => b.id === activeBoard!.id
      );
      const newActiveIndex = oldActiveIndex === 0 ? 1 : oldActiveIndex - 1;

      const newActiveBoard = boards
        .slice()
        .sort((a: any, b: any) => b.order - a.order)[newActiveIndex];

      handleSelectBoard(newActiveBoard);
    }

    await asyncDeleteItem("boards", board.id);
    dispatch(removeBoard(board));
  }

  async function handleUpdateBoard(board: BoardType): Promise<void> {
    await asyncUpdateItem("boards", board.id, board);
    dispatch(updateBoard(board));
  }

  async function handleSelectBoard(board: BoardType): Promise<void> {
    dispatch(setActiveBoard(board));
    asyncGetItems("columns", board.columns as string[]).then((columns) => {
      console.log(columns);
      dispatch(clearColumns());
      dispatch(addColumns(columns));
    });
  }

  async function handleRenameBoard(
    id: string,
    updates: { [key: string]: any },
    board: BoardType
  ): Promise<void> {
    await asyncUpdateItem("boards", id, updates);
    dispatch(updateBoard({ ...board, ...updates }));
  }

  function handleClick(): void {
    setIsOpen(!isOpen);
    if (window.innerWidth < 768) {
      setOverrideScreenSizeCollapse(true);
    }
  }
}

export default Sidebar;
