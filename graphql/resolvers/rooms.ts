import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { PubSubEngine } from "graphql-subscriptions";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { IUser } from "../../models/User";
import { IRoom } from "./../../models/Room";
import GameLogic from "../../client/src/User/utilities/GameLogic";
import { IMatchResult } from "../../client/src/types/rootTypes";
import Rooms from "./../../services/Rooms";
import UserAuth from "../../services/UserAuth";

const ROOM_CREATE = "ROOM_CREATE";
const USER_JOIN = "USER_JOIN";
const ROOM_DELETE = "ROOM_DELETE";
const ROOM_USER_LEAVE = "ROOM_USER_LEAVE";
const ROOM_RESULT_SEND = "ROOM_RESULT_SEND";

let pubsub: PubSubEngine;
try {
  pubsub = new RedisPubSub({
    connection: {
      host: "127.0.0.1",
      // host: "redis",
      port: 6379,
      retry_strategy: (options: any) => Math.max(options.attempt * 100, 20),
    },
  });
} catch (e) {
  console.log(e.message);
}

const withCancel = (asyncIterator, onCancel) => {
  const asyncReturn = asyncIterator.return;

  console.log(asyncIterator);

  asyncIterator.return = () => {
    onCancel();
    return asyncReturn
      ? asyncReturn.call(asyncIterator)
      : Promise.resolve({ value: undefined, done: true });
  };

  return asyncIterator;
};

interface Result {
  id: string;
  match: IMatchResult;
  opponent: number;
}
const resolvers = {
  Query: {
    getRooms: async function (): Promise<{
      rooms: IRoom[];
    }> {
      const rooms = await Rooms.getAllRooms();
      return {
        rooms: [...rooms],
      };
    },
    getRoom: async function (
      _: any,
      { id }: { id: string }
    ): Promise<
      | {
          id: any;
          users: any[];
          name: string;
          createdAt: string;
          updatedAt: string;
          private: boolean;
          errors?: undefined;
        }
      | {
          errors: string[];
          id?: undefined;
          users?: undefined;
          name?: undefined;
          createdAt?: undefined;
          updatedAt?: undefined;
          private?: undefined;
        }
    > {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const room = await Rooms.getRoomById(id);
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
      const candidateRoom = await Rooms.getRoomByName(name);
      if (candidateRoom) {
        return {
          errors: [
            "Room with this name exists!",
            "Enter new name and password to create new room",
          ],
        };
      }
      const user = await UserAuth.findUserById(context.user.id);

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

        const room: IRoom = await Rooms.createNewRoomAndAddUsers(
          newRoom,
          context.user.id,
          user!.nickname
        );

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

      // room is not private
      const _id = new mongoose.Types.ObjectId();
      const newRoom = {
        name,
        _id,
        private: false,
      };
      const room = await Rooms.createNewRoomAndAddUsers(
        newRoom,
        context.user.id,
        user!.nickname
      );

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
    roomUpdate: async function (
      _: any,
      { id }: { id: string },
      context: any
    ): Promise<
      | {
          status: string;
          errors?: undefined;
        }
      | {
          errors: string[];
          status?: undefined;
        }
    > {
      const room = await Rooms.getRoomById(id);

      if (room) {
        // 1 user in room
        const usersAmount = await Rooms.checkRoomUsers(room);
        console.log("userAmount", usersAmount);
        if (usersAmount == 1) {
          await Rooms.deleteRoomById(id);
          pubsub.publish(ROOM_DELETE, { id }); // send id into client
        } else {
          // 2+ users in room
          await Rooms.userLeaveRoom(room, context.user.id);
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
    ): Promise<
      | {
          errors: string[];
          status?: undefined;
        }
      | {
          status: string;
          errors?: undefined;
        }
    > {
      const room: IRoom | null = await Rooms.getRoomById(id);
      const user = await UserAuth.findUserById(context.user.id);
      if (room && user) {
        const usersAmount = +Rooms.checkRoomUsers(room);
        if (usersAmount >= 2) {
          return {
            errors: ["Too many users in room..."],
          };
        }
        if (room.private) {
          const match = await bcrypt.compare(password, room.password);
          if (match) {
            await Rooms.RoomAddUser(room, context.user.id, user.nickname);
            // subscription
            pubsub.publish(USER_JOIN, {
              id: context.user.id,
              nickname: user.nickname,
            });
            return {
              status: "ok",
            };
          } else {
            return { errors: ["Can't join to this room :("] };
          }
        } else {
          await Rooms.RoomAddUser(room, context.user.id, user.nickname);
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
        return {
          errors: ["This room doesn't exist"],
        };
      }
    },
    // room and result
    roomSendUserChoice: async function (
      _: any,
      { result, roomId }: { result: number; roomId: string },
      context: any
    ): Promise<
      | {
          errors: string[];
          status?: undefined;
        }
      | {
          status: string;
          errors?: undefined;
        }
    > {
      const room: IRoom | null = await Rooms.getRoomById(roomId);
      const player: IUser | null = await UserAuth.findUserById(context.user.id);

      if (room && player) {
        const user = await Rooms.getUserChoice(room, context.user.id);

        if (user) {
          const match: IMatchResult = GameLogic(user.choice, result);
          const resultArr: Array<Result> = [];
          resultArr.push({ id: context.user.id, match, opponent: user.choice });
          const match2: IMatchResult = GameLogic(result, user.choice);
          resultArr.push({
            id: user.user,
            match: match2,
            opponent: result,
          });
          pubsub.publish(ROOM_RESULT_SEND, resultArr);

          await Rooms.deleteUsersGame(room);
        } else {
          await Rooms.addUserChoice(
            room,
            context.user.id,
            player.nickname,
            result
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
      subscribe: (): AsyncIterator<any> => pubsub.asyncIterator([ROOM_CREATE]),
      resolve: (payload: IRoom): Partial<IRoom> => {
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
      subscribe: (): AsyncIterator<any> => pubsub.asyncIterator([USER_JOIN]),
      resolve: (payload: {
        id: string;
        nickname: string;
      }): {
        user: string;
        nickname: string;
      } => {
        return {
          user: payload.id, // id of user
          nickname: payload.nickname, // nickname of user
        };
      },
    },
    roomLastUserLeave: {
      subscribe: (): AsyncIterator<any> => pubsub.asyncIterator([ROOM_DELETE]),
      resolve: (payload: { id: number }): number => {
        return payload.id; // id of room
      },
    },
    roomUserLeave: {
      subscribe: (): AsyncIterator<any> =>
        pubsub.asyncIterator([ROOM_USER_LEAVE]),
      resolve: (payload: string): string => {
        return payload; // id of leaving user
      },
    },
    roomGetMatchResult: {
      subscribe: (): AsyncIterator<any> =>
        pubsub.asyncIterator(ROOM_RESULT_SEND),
      resolve: (
        payload: Array<Result>,
        args: any,
        context: any
      ):
        | {
            result: IMatchResult;
            opponent: number;
          }
        | undefined => {
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
