import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { IUser, Room } from "../../../../../types/rootTypes";
import Buttons from "../../../Common/components/Buttons/Buttons";
import getRoom from "../../graphql/Query/GetRoom";
import roomSendUserChoice from "../../graphql/Mutation/RoomSendUserChoice";
import roomGetMatchResult from "../../graphql/Subscription/RoomGetMatchResult";
import { client } from "../../..";
import "./RoomView.scss";

interface Props {
  id: string;
  opponent: IUser | undefined | null;
}

interface IGetRoom {
  getRoom: Room & { error: [string] };
}

// /room/:id
const RoomView = ({ id, opponent }: Props) => {
  const [userChoice, setUserChoice] = useState<number | null>();
  const [enemy, setEnemy] = useState<IUser | undefined | null>(opponent);
  const { data, loading } = useQuery<IGetRoom>(getRoom, {
    variables: {
      id,
    },
  });
  const [roomSendUserOption] = useMutation(roomSendUserChoice);

  useEffect(() => {
    setEnemy(opponent);
  }, [opponent]);
  useEffect(() => {
    // find opponent
    let user = data?.getRoom?.users?.find(
      (item) => item.user !== localStorage.getItem("id")
    );
    if (!opponent?.nickname) {
      setEnemy(user as any);
    }
  }, [setEnemy, data, opponent]);

  useEffect(() => {
    const matchResult = client
      .subscribe({ query: roomGetMatchResult })
      .subscribe(({ data }) => {
        console.log("result of battle:", data);
      });

    return () => {
      matchResult.unsubscribe();
    };
  });

  useEffect(() => {
    if (userChoice !== undefined) {
      console.log(id, userChoice);
      roomSendUserOption({
        variables: {
          result: userChoice,
          roomId: id,
        },
      });
    }
  }, [userChoice, setUserChoice, roomSendUserOption, id]);

  if (!loading && data && data.getRoom.error) {
    return <div className="room-error">Can't get this room</div>;
  }
  // console.log(userChoice);

  let date;
  if (data) {
    date = new Date(+data.getRoom.createdAt);
  }
  return (
    <section className="room">
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
      {!enemy?.nickname && <p>Please wait for new user to start game...</p>}
      {/* {enemy?.nickname && } */}
      <Buttons
        initialResult={enemy?.nickname}
        setUserChoice={setUserChoice}
      ></Buttons>
    </section>
  );
};
export default RoomView;
