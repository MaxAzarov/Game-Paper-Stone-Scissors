import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import sendMatchRes from "../../graphql/Mutation/SendUserMatchResult";
import UserStatistics from "../../components/UserStatistics/UserStatistics";
import getUserMatchResult from "../../graphql/Query/GetUserMatchResult";
import { IMatchResult, UserStats } from "./../../../../../types/rootTypes";
import Statistics from "../../components/Statistics/Statistics";
import getUsersStatistics from "../../graphql/Query/GetUsersStatistics";
import Buttons from "../../../Common/components/Buttons/Buttons";
import GameLogic from "../../utilities/GameLogic";
import GameResult from "../../../Common/components/GameResult/GameResult";
import GameError from "../../../Common/components/GameError/GameError";
import "./Game.scss";

interface IUserStatistics {
  getUsersStatistics: {
    data: [UserStats];
  };
}

const Game = () => {
  const [userChoice, setUserChoice] = useState<number | null>();
  const [random, setRandom] = useState<number>();
  const [choice, setChoice] = useState<number | null>();
  const [matchResult, setMatchResult] = useState<IMatchResult | null>();
  const [sendMatchResult, { data, error }] = useMutation(sendMatchRes);
  const {
    data: initialUserResult,
    error: MatchResultError,
    refetch,
  } = useQuery(getUserMatchResult);
  const { data: stats, refetch: UserStatisticsRefetch } = useQuery<
    IUserStatistics
  >(getUsersStatistics);

  useEffect(() => {
    if (data) {
      UserStatisticsRefetch().catch((e) => console.log("user statistics"));
      refetch().catch((e) => console.log("users statistics"));
    }
  }, [data, refetch, UserStatisticsRefetch]);

  useEffect(() => {
    if (userChoice !== undefined && userChoice !== null) {
      let MatchResult: IMatchResult;
      let rand = Math.floor(Math.random() * 3);
      setRandom(rand);
      MatchResult = GameLogic(rand, userChoice as number);
      console.log("random:", random);
      console.log("user:", userChoice);
      console.log("result", MatchResult);
      setChoice(userChoice);
      setMatchResult(MatchResult);
      sendMatchResult({
        variables: {
          result: MatchResult,
        },
      });
      setUserChoice(undefined);
    }
  }, [userChoice, setUserChoice, sendMatchResult, random]);

  return (
    <section className="single-game">
      {/* <div className="single-game__wrapper"> */}
      {stats && (
        <Statistics
          getUsersStatistics={stats.getUsersStatistics.data}
        ></Statistics>
      )}
      <GameResult
        choice={choice}
        random={random}
        matchResult={matchResult}
      ></GameResult>
      {(!initialUserResult || error || MatchResultError) && (
        <GameError></GameError>
      )}
      <Buttons
        setUserChoice={setUserChoice}
        initialResult={initialUserResult}
      ></Buttons>
      {initialUserResult && (
        <UserStatistics
          statistics={initialUserResult.getUserMatchResult}
        ></UserStatistics>
      )}
      {/* </div> */}
    </section>
  );
};
export default Game;
