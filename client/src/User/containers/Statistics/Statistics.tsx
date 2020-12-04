import React, { FC } from "react";
import { useQuery } from "@apollo/client";

import { UserStats } from "../../../../../types/rootTypes";
import getUsersStatistics from "../../graphql/Query/GetUsersStatistics";
import Spinner from "../../../Common/components/Spinner/Spinner";
import "./Statistics.scss";
import Menu from "../../../Common/components/Menu/Menu";

interface IUserStatistics {
  getUsersStatistics: {
    data: [UserStats];
  };
}

const Statistics: FC = () => {
  const { data, loading } = useQuery<IUserStatistics>(getUsersStatistics);
  if (loading) {
    return <Spinner></Spinner>;
  }
  return (
    <section className="users-statistics">
      <Menu />
      <img
        src={require("./../../../Common/components/Home/logo2.png")}
        alt=""
        className="users-statistics__logo"
      />
      <div className="users-statistics__wrapper">
        <span>Best users:</span>
        {data &&
          data.getUsersStatistics.data.map((item, index) => {
            return (
              <div
                key={index}
                className="users-statistics__item item-statistics"
              >
                <p className="item-statistics__name">{item.nickname}</p>
                <p className="item-statistics__percent">{item.percentOfWin}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
};
export default Statistics;
