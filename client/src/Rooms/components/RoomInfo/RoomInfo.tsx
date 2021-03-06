import React from "react";

import { IGetRoom, IUser } from "../../../types/rootTypes";
import "./RoomInfo.scss";

interface Props {
  date?: Date;
  enemy: Pick<IUser, "nickname"> | null | undefined;
  data?: IGetRoom | undefined;
}

const RoomInfo = ({ data, date, enemy }: Props) => {
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
