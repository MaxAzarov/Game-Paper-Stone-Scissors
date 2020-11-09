import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { client } from "../../../index";
import getRooms from "../../graphql/Query/GetRooms";
import roomCreated from "../../graphql/Subscription/RoomCreated";
import RoomItem from "./RoomItem";
import { Room } from "../../../../../types/rootTypes";
import roomLastUserLeave from "../../graphql/Subscription/RoomLastUserLeave";
import "./RoomContainer.scss";

interface IRooms {
  getRooms: {
    rooms: [Room];
  };
}

interface RoomCreated {
  roomCreated: Room;
}

const RoomsView: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const { data, error } = useQuery<IRooms, string>(getRooms, {
    fetchPolicy: "network-only",
  });
  // console.log(data);
  console.log(error && error.message);
  useEffect(() => {
    if (data) {
      setRooms(data.getRooms.rooms);
    }
  }, [data]);

  useEffect(() => {
    // room created
    const roomCreateSubscription = client
      .subscribe<RoomCreated>({
        query: roomCreated,
      })
      .subscribe(({ data }) => {
        console.log(" room created SUBSCRIBE received", data);
        if (data) {
          setRooms([...(rooms as any), data.roomCreated as any]);
        }
      });
    // id of deleted room
    const roomDeleteSubscription = client
      .subscribe({
        query: roomLastUserLeave,
      })
      .subscribe(({ data: id }) => {
        console.log("id of deleted room: ", id);
        setRooms([...rooms.filter((item) => item.id !== id.roomLastUserLeave)]);
      });

    return () => {
      roomCreateSubscription.unsubscribe();
      roomDeleteSubscription.unsubscribe();
    };
  });
  return (
    <section className="room">
      <div className="room-wrapper">
        {rooms &&
          rooms.map((item, index) => (
            <RoomItem
              roomId={roomId}
              index={index}
              item={item}
              roomPassword={roomPassword}
              setRoomId={setRoomId}
            ></RoomItem>
          ))}
      </div>
      <input
        type="password"
        value={roomPassword}
        className="room-password"
        placeholder="enter room password"
        onChange={(e) => setRoomPassword(e.target.value)}
      />

      <Link to="/room-create" className="room-create">
        <p>Create room</p>
      </Link>
    </section>
  );
};

export default RoomsView;
