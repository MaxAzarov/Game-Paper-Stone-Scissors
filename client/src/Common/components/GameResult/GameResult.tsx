import React from "react";

import "./GameResult.scss";
import { IMatchResult } from "../../../../../types/rootTypes";
import paper from "./paper.png";
import scissors from "./scissors.png";
import stone from "./stone.png";

interface Props {
  choice?: number | null;
  random?: number | null;
  matchResult?: IMatchResult | null;
}

const GameResult = ({ choice, random, matchResult }: Props) => {
  return (
    <div className="match-view">
      {choice === 2 && <img src={paper} alt="paper" className="paper" />}
      {choice === 1 && (
        <img src={scissors} alt="scissors" className="scissors" />
      )}
      {choice === 0 && <img src={stone} alt="stone" className="stone" />}
      <div className="match-view__result">{matchResult}</div>
      {random === 2 && (
        <img src={paper} alt="paper" className="paper-reverse" />
      )}
      {random === 1 && (
        <img src={scissors} alt="scissors" className="scissors-reverse" />
      )}
      {random === 0 && (
        <img src={stone} alt="stone" className="stone-reverse" />
      )}
    </div>
  );
};

export default GameResult;
