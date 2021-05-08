import User, { IUser } from "./../models/User";
import { MatchResult } from "../client/src/types/rootTypes";

class UserGame {
  async updateMatchResult(user: IUser, args: MatchResult) {
    if (args.result == "Win") {
      user.wins += 1;
    } else if (args.result == "Draw") {
      user.draw += 1;
    } else if (args.result == "Defeat") {
      user.defeat += 1;
    }
    user.percentOfWin = +parseFloat(
      ((user.wins / (user.wins + user.defeat + user.draw)) * 100).toString()
    ).toFixed(2);

    await user.save();
  }

  async getUsersStatistics() {
    const users = await User.find({})
      .select("nickname percentOfWin -_id")
      .sort({ percentOfWin: -1 });

    return users;
  }
}

export default new UserGame();
