import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CardType, ColumnType } from "../../../utils/definitions";

export function Card(props: { [key: string]: any }): JSX.Element {
  return (
    <div className="card p-3 bg-white mt-3 mb-3 rounded-lg shadow-lg flex flex-col">
      <div className="header font-bold">
        <h3>{props.card.name}</h3>
      </div>
    </div>
  );
}

export default Card;
