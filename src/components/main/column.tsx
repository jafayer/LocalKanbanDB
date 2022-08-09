import { useState, useEffect } from "react";
import { CardType, ColumnType } from "../../utils/definitions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Card from "./cards/Card";
import { useDrag, useDrop } from "react-dnd";
import { types, ColumnDropResult } from "../../utils/definitions";

//@ts-ignore
import ColumnHeader from "./ColumnHeader";
import { asyncGetItems } from "../../utils/db";

export function Column(props: { [key: string]: any }): JSX.Element {
  const column = props.columnData;

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: types.CARD,
    drop: () => ({ id: column.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  return (
    <div
      className={`group column flex flex-col rounded-lg p-5 m-5 relative w-px-[300px] min-w-[300px] ${
        isActive ? "bg-purple-200" : ""
      }`}
    >
      <div className="row">
        <ColumnHeader
          name={props.name}
          handleDeleteColumn={props.handleDeleteColumn}
          columnData={column}
        />
      </div>

      <div className="cardlist" ref={drop} data-testid="column">
        {column.cards &&
          column.cards.map((card: CardType) => {
            return <Card key={card.id} card={card} />;
          })}
      </div>
    </div>
  );
}
