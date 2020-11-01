import React, { FC } from "react";
import { Result } from "../../../../../types/rootTypes";
import "./UserStatistics.scss";

interface Props {
  statistics: Result;
}

const UserStatistics: FC<Props> = ({
  statistics: { wins, defeat, draw, percentOfWin },
}) => {
  return (
    <section className="statistics">
      <p>Statistics: &nbsp;</p>
      <div className="statistics-container">
        <p>Wins:{wins}</p>
        <p>Defeat:{defeat}</p>
        <p>Draw:{draw}</p>
      </div>
      Percent of win:
      {percentOfWin}
    </section>
  );
};

export default UserStatistics;
