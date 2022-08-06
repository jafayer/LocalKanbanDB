import { useState, useEffect } from "react";
import { CardType, ColumnType } from "../../utils/definitions";
import { asyncDeleteItem } from "../../utils/db";
// @ts-ignore
import { XIcon, PlusIcon } from "@heroicons/react/outline";

function ColumnHeader(props: { [key: string]: any }): JSX.Element {
  // state for whether header is being edited or not
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="column-header flex justify-between items-center">
      {switchTitle()}

      <div
        className="controls"
        style={{ display: !isEditing ? "block" : "none" }}
      >
        <button
          className="addNewCard p-1 pr-2 pl-2 text-slate-800 hover:text-white hover:bg-purple-600 mr-3 ml-3 rounded-full"
          onClick={props.handleAddItem}
        >
          <PlusIcon className="h-3 w-3" />
        </button>
        <button className="text-slate-800 hover:bg-red-400 hover:text-white transition-all p-1 pr-2 pl-2 rounded-full ml-auto mr-1 self-center">
          <XIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );

  function handleClickOrBlur(): void {
    setIsEditing(!isEditing);
  }

  function switchTitle(): JSX.Element {
    if (isEditing) {
      return (
        <input
          value={props.name}
          autoFocus
          onChange={(e) => {
            props.handleUpdateItem(
              { ...props.columnData, name: e.target.value },
              "columns"
            );
          }}
          className={`p-3 border-b-2 border-indigo-700 outline-none input-name-col-${props.id}`}
          onBlur={handleClickOrBlur}
        />
      );
    } else {
      return <h3 onClick={handleClickOrBlur}>{props.name}</h3>;
    }
  }
}

export default ColumnHeader;
