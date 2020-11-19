import React, { useState } from "react";
import { Link } from "react-router-dom";

import { IUserGameChoice } from "../../../../../types/rootTypes";
import "./Buttons.scss";

interface Props {
  setUserChoice: (val: number | null) => void;
  initialResult: any;
  error: any;
  // pause:boolean
}

//  ??? pause

export default function Buttons({
  setUserChoice,
  initialResult,
  error,
}: // pause
Props) {
  const [items] = useState<Array<IUserGameChoice>>([
    "Stone",
    "Scissors",
    "Paper",
  ]); // 0 1 2
  return (
    <div className="game">
      {(!initialResult || error) && (
        <p className="game-error">
          Login to play!
          <Link to="/login" style={{ textDecoration: "none", color: "#000" }}>
            Click here to login
          </Link>
        </p>
      )}
      {/* {
        pause && <p></p>
      } */}
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
