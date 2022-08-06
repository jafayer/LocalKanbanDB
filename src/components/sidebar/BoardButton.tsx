import { EffectCallback, useEffect, useState } from "react";
import { CogIcon } from "@heroicons/react/solid";
import { BoardType } from "../../utils/definitions";
import boardSlice from "../../redux/boardSlice";

export function BoardButton(props: { [key: string]: any }): JSX.Element {
  return (
    <div
      key={props.board.id}
      className={`group boardLink flex items-center justify-evenly w-[150px] ml-auto mt-1 mb-1  text-slate-800 p-2 pl-5 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-indigo-100 font-bold${
        props.activeBoard.id === props.board.id
          ? " bg-amber-400"
          : " bg-indigo-200"
      }`}
      onClick={() => {
        props.handleSelectBoard(props.board);
      }}
    >
      <div className="relative">
        <div className="group-cog">
          <CogIcon
            className="font-white h-5 w-5 align-middle invisible group-hover:visible hover:opacity-70 transition-opacity"
            onClick={handleCogClick}
          />
          <div
            className={`dropdownMenu flex-col items-start absolute bg-white p-3 rounded-md shadow-lg ${
              props.openMenu === props.board.id ? "flex" : "hidden"
            }`}
          >
            <div
              onClick={(e) => {
                console.log(e);
                e.stopPropagation();
                e.preventDefault();
                props.setRenamingBoard(props.board.id);
              }}
              className="hover:opacity-80"
            >
              Rename
            </div>
            <div
              className="hover:opacity-80"
              onClick={() => {
                props.handleDeleteBoard(props.board);
              }}
            >
              Delete
            </div>
          </div>
        </div>
      </div>
      <div className="boardName">{renderNameOrInput()}</div>
    </div>
  );

  function handleCogClick(
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ): void {
    e.stopPropagation();
    e.preventDefault();
    if (props.openMenu === props.board.id) {
      props.setMenuIsOpen(-1);
    } else {
      props.setMenuIsOpen(props.board.id);
    }

    addEventListener("click", handleOutsideClick);

    // if the user clicks anywhere other than the parent context menu or any of its children, close the menu and remove the event listener
    function handleOutsideClick(e: Event): void {
      if (
        !e.target ||
        !(e.target as HTMLElement).classList.contains("dropdownMenu")
      ) {
        props.setMenuIsOpen(-1);
        removeEventListener("click", handleOutsideClick);
      }
    }
  }

  function renderNameOrInput() {
    if (props.renamingBoard === props.board.id) {
      return <input className="min-w-0" type="text" value={props.board.name} />;
    } else {
      return <p>{props.board.name}</p>;
    }

    // add an event listener for either the enter button or clicking anywhere else to close the menu
    function handleOutsideClick(e: Event): void {
      if (
        !e.target ||
        !(e.target as HTMLElement).classList.contains("boardName")
      ) {
        props.setRenamingBoard(-1);
        removeEventListener("click", handleOutsideClick);
      }
    }
  }
}
