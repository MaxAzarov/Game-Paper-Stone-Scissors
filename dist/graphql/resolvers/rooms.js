"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
// import { PubSub } from "apollo-server-express";
const User_1 = __importDefault(require("../../models/User"));
const Room_1 = __importDefault(require("./../../models/Room"));
const GameLogic_1 = __importDefault(require("../../client/src/User/utilities/GameLogic"));
const ROOM_CREATE = "ROOM_CREATE";
const USER_JOIN = "USER_JOIN";
const ROOM_DELETE = "ROOM_DELETE";
const ROOM_USER_LEAVE = "ROOM_USER_LEAVE";
const ROOM_RESULT_SEND = "ROOM_RESULT_SEND";
const pubsub = new graphql_redis_subscriptions_1.RedisPubSub({
    connection: {
        host: "127.0.0.1",
        port: 6379,
        retry_strategy: (options) => Math.max(options.attempt * 100, 3000),
    },
});
const resolvers = {
    Query: {
        getRooms: function (_, __) {
            return __awaiter(this, void 0, void 0, function* () {
                const rooms = yield Room_1.default.find({});
                return {
                    rooms: [...rooms],
                };
            });
        },
        getRoom: function (_, { id }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (mongoose_1.default.Types.ObjectId.isValid(id)) {
                    const room = yield Room_1.default.findOne({ _id: id });
                    if (room) {
                        return {
                            id: room._id,
                            users: [...room.users],
                            name: room.name,
                            createdAt: room.createdAt,
                            updatedAt: room.updatedAt,
                            private: room.private,
                        };
                    }
                    else {
                        return {
                            errors: ["Can't find room with this id"],
                        };
                    }
                }
                else {
                    return {
                        errors: ["Can't find room with this id"],
                    };
                }
            });
        },
    },
    Mutation: {
        roomCreate: function (_, { name, password }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                // check if this room exists
                const candidateRoom = yield Room_1.default.findOne({ name });
                if (candidateRoom) {
                    return {
                        errors: [
                            "Room with this name exists!",
                            "Enter new name and password to create new room",
                        ],
                    };
                }
                const user = yield User_1.default.findOne({ _id: context.user.id });
                // if this room is private
                if (password.length > 0) {
                    const _id = new mongoose_1.default.Types.ObjectId();
                    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                    const newRoom = {
                        name,
                        password: hashedPassword,
                        _id,
                        private: true,
                    };
                    const room = new Room_1.default(newRoom);
                    room.users.push({
                        user: context.user.id,
                        nickname: user === null || user === void 0 ? void 0 : user.nickname,
                    });
                    yield room.save();
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
                const _id = new mongoose_1.default.Types.ObjectId();
                const newRoom = {
                    name,
                    _id,
                    private: false,
                };
                const room = new Room_1.default(newRoom);
                room.users.push({
                    user: context.user.id,
                    nickname: user === null || user === void 0 ? void 0 : user.nickname,
                });
                yield room.save();
                pubsub.publish(ROOM_CREATE, room);
                return {
                    id: _id,
                    users: [...room.users],
                    name,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt,
                    private: false,
                };
            });
        },
        // roomUpdate видалення кімнати
        roomUpdate: function (_, { id }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(id);
                const room = yield Room_1.default.findOne({ _id: id });
                if (room) {
                    // 1 user in room
                    if (room.users.length == 1) {
                        yield Room_1.default.deleteOne({ _id: id });
                        // send id to delete in react
                        pubsub.publish(ROOM_DELETE, { id });
                    }
                    else {
                        // 2+ users in room
                        room.users = [
                            ...room.users.filter((item) => item.user != context.user.id),
                        ];
                        room.usersGame = [];
                        // send id of user
                        yield room.save();
                        pubsub.publish(ROOM_USER_LEAVE, context.user.id);
                    }
                    return {
                        status: "ok",
                    };
                }
                else {
                    return {
                        errors: ["Can't delete room"],
                    };
                }
            });
        },
        roomJoin: function (_, { id, password }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const room = yield Room_1.default.findOne({ _id: id });
                const user = yield User_1.default.findOne({ _id: context.user.id });
                if (room && room.users.length > 2) {
                    return {
                        errors: ["Too many users in room..."],
                    };
                }
                if (room && user) {
                    if (room.private) {
                        const match = yield bcryptjs_1.default.compare(password, room.password);
                        if (match) {
                            room.users.push({
                                user: context.user.id,
                                nickname: user === null || user === void 0 ? void 0 : user.nickname,
                            });
                            yield room.save();
                            // subscription
                            pubsub.publish(USER_JOIN, {
                                id: context.user.id,
                                nickname: user.nickname,
                            });
                            return {
                                status: "ok",
                            };
                        }
                        else {
                            return { errors: ["Can\t join to this room :("] };
                        }
                    }
                    else {
                        if (room.users.length > 2) {
                            return {
                                errors: ["Too many users in room..."],
                            };
                        }
                        room.users.push({
                            user: context.user.id,
                            nickname: user === null || user === void 0 ? void 0 : user.nickname,
                        });
                        yield room.save();
                        // subscription
                        pubsub.publish(USER_JOIN, {
                            id: context.user.id,
                            nickname: user.nickname,
                        });
                        return {
                            status: "ok",
                        };
                    }
                }
                else {
                    return { errors: ["Can\t join to this room :("] };
                }
            });
        },
        // room and result
        roomSendUserChoice: function (_, { result, roomId }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const room = yield Room_1.default.findOne({ _id: roomId });
                const player = yield User_1.default.findOne({
                    _id: context.user.id,
                });
                if (room && player) {
                    const user = room.usersGame.find((item) => item.user != context.user.id);
                    if (user) {
                        const match = GameLogic_1.default(user.choice, result);
                        let resultArr = [];
                        resultArr.push({ id: context.user.id, match, opponent: user.choice });
                        const match2 = GameLogic_1.default(result, user.choice);
                        resultArr.push({
                            id: user.user,
                            match: match2,
                            opponent: result,
                        });
                        pubsub.publish(ROOM_RESULT_SEND, resultArr);
                        room.usersGame = [];
                        yield room.save();
                    }
                    else {
                        room.usersGame.push({
                            user: context.user.id,
                            nickname: player.nickname,
                            choice: result,
                        });
                        yield room.save();
                    }
                }
                else {
                    return {
                        errors: ["This room don't exist"],
                    };
                }
                return {
                    status: "ok",
                };
            });
        },
    },
    Subscription: {
        roomCreated: {
            subscribe: () => pubsub.asyncIterator([ROOM_CREATE]),
            resolve: (payload) => {
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
            resolve: (payload) => {
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
            resolve: (payload) => {
                // id of room
                return payload.id;
            },
        },
        roomUserLeave: {
            // id of leaving user
            subscribe: () => pubsub.asyncIterator([ROOM_USER_LEAVE]),
            resolve: (payload) => {
                return payload;
            },
        },
        roomGetMatchResult: {
            subscribe: () => pubsub.asyncIterator(ROOM_RESULT_SEND),
            resolve: (payload, args, context) => {
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
exports.default = resolvers;
