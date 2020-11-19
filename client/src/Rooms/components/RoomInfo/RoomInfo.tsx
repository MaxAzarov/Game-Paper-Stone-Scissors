import React from "react";

import { IGetRoom, IMatchResult, IUser } from "../../../../../types/rootTypes";
import "./RoomInfo.scss";

interface Props {
  date?: Date;
  enemy: IUser | null | undefined;
  data?: IGetRoom | undefined;
  result?: IMatchResult;
}

const RoomInfo = ({ data, date, enemy, result }: Props) => {
  console.log(result);
  return (
    <>
      <div className="room-info">
        Room name: <span className="room-name">{data?.getRoom?.name}</span>
        <br />
        Room id:
        <p className="room-id">{data?.getRoom?.id}</p>
        Created at: {date && date.getHours()} hour {date && date.getMinutes()}{" "}
        minute {date && date.getSeconds()} seconds
      </div>
      <p className="room-opponent">
        opponent: {enemy?.nickname || "waiting..."}
      </p>
      {!enemy?.nickname && (
        <p className="room-waiting">
          Please wait for new user to start game...
        </p>
      )}
    </>
  );
};
export default RoomInfo;
