import { useState, useEffect } from "react";
import { CardType, ColumnType } from "../../utils/definitions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Card from "./cards/Card";

//@ts-ignore
import ColumnHeader from "./ColumnHeader";
import { asyncGetItems } from "../../utils/db";

export function Column(props: { [key: string]: any }): JSX.Element {
  const column = props.columnData;

  const cardsToRender = getCards();
  console.log({ cardsToRender });

  return (
    <div className="group column flex flex-col rounded-lg p-5 m-5 relative w-px-[300px] min-w-[300px]">
      <div className="row">
        <ColumnHeader
          name={props.name}
          handleDeleteColumn={props.handleDeleteColumn}
          columnData={column}
          cards={cards}
        />
      </div>

      <div className="cardlist">{getCards.then((cards) => {})}</div>
    </div>
  );

  async function getCards() {
    const cardIds = props.columnData.cards;
    const cards = await asyncGetItems("cards", cardIds);

    console.log({ cards });
    return cards;
  }
}
