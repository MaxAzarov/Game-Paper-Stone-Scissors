import UserAuth from "../../services/UserAuth";
import UserGame from "../../services/UserGame";
import { MatchResult } from "../../types/rootTypes";
import { IUser } from "./../../models/User";

const resolvers = {
  Mutation: {
    sendUserMatchResult: async function (
      _: any,
      args: MatchResult,
      context: any
    ) {
      const user: IUser | null = await UserAuth.findUserById(context.user.id);
      if (user) {
        await UserGame.updateMatchResult(user, args);
        return {
          status: "ok",
        };
      } else {
        return {
          errors: ["Invalid user"],
        };
      }
    },
  },
  Query: {
    getUserMatchResult: async function (_: any, __: any, context: any) {
      try {
        const user: IUser | null = await UserAuth.findUserById(context.user.id);
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
      const users = await UserGame.getUsersStatistics();
      return {
        data: [...users],
      };
    },
  },
};

export default resolvers;
