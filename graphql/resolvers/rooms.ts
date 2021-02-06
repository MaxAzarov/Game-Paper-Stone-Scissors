import bcrypt from "bcryptjs";
import { RedisPubSub } from "graphql-redis-subscriptions";
// import { PubSub } from "apollo-server-express";

import GameLogic from "../../client/src/User/utilities/GameLogic";
import { IMatchResult, IRoom } from "../../types/rootTypes";
import pool from "../../db";

const ROOM_CREATE = "ROOM_CREATE";
const USER_JOIN = "USER_JOIN";
const ROOM_DELETE = "ROOM_DELETE";
const ROOM_USER_LEAVE = "ROOM_USER_LEAVE";
const ROOM_RESULT_SEND = "ROOM_RESULT_SEND";

const pubsub = new RedisPubSub({
  connection: {
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: (options: any) => Math.max(options.attempt * 100, 3000),
  },
});
// const pubsub = new PubSub();
// (pubsub as any).ee.setMaxListeners(Infinity);
interface Result {
  id: string;
  match: IMatchResult;
  opponent: number;
}

interface Room {
  room_id: string;
  room_name: string;
  room_password: string;
  private: boolean;
  createdat: Date;
}

const resolvers = {
  Query: {
    getRooms: async function () {
      const rooms = await pool.query(
        `select user_id as user, nickname, room_id, room_name, createdat, private from room left join room_user using(room_id)`
      );
      let normalizedRooms: IRoom[] = [];

      rooms.rows.map((room) => {
        const candidateRoom: IRoom | undefined = normalizedRooms.find(
          (item) => item.name == room.room_name
        );
        if (candidateRoom) {
          candidateRoom.users.push({
            user: room.user,
            nickname: room.nickname,
          });
        } else {
          let item: IRoom = {
            id: room.room_id,
            users: [{ user: room.user_id, nickname: room.nickname }],
            name: room.room_name,
            createdAt: room.createdat,
            updatedAt: room.createdat,
            private: room.private,
          };
          normalizedRooms.push(item);
        }
      });
      return {
        rooms: [...normalizedRooms],
      };
    },
    getRoom: async function (_: any, { id }: { id: string }) {
      const room: {
        rows: Room[];
      } = await pool.query(`select * from room where room_id = $1`, [id]);

      if (room.rows[0]) {
        const users = await pool.query(
          `select user_id as user, nickname from room_user where room_id = $1`,
          [id]
        );

        if (room) {
          return {
            id: room.rows[0].room_id,
            users: [...users.rows],
            name: room.rows[0].room_name,
            createdAt: room.rows[0].createdat,
            updatedAt: room.rows[0].createdat,
            private: room.rows[0].private,
          };
        } else {
          return {
            errors: ["Can't find room with this id"],
          };
        }
      } else {
        return {
          errors: ["Can't find room with this id"],
        };
      }
    },
  },
  Mutation: {
    roomCreate: async function (
      _: any,
      { name, password }: { name: string; password: string },
      context: any
    ) {
      // check if this room exists
      const candidateRoom = await pool.query(
        `select * from room where room_name = $1`,
        [name]
      );

      if (candidateRoom.rows[0]) {
        return {
          errors: [
            "Room with this name exists!",
            "Enter new name and password to create new room",
          ],
        };
      }

      const user = await pool.query(
        `select user_id, nickname from user_account where user_id = $1`,
        [context.user.id]
      );

      //  check if this room is private
      if (password.length > 0) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const room = await pool.query(
          `insert into room(room_name,room_password,private) values($1,$2,$3) returning * `,
          [name, hashedPassword, true]
        );

        const room_user = await pool.query(
          `insert into room_user(user_id,nickname,room_id) values($1,$2,$3) returning user_id as user, nickname `,
          [user.rows[0].user_id, user.rows[0].nickname, room.rows[0].room_id]
        );

        let room_normalized = {
          name: room.rows[0].room_name,
          id: room.rows[0].room_id,
          users: room_user.rows,
          createdAt: room.rows[0].createdat,
          private: room.rows[0].private,
        };
        pubsub.publish(ROOM_CREATE, room_normalized);
        return {
          id: room.rows[0].room_id,
          users: room_user.rows,
          name,
          createdAt: room.rows[0].createdat,
          updatedAt: room.rows[0].createdat,
          private: true,
        };
      }
      // public room
      const room = await pool.query(
        `insert into room(room_name,private) values($1,$2,$3) returning * `,
        [name, true]
      );

      const room_user = await pool.query(
        `insert into room_user(user_id,nickname,room_id) values($1,$2,$3)  returning user_id as user, nickname `,
        [user.rows[0].user_id, user.rows[0].nickname, room.rows[0].room_id]
      );

      let room_normalized = {
        name: room.rows[0].room_name,
        id: room.rows[0].room_id,
        users: room_user.rows,
        createdAt: room.rows[0].createdat,
        private: room.rows[0].private,
      };

      pubsub.publish(ROOM_CREATE, room_normalized);
      return {
        id: room.rows[0].room_id,
        users: [...room_user.rows],
        name,
        createdAt: room.rows[0].createdat,
        updatedAt: room.rows[0].createdat,
        private: true,
      };
    },
    // roomUpdate
    roomUpdate: async function (_: any, { id }: { id: string }, context: any) {
      const room = await pool.query(`select * from room where room_id = $1`, [
        id,
      ]);
      if (room.rows[0]) {
        // select room_users
        const room_users = await pool.query(
          `select * from room_user where room_id = $1`,
          [id]
        );
        // 1 user in room
        if (room_users.rowCount == 1) {
          await pool.query(`delete from room_user where room_id = $1`, [id]);
          await pool.query(`delete from room where room_id = $1`, [id]);
          // send id to delete into react
          pubsub.publish(ROOM_DELETE, { id });
        } else {
          // 2+ users in room
          await pool.query(`delete from room_user where user_id = $1`, [
            context.user.id,
          ]);
          await pool.query(`delete from user_choices where room_id = $1`, [id]);
          // send id of user
          pubsub.publish(ROOM_USER_LEAVE, context.user.id);
        }
        return {
          status: "ok",
        };
      } else {
        return {
          errors: ["Can't delete room"],
        };
      }
    },
    roomJoin: async function (
      _: any,
      { id, password }: { id: string; password: string },
      context: any
    ) {
      const room = await pool.query(`select * from room where room_id = $1`, [
        id,
      ]);

      const user = await pool.query(
        `select * from user_account where user_id = $1`,
        [context.user.id]
      );

      const users = await pool.query(
        `select * from room_user where room_id = $1`,
        [id]
      );

      if (users.rowCount > 2) {
        return {
          errors: ["Too many users in room..."],
        };
      }
      if (room.rows[0] && user.rows[0]) {
        if (room.rows[0].private) {
          const match = await bcrypt.compare(
            password,
            room.rows[0].room_password
          );
          if (match) {
            await pool.query(
              `insert into room_user(user_id,nickname,room_id) values($1,$2,$3)`,
              [context.user.id, user.rows[0].nickname, id]
            );
            // subscription
            pubsub.publish(USER_JOIN, {
              id: context.user.id,
              nickname: user.rows[0].nickname,
            });
            return {
              status: "ok",
            };
          } else {
            return { errors: ["Can't join to this room :("] };
          }
        } else {
          if (users.rowCount > 2) {
            return {
              errors: ["Too many users in room..."],
            };
          }
          await pool.query(
            `insert into room_user(user_id,nickname,room_id) values($1,$2,$3)`,
            [context.user.id, user.rows[0].nickname, id]
          );
          // subscription
          pubsub.publish(USER_JOIN, {
            id: context.user.id,
            nickname: user.rows[0].nickname,
          });
          return {
            status: "ok",
          };
        }
      } else {
        return { errors: ["Can\t join to this room :("] };
      }
    },
    // room and result
    roomSendUserChoice: async function (
      _: any,
      { result, roomId }: { result: number; roomId: string },
      context: any
    ) {
      const room = await pool.query(`select * from room where room_id = $1`, [
        roomId,
      ]);

      const player = await pool.query(
        `select * from room_user where user_id = $1`,
        [context.user.id]
      );
      if (room.rows[0] && player.rows[0]) {
        // search opponent choice
        const user = await pool.query(
          `select * from user_choices where room_id = $1`,
          [roomId]
        );
        if (user.rows[0]) {
          const match: IMatchResult = GameLogic(user.rows[0].choice, result);
          let resultArr: Array<Result> = [];
          resultArr.push({
            id: context.user.id,
            match,
            opponent: user.rows[0].choice,
          });
          const match2: IMatchResult = GameLogic(result, user.rows[0].choice);
          resultArr.push({
            id: user.rows[0].user_id,
            match: match2,
            opponent: result,
          });
          pubsub.publish(ROOM_RESULT_SEND, resultArr);
          await pool.query(`delete from user_choices where room_id = $1`, [
            roomId,
          ]);
        } else {
          await pool.query(
            `insert into user_choices(user_id,nickname,choice,room_id) values($1,$2,$3,$4)`,
            [
              context.user.id,
              player.rows[0].nickname,
              result,
              room.rows[0].room_id,
            ]
          );
        }
      } else {
        return {
          errors: ["This room don't exist"],
        };
      }
      return {
        status: "ok",
      };
    },
  },
  Subscription: {
    roomCreated: {
      subscribe: () => pubsub.asyncIterator([ROOM_CREATE]),
      resolve: (payload: any) => {
        return {
          name: payload.name,
          id: payload.id,
          users: payload.users,
          createdAt: payload.createdAt,
          private: payload.private,
        };
      },
    },
    roomUserJoin: {
      subscribe: () => pubsub.asyncIterator([USER_JOIN]),
      resolve: (payload: any) => {
        return {
          user: payload.id, // id of user
          nickname: payload.nickname, // nickname of user
        };
      },
    },
    roomLastUserLeave: {
      subscribe: () => pubsub.asyncIterator([ROOM_DELETE]),
      resolve: (payload: any) => {
        return payload.id; // id of room
      },
    },
    roomUserLeave: {
      subscribe: () => pubsub.asyncIterator([ROOM_USER_LEAVE]),
      resolve: (payload: any) => {
        return payload; // id of leaving user
      },
    },
    roomGetMatchResult: {
      subscribe: () => pubsub.asyncIterator(ROOM_RESULT_SEND),
      resolve: (payload: Array<Result>, args: any, context: any) => {
        for (let i = 0; i < payload.length; i++) {
          if (context.user.id == payload[i].id) {
            return {
              result: payload[i].match,
              opponent: payload[i].opponent,
            };
          }
        }
      },
    },
  },
};

export default resolvers;
