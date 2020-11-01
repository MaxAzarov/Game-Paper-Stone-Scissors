import React, { FC } from "react";
import "./Statistics.scss";
import { UserStats } from "./../../../../../types/rootTypes";

interface IUserStatistics {
  getUsersStatistics: UserStats[];
}

const Statistics: FC<IUserStatistics> = (stats) => {
  return (
    <section className="user-statistics">
      {stats &&
        stats.getUsersStatistics.map((item, index) => {
          return (
            <div key={index}>
              {item.nickname} - {item.percentOfWin}
            </div>
          );
        })}
    </section>
  );
};
export default Statistics;
