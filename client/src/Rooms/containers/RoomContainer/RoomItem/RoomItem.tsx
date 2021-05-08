import React from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { Room } from "../../../../types/rootTypes";
import roomJoin from "../../../graphql/Mutation/RoomJoin";
import "./RoomItem.scss";

interface Props {
  roomId: string;
  item: Room;
  roomPassword: string;
  setRoomId: (val: string) => void;
}

// TODO handle errors
const RoomItem = ({ roomId, item, roomPassword, setRoomId }: Props) => {
  const history = useHistory();
  const [RoomJoin] = useMutation(roomJoin, {
    onCompleted(data) {
      console.log(data.roomJoin.status);
      !data.roomJoin.errors && history.push(`/room/${roomId}`);
    },
  });

  return (
    <div
      className="room-item"
      onClick={() => {
        RoomJoin({
          variables: {
            id: item.id,
            password: roomPassword,
          },
        }).catch((e) => console.log(e));
        setRoomId(item.id);
      }}
    >
      <p className="room-item__name">
        Room name: &nbsp;<span>{item.name}</span>
      </p>
      <p>
        users:
        {item.users.map((item, index) => {
          return <span key={index}>{item.nickname} &nbsp;</span>;
        })}
      </p>
      {item.private && (
        <img src={require("./../lock.png")} className="room-lock" alt="lock" />
      )}
    </div>
  );
};

export default RoomItem;
