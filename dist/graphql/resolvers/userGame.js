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
const User_1 = __importDefault(require("./../../models/User"));
const resolvers = {
    Mutation: {
        sendUserMatchResult: function (_, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield User_1.default.findById(context.user.id);
                if (user) {
                    if (args.result == "Win") {
                        user.wins += 1;
                    }
                    else if (args.result == "Draw") {
                        user.draw += 1;
                    }
                    else if (args.result == "Defeat") {
                        user.defeat += 1;
                    }
                    user.percentOfWin = +parseFloat(((user.wins / (user.wins + user.defeat + user.draw)) * 100).toString()).toFixed(2);
                    yield user.save();
                    return {
                        status: "ok",
                    };
                }
                else {
                    return {
                        errors: ["Invalid user!"],
                    };
                }
            });
        },
    },
    Query: {
        getUserMatchResult: function (_, __, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield User_1.default.findById(context.user.id);
                if (user) {
                    return {
                        wins: user.wins,
                        defeat: user.defeat,
                        draw: user.draw,
                        percentOfWin: user.percentOfWin,
                    };
                }
                else {
                    return {
                        errors: ["Please login again to play!"],
                    };
                }
            });
        },
        getUsersStatistics: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const users = yield User_1.default.find({})
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
            });
        },
    },
};
exports.default = resolvers;
