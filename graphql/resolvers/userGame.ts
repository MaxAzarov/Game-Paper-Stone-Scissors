import { MatchResult } from "../../types/rootTypes";
import User, { IUser } from "./../../models/User";

const resolvers = {
  Mutation: {
    sendMatchResult: async function (_: any, args: MatchResult, context: any) {
      // console.log(args);
      // console.log("context user:", context.user);
      if (context.user.id) {
        // console.log(context.user.id);
        const user: IUser | null = await User.findById(context.user.id);
        // console.log(user);
        if (user) {
          // console.log("user exist");
          if (args.result == "Win") {
            user.wins += 1;
          } else if (args.result == "Draw") {
            user.draw += 1;
          } else if (args.result == "Defeat") {
            user.defeat += 1;
          }
          user.percentOfWin = +parseFloat(
            (
              (user.wins / (user.wins + user.defeat + user.draw)) *
              100
            ).toString()
          ).toFixed(2);
          await user.save();
          const users = await User.find({})
            .select("nickname percentOfWin -_id")
            .sort({ percentOfWin: -1 });
          return {
            wins: user.wins,
            defeat: user.defeat,
            draw: user.draw,
            percentOfWin: user.percentOfWin,
            data: [...users],
          };
        } else {
          return {
            errors: ["Invalid user!"],
          };
        }
      } else {
        return { errors: ["Invalid user!"] };
      }
    },
  },
  Query: {
    getUserMatchResult: async function (
      _: any,
      args: MatchResult,
      context: any
    ) {
      if (context.user.id) {
        const user = await User.findById(context.user.id);
        // console.log(user);

        if (user) {
          return {
            wins: user.wins,
            defeat: user.defeat,
            draw: user.draw,
            percentOfWin: user.percentOfWin,
          };
        } else {
          throw {
            error: ["Please login again to play!"],
          };
          // return {
          //   error: ["Please login again!"],
          // };
        }
      } else {
        throw {
          error: ["Please login again to play!"],
        };
        // return {
        //   error: ["Please login again!"],
        // };
      }
    },
    getUsersStatistics: async function () {
      const users = await User.find({})
        .select("nickname percentOfWin -_id")
        .sort({ percentOfWin: -1 });
      console.log("users:", users);
      if (!users) {
        return {
          error: ["Can't get statistics of users"],
        };
      }
      return {
        data: [...users],
      };
    },
  },
};

export default resolvers;
