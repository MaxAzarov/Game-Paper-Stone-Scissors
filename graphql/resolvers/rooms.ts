import mongoose from "mongoose";
import { PubSub } from "apollo-server-express";

import User, { IUser } from "../../models/User";
import Room, { IRoom } from "./../../models/Room";
import GameLogic from "../../client/src/User/utilities/GameLogic";
import { IMatchResult } from "../../types/rootTypes";

const ROOM_CREATE = "ROOM_CREATE";
const USER_JOIN = "USER_JOIN";
const ROOM_DELETE = "ROOM_DELETE";
const ROOM_USER_LEAVE = "ROOM_USER_LEAVE";
const ROOM_RESULT_SEND = "ROOM_RESULT_SEND";
const pubsub = new PubSub();

const resolvers = {
  Query: {
    getRooms: async function () {
      // error handling
      const rooms = await Room.find({});
      if (rooms) {
        return {
          rooms: [...rooms],
        };
      }
    },
    getRoom: async function (_: any, { id }: { id: string }) {
      const room = await Room.findOne({ _id: id });
      // console.log(room);
      if (room != null) {
        return {
          id: room._id,
          users: [...room.users],
          name: room.name,
          // password: room.password,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        };
      } else {
        return {
          error: ["can't find room with this id"],
        };
      }
    },
  },
  Mutation: {
    // створення кімнати
    roomCreate: async function (
      _: any,
      { name, password }: { name: string; password: string },
      context: any
    ) {
      console.log(name, password);
      if (context.user.id) {
        if (name && password) {
          const _id = new mongoose.Types.ObjectId();
          const newRoom = {
            name,
            password,
            _id,
          };
          const room = new Room(newRoom);
          console.log("_id", context.user.id);
          const user = await User.findOne({ _id: context.user.id });
          console.log(user);
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
          };
        } else {
          return {
            error: ["Enter name and password to create a room"],
          };
        }
      } else {
        return {
          error: ["You need to be authorized to create a room!"],
        };
      }
    },
    // видалення кімнати
    // roomUpdate
    roomUpdate: async function (_: any, { id }: { id: string }, context: any) {
      const room: IRoom | null = await Room.findOne({ _id: id });
      if (room) {
        // 1 user in room
        if (room.users.length == 1) {
          await Room.deleteOne({ _id: id });
          // send id to delete in react
          pubsub.publish(ROOM_DELETE, { id });
        } else if (room && context.user.id) {
          // 2+ users in room
          room.users = [
            ...room.users.filter((item) => item.user != context.user.id),
          ];
          // send id of user
          await room.save();
          pubsub.publish(ROOM_USER_LEAVE, context.user.id);
        }

        return {
          status: "ok",
        };
      } else {
        return {
          error: ["can't delete room"],
        };
      }
    },
    roomJoin: async function (
      _: any,
      { id, password }: { id: string; password: string },
      context: any
    ) {
      // console.log("roomJoin", id);
      if (context.user.id) {
        const room: IRoom | null = await Room.findOne({ _id: id });
        // console.log("room", room);
        const user = await User.findOne({ _id: context.user.id });

        if (room && user) {
          if (room.password == password) {
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
          return {
            error: ["Can\t join to this room :("],
          };
        }
      } else {
        return {
          error: ["Can\t join to this room :("],
        };
      }
    },

    // room and result
    roomSendUserChoice: async function (
      _: any,
      { result, roomId }: { result: number; roomId: string },
      context: any
    ) {
      console.log(result, roomId, context.user.id);
      if (context.user.id) {
        // console.log("1");
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
            pubsub.publish(ROOM_RESULT_SEND, { id: context.user.id, match });
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
            error: ["This room don't exist"],
          };
        }
      } else {
        return {
          error: ["Login again to play!"],
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
        // console.log("room:", payload.room);
        console.log(payload._id);
        return {
          name: payload.name,
          id: payload._id,
          users: payload.users,
          createdAt: payload.createdAt,
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
      subscribe: () => pubsub.asyncIterator([ROOM_USER_LEAVE]),
      resolve: (payload: any) => {
        // id of leaving user
        return payload;
      },
    },
    roomGetMatchResult: {
      subscribe: () => pubsub.asyncIterator([ROOM_RESULT_SEND]),
      resolve: (payload: any, args: any, context: any) => {
        // {id , result }
        if (context.user.id == payload.id) {
          return payload.match;
        } else {
          if (payload.match == "Win") {
            return "Defeat";
          } else if (payload.match == "Defeat") {
            return "Win";
          } else {
            return "Draw";
          }
        }
      },
    },
  },
};

export default resolvers;
