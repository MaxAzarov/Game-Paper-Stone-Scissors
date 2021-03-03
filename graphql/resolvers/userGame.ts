import { MatchResult } from "../../types/rootTypes";
import User, { IUser } from "./../../models/User";

const resolvers = {
  Mutation: {
    sendUserMatchResult: async function (
      _: any,
      args: MatchResult,
      context: any
    ) {
      const user: IUser | null = await User.findById(context.user.id);
      if (user) {
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
        return {
          status: "ok",
        };
      } else {
        return {
          errors: ["Invalid user!"],
        };
      }
    },
  },
  Query: {
    getUserMatchResult: async function (_: any, __: any, context: any) {
      try {
        const user = await User.findById(context.user.id);

        if (user) {
          return {
            wins: user.wins,
            defeat: user.defeat,
            draw: user.draw,
            percentOfWin: user.percentOfWin,
          };
        } else {
          return {
            errors: ["Please login again to play!"],
          };
        }
      } catch (e) {
        return {
          errors: ["Please login again to play!"],
        };
      }
    },
    getUsersStatistics: async function () {
      const users = await User.find({})
        .select("nickname percentOfWin -_id")
        .sort({ percentOfWin: -1 });
      if (!users) {
        return {
          errors: ["Can't get statistics of users"],
        };
      }
      return {
        data: [...users],
      };
    },
  },
};

export default resolvers;
