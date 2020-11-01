import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { Room } from "../../../../../types/rootTypes";
import roomJoin from "../../graphql/Mutation/RoomJoin";
import "./RoomItem.scss";

interface Props {
  roomId: string;
  index: number;
  item: Room;
  roomPassword: string;
  setRoomId: (val: string) => void;
}

const RoomItem = ({ roomId, index, item, roomPassword, setRoomId }: Props) => {
  const [RoomJoin, { data: roomJoinResp }] = useMutation(roomJoin);
  const history = useHistory();

  // TODO handle err
  useEffect(() => {
    if (roomJoinResp && !roomJoinResp.roomJoin.error) {
      history.push(`/room/${roomId}`);
    }
  }, [roomJoinResp, history, roomId]);
  return (
    <div
      key={index}
      className="room-item"
      onClick={() => {
        RoomJoin({
          variables: {
            id: item.id,
            password: roomPassword,
          },
        });
        setRoomId(item.id);
      }}
    >
      <p>{item.name}</p>
      <p>
        users:
        {item.users.map((item, index) => {
          return <span key={index}>{item.nickname}</span>;
        })}
      </p>
    </div>
  );
};
export default RoomItem;
