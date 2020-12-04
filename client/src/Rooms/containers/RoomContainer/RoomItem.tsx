import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { Room } from "../../../../../types/rootTypes";
import roomJoin from "../../graphql/Mutation/RoomJoin";
import "./RoomItem.scss";

interface Props {
  roomId: string;
  item: Room;
  roomPassword: string;
  setRoomId: (val: string) => void;
}

const RoomItem = ({ roomId, item, roomPassword, setRoomId }: Props) => {
  const [RoomJoin, { data: roomJoinResp }] = useMutation(roomJoin);
  const history = useHistory();

  // TODO handle err
  useEffect(() => {
    if (roomJoinResp && !roomJoinResp.roomJoin.errors) {
      console.log(roomJoinResp);
      history.push(`/room/${roomId}`);
    }
  }, [roomJoinResp, history, roomId]);
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
        <img src={require("./lock.png")} className="room-lock" alt="lock" />
      )}
    </div>
  );
};

export default RoomItem;
