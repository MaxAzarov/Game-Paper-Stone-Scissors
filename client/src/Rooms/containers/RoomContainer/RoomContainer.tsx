import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { client } from "../../../index";
import getRooms from "../../graphql/Query/GetRooms";
import roomCreated from "../../graphql/Subscription/RoomCreated";
import { Room } from "../../../../../types/rootTypes";
import roomLastUserLeave from "../../graphql/Subscription/RoomLastUserLeave";
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
  const { data, error } = useQuery<IRooms, string>(getRooms, {
    fetchPolicy: "network-only",
  });
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
        setRooms([...rooms.filter((item) => item.id !== id.roomLastUserLeave)]);
      });

    return () => {
      roomCreateSubscription.unsubscribe();
      roomDeleteSubscription.unsubscribe();
    };
  });
  return (
    // private and public rooms
    <section className="rooms">
      <p className="rooms-link">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Home page</span>
        </Link>
      </p>
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
              ></RoomItem>
            ))}
          {rooms.length === 0 && <p className="">No available rooms</p>}
        </div>
        <input
          type="password"
          value={roomPassword}
          className="rooms-password"
          placeholder="enter room password"
          onChange={(e) => setRoomPassword(e.target.value)}
        />
        <p className="rooms-label">or</p>
        <button className="rooms-create">
          <Link to="/room-create" style={{ textDecoration: "none" }}>
            <span>Create room</span>
          </Link>
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
