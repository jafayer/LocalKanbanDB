import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CardType, ColumnType } from "../../../utils/definitions";
import { useDrag, useDrop } from "react-dnd";
import { types, ColumnDropResult } from "../../../utils/definitions";

export function Card(props: { [key: string]: any }): JSX.Element {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: types.CARD,
    item: { id: props.card.id },
    end: (card, monitor) => {
      const dropResult = monitor.getDropResult<ColumnDropResult>();
      if (card && dropResult) {
        alert(`you dropped ${card.id} into ${dropResult.id}`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 40 : 100;
  return (
    <div
      ref={drag}
      data-testid={`card`}
      className={`group card p-3 bg-white mt-3 mb-3 rounded-lg shadow-lg flex flex-col opacity-${opacity} cursor-${
        isDragging ? "grabbing" : "grab"
      }`}
    >
      <div className="header font-bold">
        <h3 className="cursor-grab">{props.card.title}</h3>
      </div>
      <div className="content">
        <p>{props.card.description}</p>
      </div>
    </div>
  );
}

export default Card;
