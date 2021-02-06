import pool from "../../db";
import { MatchResult } from "../../types/rootTypes";
import CountPercentOfWin from "../../utils/CountPercentOfWin";

const resolvers = {
  Mutation: {
    sendUserMatchResult: async function (
      _: any,
      args: MatchResult,
      context: any
    ) {
      try {
        if (args.result == "Win") {
          await pool.query(
            `update user_account set wins = wins + 1 where user_id = $1`,
            [context.user.id]
          );
        } else if (args.result == "Draw") {
          await pool.query(
            `update user_account set draw = draw + 1 where user_id = $1`,
            [context.user.id]
          );
        } else if (args.result == "Defeat") {
          await pool.query(
            `update user_account set defeat = defeat + 1 where user_id = $1`,
            [context.user.id]
          );
        }
        return {
          status: "ok",
        };
      } catch (e) {
        return {
          errors: ["Invalid user!"],
        };
      }
    },
  },
  Query: {
    getUserMatchResult: async function (_: any, __: any, context: any) {
      const user = await pool.query(
        `select wins,defeat,draw from user_account where user_id = $1`,
        [context.user.id]
      );

      const { wins, defeat, draw } = user.rows[0];

      const percentOfWin = CountPercentOfWin(wins, defeat, draw);

      if (user.rows[0]) {
        return {
          wins: user.rows[0].wins,
          defeat: user.rows[0].defeat,
          draw: user.rows[0].draw,
          percentOfWin,
        };
      } else {
        return {
          errors: ["Please login again to play!"],
        };
      }
    },
    getUsersStatistics: async function () {
      const users = await pool.query(
        `select nickname, wins, defeat, draw from user_account`
      );
      if (!users.rows) {
        return {
          errors: ["Can't get statistics of users"],
        };
      }

      const normalizedUsers: {
        nickname: string;
        percentOfWin: number;
      }[] = [];

      users.rows.map((item) => {
        const percentOfWin = CountPercentOfWin(
          item.wins,
          item.defeat,
          item.draw
        );
        normalizedUsers.push({ nickname: item.nickname, percentOfWin });
      });
      return {
        data: [...normalizedUsers],
      };
    },
  },
};

export default resolvers;
