import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { IGetRoom, IMatchResult, IUser } from "../../../types/rootTypes";
import Buttons from "../../../Common/components/Buttons/Buttons";
import getRoom from "../../graphql/Query/GetRoom";
import roomSendUserChoice from "../../graphql/Mutation/RoomSendUserChoice";
import roomGetMatchResult from "../../graphql/Subscription/RoomGetMatchResult";
import GameResult from "../../../Common/components/GameResult/GameResult";
import Info from "../../../Common/components/Info/Info";
import RoomInfo from "../../components/RoomInfo/RoomInfo";
import Error from "../../../Common/components/Error/Error";
import { client } from "../../..";
import "./RoomView.scss";
interface Props {
  id: string;
  opponent: IUser | undefined | null;
}

// /room/:id
const RoomView = ({ id, opponent }: Props) => {
  const [userChoice, setUserChoice] = useState<number | null>();
  const [enemy, setEnemy] = useState<
    Pick<IUser, "nickname"> | undefined | null
  >(opponent);
  const [choice, setChoice] = useState<number | null>();
  const [matchResult, setMatchResult] = useState<IMatchResult | null>();
  const [opponentChoice, setOpponentChoice] = useState<number>();
  const history = useHistory();
  const [roomSendUserOption] = useMutation(roomSendUserChoice);
  const { data, loading } = useQuery<IGetRoom>(getRoom, {
    variables: {
      id,
    },
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    setEnemy(opponent);
    // find opponent
    let user = data?.getRoom?.users?.find(
      (item) => item.user !== localStorage.getItem("id")
    );
    if (!opponent?.nickname) {
      setEnemy(user as any);
    }
  }, [setEnemy, data, opponent]);

  interface RoomGetMatchResult {
    roomGetMatchResult: { result: IMatchResult; opponent: number };
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const matchResult = client
      .subscribe<RoomGetMatchResult>({ query: roomGetMatchResult })
      .subscribe(({ data }) => {
        if (data) {
          setMatchResult(data.roomGetMatchResult.result);
          timeout = setTimeout(() => {
            setMatchResult(null);
          }, 2000);
          setOpponentChoice(data.roomGetMatchResult.opponent);
        }
      });

    return () => {
      matchResult.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (userChoice !== undefined) {
      roomSendUserOption({
        variables: {
          result: userChoice,
          roomId: id,
        },
      });
      setChoice(userChoice);
      setUserChoice(undefined);
    }
  }, [userChoice, setUserChoice, roomSendUserOption, id]);

  if (!loading && data?.getRoom?.errors) {
    return <Error error={"Can't get this room"}></Error>;
  }

  let date;
  if (data) {
    date = new Date(+data.getRoom.createdAt);
  }
  return (
    <section className="room">
      <RoomInfo date={date} enemy={enemy} data={data} />
      {matchResult && (
        <GameResult
          matchResult={matchResult}
          choice={choice}
          random={opponentChoice}
        />
      )}
      <Buttons
        initialResult={enemy?.nickname && !matchResult}
        setUserChoice={setUserChoice}
      />
      <Info />
      <div onClick={() => history.push("/rooms")} className="room-leave">
        leave
      </div>
    </section>
  );
};
export default RoomView;
