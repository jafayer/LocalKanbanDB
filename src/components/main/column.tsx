import { useState, useEffect } from "react";
import { CardType, ColumnType } from "../../utils/definitions";

//@ts-ignore
import ColumnHeader from "./ColumnHeader";

export function Column(props: { [key: string]: any }): JSX.Element {
  const [column, setColumn] = useState(props.columnData);

  return (
    <div className="group column flex flex-col rounded-lg p-5 m-5 relative w-px-[300px] min-w-[300px]">
      <div className="row">
        <ColumnHeader
          name={props.name}
          handleDeleteItem={props.handleDeleteItem}
          columnData={column}
          handleUpdateItem={props.handleUpdateItem}
        />
      </div>

      <div className="cardlist">
        {props.cards.map((card: CardType) => {
          return (
            <div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
