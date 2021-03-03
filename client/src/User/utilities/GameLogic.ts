import { IMatchResult } from "../../../../types/rootTypes";

enum Match {
  Stone = 0,
  Scissors = 1,
  Paper = 2,
}

const GameLogic = (random: number, userChoice: number): IMatchResult => {
  if (
    ((random as number) === Match.Stone && userChoice === Match.Scissors) ||
    ((random as number) === Match.Scissors && userChoice === Match.Paper) ||
    ((random as number) === Match.Paper && userChoice === Match.Stone)
  ) {
    return "Defeat";
  } else if (
    ((random as number) === Match.Scissors && userChoice === Match.Stone) ||
    ((random as number) === Match.Paper && userChoice === Match.Scissors) ||
    ((random as number) === Match.Stone && userChoice === Match.Paper)
  ) {
    return "Win";
  } else if (
    userChoice !== undefined &&
    random !== undefined &&
    userChoice === random
  ) {
    return "Draw";
  }
  return "Defeat";
};

export default GameLogic;
