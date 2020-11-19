import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import sendMatchRes from "../../graphql/Mutation/SendUserMatchResult";
import UserStatistics from "../../components/UserStatistics/UserStatistics";
import getUserMatchResult from "../../graphql/Query/GetUserMatchResult";
import { IMatchResult } from "./../../../../../types/rootTypes";
import Buttons from "../../../Common/components/Buttons/Buttons";
import GameLogic from "../../utilities/GameLogic";
import GameResult from "../../../Common/components/GameResult/GameResult";
import Info from "../../../Common/components/Info/Info";
import "./Game.scss";

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

  useEffect(() => {
    if (data) {
      refetch().catch((e) => console.log("users statistics"));
    }
  }, [data, refetch]);

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
      <div className="single-game__info">
        <p>Your nickname: {localStorage.getItem("nickname")}</p>
        <Link to="statistics" className="single-game__link">
          <p>Best users</p>
        </Link>
      </div>
      <GameResult
        choice={choice}
        random={random}
        matchResult={matchResult}
      ></GameResult>
      <Buttons
        setUserChoice={setUserChoice}
        initialResult={initialUserResult}
        error={error || MatchResultError}
      ></Buttons>
      <Info></Info>
      {initialUserResult && (
        <UserStatistics
          statistics={initialUserResult.getUserMatchResult}
        ></UserStatistics>
      )}
    </section>
  );
};
export default Game;
