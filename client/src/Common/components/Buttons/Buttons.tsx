import React, { useState } from "react";

import { IUserGameChoice } from "../../../../../types/rootTypes";
import "./Buttons.scss";

interface Props {
  setUserChoice: (val: number | null) => void;
  initialResult: any;
}

export default function Buttons({ setUserChoice, initialResult }: Props) {
  const [items] = useState<Array<IUserGameChoice>>([
    "Stone",
    "Scissors",
    "Paper",
  ]); // 0 1 2
  return (
    <div className="game">
      <div className="game-buttons">
        {items.map((item, index) => (
          <button
            key={index}
            value={item}
            onClick={() => setUserChoice(index)}
            disabled={!initialResult}
          >
            <img src={require(`./${item}.png`)} alt="" />
            <p>{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
