import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { client } from "../../../index";
import getRooms from "../../graphql/Query/GetRooms";
import roomCreated from "../../graphql/Subscription/RoomCreated";
import { Room } from "../../../../../types/rootTypes";
import roomLastUserLeave from "../../graphql/Subscription/RoomLastUserLeave";
import Menu from "../../../Common/components/Menu/Menu";
import RoomItem from "./RoomItem";
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
  const { data } = useQuery<IRooms, string>(getRooms, {
    fetchPolicy: "network-only",
  });
  const history = useHistory();
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
        setRooms([...rooms.filter((item) => item.id !== id.roomLastUserLeave)]);
      });

    return () => {
      roomCreateSubscription.unsubscribe();
      roomDeleteSubscription.unsubscribe();
    };
  });
  return (
    <section className="rooms">
      <Menu />
      <section className="rooms-wrapper">
        <div className="rooms-container">
          {rooms &&
            rooms.map((item, index) => (
              <RoomItem
                key={index}
                roomId={roomId}
                item={item}
                roomPassword={roomPassword}
                setRoomId={setRoomId}
              />
            ))}
          {rooms.length === 0 && (
            <p className="rooms-message">No available rooms</p>
          )}
        </div>
        <input
          type="password"
          value={roomPassword}
          className="rooms-password"
          placeholder="enter room password to join room"
          onChange={(e) => setRoomPassword(e.target.value)}
        />
        <p className="rooms-label">or</p>
        <button
          className="rooms-create"
          onClick={() => history.push("/room-create")}
        >
          Create room
        </button>
      </section>
      <img
        src={require("./../../../Common/components/Home/logo2.png")}
        alt="data"
        className="rooms-logo"
      />
    </section>
  );
};

export default RoomsView;
