import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";

import RoomCreate from "../../graphql/Mutation/RoomCreate";
import "./RoomCreation.scss";

const RoomCreation = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [createRoom, { data, error }] = useMutation(RoomCreate);
  const history = useHistory();

  useEffect(() => {
    if (data && data.roomCreate.id) {
      history.push(`/room/${data.roomCreate.id}`);
    }
  }, [data, history]);

  return (
    <section className="room-create">
      <div className="room-create__wrapper">
        <img
          src={require("./../../../Common/components/Home/logo2.png")}
          alt=""
        />
        {data && data.roomCreate.error && (
          <div className="room-create__error">{data.roomCreate.error[0]}</div>
        )}
        {error && <div className="room-create__error">{error.message}</div>}
        <input
          type="text"
          id="room-name"
          value={roomName}
          placeholder="Enter email"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="password"
          id="room-password"
          value={roomPassword}
          placeholder="Enter password"
          onChange={(e) => setRoomPassword(e.target.value)}
        />

        <button
          type="submit"
          onClick={() => {
            createRoom({
              variables: {
                name: roomName,
                password: roomPassword,
              },
            }).catch((e) => {
              console.log(e.message);
            });
          }}
        >
          Create New Room!
        </button>

        <Link
          to="/rooms"
          className="room-create__link"
          style={{ textDecoration: "none" }}
        >
          Return to all rooms
        </Link>
      </div>
    </section>
  );
};
export default RoomCreation;
