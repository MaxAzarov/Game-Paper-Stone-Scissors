import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";

import RoomCreate from "../../graphql/Mutation/RoomCreate";
import "./RoomCreation.scss";

interface RoomCreation {
  roomCreate: {
    id: string;
    errors: string[];
  };
}

const RoomCreation = () => {
  const [roomName, setRoomName] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [errorsData, setErrorsData] = useState("");
  const history = useHistory();

  const [createRoom, { error }] = useMutation(RoomCreate, {
    onCompleted({ roomCreate: { id, errors } }: RoomCreation) {
      errors && setErrorsData(errors.join(" "));
      error && setErrorsData(errorsData + (error.message as string));
      id && history.push(`/room/${id}`);
    },
  });

  return (
    <section className="room-create">
      <div className="room-create__wrapper">
        <img
          src={require("./../../../Common/components/Home/logo2.png")}
          alt=""
        />
        <div className="room-create__error">{errorsData}</div>
        <input
          type="text"
          id="room-name"
          value={roomName}
          placeholder="Enter room name"
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
          onClick={() =>
            createRoom({
              variables: {
                name: roomName,
                password: roomPassword,
              },
            }).catch((error) =>
              setErrorsData(errorsData + (error.message as string))
            )
          }
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
