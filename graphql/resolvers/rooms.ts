import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { RedisPubSub } from "graphql-redis-subscriptions";
// import { PubSub } from "apollo-server-express";

import User, { IUser } from "../../models/User";
import Room, { IRoom } from "./../../models/Room";
import GameLogic from "../../client/src/User/utilities/GameLogic";
import { IMatchResult } from "../../types/rootTypes";

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
const resolvers = {
  Query: {
    getRooms: async function (_: any, __: any) {
      const rooms = await Room.find({});
      return {
        rooms: [...rooms],
      };
    },
    getRoom: async function (_: any, { id }: { id: string }) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const room = await Room.findOne({ _id: id });
        if (room) {
          return {
            id: room._id,
            users: [...room.users],
            name: room.name,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            private: room.private,
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
      const candidateRoom = await Room.findOne({ name });
      if (candidateRoom) {
        return {
          errors: [
            "Room with this name exists!",
            "Enter new name and password to create new room",
          ],
        };
      }
      const user = await User.findOne({ _id: context.user.id });

      // if this room is private
      if (password.length > 0) {
        const _id = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newRoom = {
          name,
          password: hashedPassword,
          _id,
          private: true,
        };
        const room = new Room(newRoom);

        room.users.push({
          user: context.user.id,
          nickname: user?.nickname as string,
        });

        await room.save();
        pubsub.publish(ROOM_CREATE, room);
        return {
          id: _id,
          users: [...room.users],
          name,
          password,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          private: true,
        };
      }

      const _id = new mongoose.Types.ObjectId();
      const newRoom = {
        name,
        _id,
        private: false,
      };
      const room = new Room(newRoom);
      room.users.push({
        user: context.user.id,
        nickname: user?.nickname as string,
      });
      await room.save();
      pubsub.publish(ROOM_CREATE, room);
      return {
        id: _id,
        users: [...room.users],
        name,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        private: false,
      };
    },
    // roomUpdate видалення кімнати
    roomUpdate: async function (_: any, { id }: { id: string }, context: any) {
      console.log(id);
      const room: IRoom | null = await Room.findOne({ _id: id });
      if (room) {
        // 1 user in room
        if (room.users.length == 1) {
          await Room.deleteOne({ _id: id });
          // send id to delete in react
          pubsub.publish(ROOM_DELETE, { id });
        } else {
          // 2+ users in room
          room.users = [
            ...room.users.filter((item) => item.user != context.user.id),
          ];
          room.usersGame = [];
          // send id of user
          await room.save();
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
      const room: IRoom | null = await Room.findOne({ _id: id });
      const user = await User.findOne({ _id: context.user.id });
      if (room && room.users.length > 2) {
        return {
          errors: ["Too many users in room..."],
        };
      }
      if (room && user) {
        if (room.private) {
          const match = await bcrypt.compare(password, room.password);
          if (match) {
            room.users.push({
              user: context.user.id,
              nickname: user?.nickname,
            });
            await room.save();
            // subscription
            pubsub.publish(USER_JOIN, {
              id: context.user.id,
              nickname: user.nickname,
            });
            return {
              status: "ok",
            };
          } else {
            return { errors: ["Can\t join to this room :("] };
          }
        } else {
          if (room.users.length > 2) {
            return {
              errors: ["Too many users in room..."],
            };
          }
          room.users.push({
            user: context.user.id,
            nickname: user?.nickname,
          });
          await room.save();
          // subscription
          pubsub.publish(USER_JOIN, {
            id: context.user.id,
            nickname: user.nickname,
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
      const room: IRoom | null = await Room.findOne({ _id: roomId });
      const player: IUser | null = await User.findOne({
        _id: context.user.id,
      });

      if (room && player) {
        const user = room.usersGame.find(
          (item) => item.user != context.user.id
        );
        if (user) {
          const match: IMatchResult = GameLogic(user.choice, result);
          let resultArr: Array<Result> = [];
          resultArr.push({ id: context.user.id, match, opponent: user.choice });
          const match2: IMatchResult = GameLogic(result, user.choice);
          resultArr.push({
            id: user.user,
            match: match2,
            opponent: result,
          });
          pubsub.publish(ROOM_RESULT_SEND, resultArr);
          room.usersGame = [];
          await room.save();
        } else {
          room.usersGame.push({
            user: context.user.id,
            nickname: player.nickname,
            choice: result,
          });
          await room.save();
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
        console.log(payload.private);
        return {
          name: payload.name,
          id: payload._id,
          users: payload.users,
          createdAt: payload.createdAt,
          private: payload.private,
        };
      },
    },
    roomUserJoin: {
      subscribe: () => pubsub.asyncIterator([USER_JOIN]),
      resolve: (payload: any) => {
        // nickname of user
        // id of user
        return {
          user: payload.id,
          nickname: payload.nickname,
        };
      },
    },
    roomLastUserLeave: {
      subscribe: () => pubsub.asyncIterator([ROOM_DELETE]),
      resolve: (payload: any) => {
        // id of room
        return payload.id;
      },
    },
    roomUserLeave: {
      // id of leaving user
      subscribe: () => pubsub.asyncIterator([ROOM_USER_LEAVE]),
      resolve: (payload: any) => {
        return payload;
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
