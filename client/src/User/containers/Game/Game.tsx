import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import sendMatchRes from "../../graphql/Mutation/SendUserMatchResult";
import UserStatistics from "../../components/UserStatistics/UserStatistics";
import getUserMatchResult from "../../graphql/Query/GetUserMatchResult";
import { IMatchResult } from "../../../types/rootTypes";
import Buttons from "../../../Common/components/Buttons/Buttons";
import GameLogic from "../../utilities/GameLogic";
import GameResult from "../../../Common/components/GameResult/GameResult";
import Info from "../../../Common/components/Info/Info";
import Error from "./../../../Common/components/Error/Error";
import Menu from "../../../Common/components/Menu/Menu";
import "./Game.scss";

const Game = () => {
  const history = useHistory();
  const [random, setRandom] = useState<number>();
  const [choice, setChoice] = useState<number | null>();
  const [userChoice, setUserChoice] = useState<number | null>();
  const [matchResult, setMatchResult] = useState<IMatchResult | null>();
  const [sendMatchResult, { error }] = useMutation(sendMatchRes, {});
  const { data, error: MatchResultError } = useQuery(getUserMatchResult);

  useEffect(() => {
    if (userChoice !== undefined && userChoice !== null) {
      const rand = Math.floor(Math.random() * 3);
      setRandom(rand);
      let MatchResult: IMatchResult = GameLogic(rand, userChoice);
      setChoice(userChoice);
      setMatchResult(MatchResult);
      sendMatchResult({
        variables: {
          result: MatchResult,
        },
        refetchQueries: [{ query: getUserMatchResult }],
      }).catch((e) => history.push("/login"));

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
        initialResult={data && !matchResult}
      />
      <Info />
      {data && <UserStatistics statistics={data.getUserMatchResult} />}
    </section>
  );
};
export default Game;
