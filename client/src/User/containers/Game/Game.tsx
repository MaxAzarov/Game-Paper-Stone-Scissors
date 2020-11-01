import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import sendMatchRes from "../../graphql/Mutation/SendMatchResult";
import UserStatistics from "../../components/UserStatistics/UserStatistics";
import getUserMatchResult from "../../graphql/Query/GetUserMatchResult";
import {
  IMatchResult,
  Result,
  UserStats,
} from "./../../../../../types/rootTypes";
// import { GameLogic } from "../../../../../utilities/GameLogic";
import Statistics from "../../components/Statistics/Statistics";
import getUsersStatistics from "../../graphql/Query/GetUsersStatistics";
import Buttons from "../../../Common/components/Buttons/Buttons";
import "./Game.scss";
import GameLogic from "../../utilities/GameLogic";

interface IUserStatistics {
  getUsersStatistics: {
    data: [UserStats];
  };
}

const Game = () => {
  const [userChoice, setUserChoice] = useState<number | null>();
  const [random, setRandom] = useState<number>();
  const [result, setResult] = useState<Result>({
    wins: 0,
    defeat: 0,
    draw: 0,
    percentOfWin: 0,
  });
  const [statistics, setStatistics] = useState<UserStats[]>();
  const [sendMatchResult, { data }] = useMutation(sendMatchRes, {
    fetchPolicy: "no-cache",
  });
  const { data: initialResult } = useQuery(getUserMatchResult);
  const { data: stats } = useQuery<IUserStatistics>(getUsersStatistics);

  useEffect(() => {
    if (initialResult) {
      setResult({
        wins: initialResult.getUserMatchResult.wins,
        defeat: initialResult.getUserMatchResult.defeat,
        draw: initialResult.getUserMatchResult.draw,
        percentOfWin: initialResult.getUserMatchResult.percentOfWin,
      });
    }
    if (data) {
      setResult({
        wins: data.sendMatchResult.wins,
        defeat: data.sendMatchResult.defeat,
        draw: data.sendMatchResult.draw,
        percentOfWin: data.sendMatchResult.percentOfWin,
      });
      setStatistics(data.sendMatchResult.data);
    }
  }, [initialResult, data, setStatistics]);

  useEffect(() => {
    let MatchResult: IMatchResult;
    setRandom(Math.floor(Math.random() * 3));
    if (userChoice !== undefined) {
      console.log("random:", random);
      console.log("user:", userChoice);
      MatchResult = GameLogic(random as number, userChoice as number);
      console.log("result", MatchResult);
      sendMatchResult({
        variables: {
          result: MatchResult,
        },
      });
    }
    setUserChoice(undefined);
  }, [userChoice, setUserChoice, sendMatchResult, random]);

  useEffect(() => {
    if (stats) {
      setStatistics(stats.getUsersStatistics.data);
    }
  }, [setStatistics, stats]);
  return (
    <section className="single-game">
      <div className="single-game__wrapper">
        {/* all statistics */}
        {statistics && (
          <Statistics getUsersStatistics={statistics}></Statistics>
        )}
        {!initialResult && (
          <div className="single-game__error">
            Please login to play! &nbsp;
            {
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#000" }}
              >
                Click here to login
              </Link>
            }
          </div>
        )}
        <Buttons
          setUserChoice={setUserChoice}
          initialResult={initialResult}
        ></Buttons>
        <UserStatistics statistics={result}></UserStatistics>
      </div>
    </section>
  );
};
export default Game;
