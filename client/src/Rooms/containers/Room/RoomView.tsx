import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { IMatchResult, IUser, Room } from "../../../../../types/rootTypes";
import Buttons from "../../../Common/components/Buttons/Buttons";
import getRoom from "../../graphql/Query/GetRoom";
import roomSendUserChoice from "../../graphql/Mutation/RoomSendUserChoice";
import roomGetMatchResult from "../../graphql/Subscription/RoomGetMatchResult";
import GameResult from "../../../Common/components/GameResult/GameResult";
import RoomInfo from "../../components/RoomInfo/RoomInfo";
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
  const [matchResult, setMatchResult] = useState<IMatchResult>();
  const [opponentChoice, setOpponentChoice] = useState();
  const [roomSendUserOption] = useMutation(roomSendUserChoice);
  const { data, loading } = useQuery<IGetRoom>(getRoom, {
    variables: {
      id,
    },
  });

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
        setMatchResult(data.roomGetMatchResult.result);
        setOpponentChoice(data.roomGetMatchResult.opponent);
      });

    return () => {
      matchResult.unsubscribe();
    };
  });

  useEffect(() => {
    if (userChoice !== undefined) {
      // console.log(id, userChoice);
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

  let date;
  if (data) {
    date = new Date(+data.getRoom.createdAt);
  }
  return (
    <section className="room">
      <RoomInfo date={date} enemy={enemy} data={data}></RoomInfo>
      {matchResult && (
        <GameResult
          matchResult={matchResult}
          choice={userChoice}
          random={opponentChoice}
        ></GameResult>
      )}
      <Buttons
        initialResult={enemy?.nickname}
        setUserChoice={setUserChoice}
      ></Buttons>
    </section>
  );
};
export default RoomView;
