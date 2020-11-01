import { IMatchResult } from "../../../../types/rootTypes";

const GameLogic = (random: number, userChoice: number): IMatchResult => {
  if (
    ((random as number) === 0 && userChoice === 1) ||
    ((random as number) === 1 && userChoice === 2) ||
    ((random as number) === 2 && userChoice === 0)
  ) {
    console.log("random win!");
    return "Defeat";
  } else if (
    ((random as number) === 1 && userChoice === 0) ||
    ((random as number) === 2 && userChoice === 1) ||
    ((random as number) === 0 && userChoice === 2)
  ) {
    console.log("you win");
    return "Win";
  } else if (
    userChoice !== undefined &&
    random !== undefined &&
    userChoice === random
  ) {
    console.log("draw!");
    return "Draw";
  }
  return "Defeat";
};

export default GameLogic;
