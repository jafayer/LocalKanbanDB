import { useState, useEffect } from "react";
import { CardType, ColumnType } from "../../utils/definitions";
import { asyncAddItem, asyncDeleteItem, asyncUpdateItem } from "../../utils/db";
import { updateColumn } from "../../redux/columnSlice";
import { useDispatch } from "react-redux";
import { addCard } from "../../redux/cardSlice";
// @ts-ignore
import { XIcon, PlusIcon } from "@heroicons/react/outline";
import { generateNewCard } from "../../utils/generate";

function ColumnHeader(props: { [key: string]: any }): JSX.Element {
  const dispatch = useDispatch();
  // state for whether header is being edited or not
  const [isEditing, setIsEditing] = useState(false);

  const cards = props.cards;

  return (
    <div className="column-header flex justify-between items-center">
      {switchTitle()}

      <div
        className="controls"
        style={{ display: !isEditing ? "block" : "none" }}
      >
        <button
          className="addNewCard p-1 pr-2 pl-2 text-slate-800 hover:text-white hover:bg-purple-600 mr-3 ml-3 rounded-full"
          onClick={handleAddCard}
        >
          <PlusIcon className="h-3 w-3" />
        </button>
        <button
          className="text-slate-800 hover:bg-red-400 hover:text-white transition-all p-1 pr-2 pl-2 rounded-full ml-auto mr-1 self-center"
          onClick={() => {
            props.handleDeleteColumn(props.columnData);
          }}
        >
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
            handleUpdateColumn(props.columnData, { name: e.target.value });
          }}
          className={`p-3 border-b-2 border-indigo-700 outline-none input-name-col-${props.id}`}
          onBlur={handleClickOrBlur}
        />
      );
    } else {
      return <h3 onClick={handleClickOrBlur}>{props.name}</h3>;
    }
  }
  async function handleAddCard() {
    const newCard = generateNewCard(props.columnData.cards.length);
    await asyncAddItem("cards", newCard);
    dispatch(addCard([newCard]));

    //update column with new card
    const updatedColumn = {
      ...props.columnData,
      cards: [...props.columnData.cards, newCard.id],
    };

    handleUpdateColumn(updatedColumn, { cards: updatedColumn.cards });
  }

  async function handleUpdateColumn(
    column: ColumnType,
    propsToUpdate: { [key: string]: any }
  ) {
    await asyncUpdateItem("columns", column.id, propsToUpdate);
    const updatedColumn: ColumnType = { ...column, ...propsToUpdate };
    dispatch(updateColumn(updatedColumn));
  }
}

export default ColumnHeader;
