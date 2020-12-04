import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import sendMatchRes from "../../graphql/Mutation/SendUserMatchResult";
import UserStatistics from "../../components/UserStatistics/UserStatistics";
import getUserMatchResult from "../../graphql/Query/GetUserMatchResult";
import { IMatchResult } from "./../../../../../types/rootTypes";
import Buttons from "../../../Common/components/Buttons/Buttons";
import GameLogic from "../../utilities/GameLogic";
import GameResult from "../../../Common/components/GameResult/GameResult";
import Info from "../../../Common/components/Info/Info";
import Error from "./../../../Common/components/Error/Error";
import Menu from "../../../Common/components/Menu/Menu";
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

  const history = useHistory();
  useEffect(() => {
    if (data) {
      refetch().catch((e) => {
        history.push("/login");
      });
    }
  }, [data, refetch, history]);

  useEffect(() => {
    if (userChoice !== undefined && userChoice !== null) {
      let MatchResult: IMatchResult;
      let rand = Math.floor(Math.random() * 3);
      setRandom(rand);
      MatchResult = GameLogic(rand, userChoice as number);
      setChoice(userChoice);
      setMatchResult(MatchResult);
      sendMatchResult({
        variables: {
          result: MatchResult,
        },
      }).catch((e) => {
        history.push("/login");
      });

      setTimeout(() => {
        setMatchResult(undefined);
      }, 2000);
      setUserChoice(undefined);
    }
  }, [userChoice, setUserChoice, sendMatchResult, random, history]);

  return (
    <section className="single-game">
      <Menu />
      {matchResult && (
        <GameResult choice={choice} random={random} matchResult={matchResult} />
      )}
      {error && <Error error={error?.message} />}
      {MatchResultError && <Error error={MatchResultError?.message} />}
      <Buttons
        setUserChoice={setUserChoice}
        initialResult={initialUserResult && !matchResult}
      />
      <Info />
      {initialUserResult && (
        <UserStatistics statistics={initialUserResult.getUserMatchResult} />
      )}
    </section>
  );
};
export default Game;
