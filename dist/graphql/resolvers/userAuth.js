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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./../../models/User"));
const resolvers = {
    Query: {
        UserLogin: function (_, { data, password }) {
            return __awaiter(this, void 0, void 0, function* () {
                // email
                const candidateEmail = yield User_1.default.findOne({ email: data });
                if (candidateEmail) {
                    const match = yield bcryptjs_1.default.compare(password, candidateEmail.password);
                    if (match) {
                        const token = yield jsonwebtoken_1.default.sign({ id: candidateEmail._id }, "secretkey", {
                            expiresIn: "1h",
                        });
                        return {
                            token,
                            id: candidateEmail._id,
                            nickname: candidateEmail.nickname,
                        };
                    }
                    else {
                        return {
                            errors: [
                                "Password don't match with this email/nickname",
                                "Enter correct password",
                            ],
                        };
                    }
                }
                else {
                    const candidateNickName = yield User_1.default.findOne({
                        nickname: data,
                    });
                    if (candidateNickName) {
                        const token = yield jsonwebtoken_1.default.sign({ id: candidateNickName._id, nick: data }, "secretkey", {
                            expiresIn: "1h",
                        });
                        return {
                            token,
                            id: candidateNickName._id,
                        };
                    }
                    else {
                        return {
                            errors: [
                                "There isn't user with this email or nickname!",
                                "Please enter correct email or nickname!",
                            ],
                        };
                    }
                }
            });
        },
    },
    Mutation: {
        UserRegister: function (_, { email, nickname, password }) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield User_1.default.findOne({ email });
                if (user) {
                    return {
                        errors: ["This email is occupied!", "Try another email to register!"],
                    };
                }
                else {
                    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                    const newUser = new User_1.default({ email, nickname, password: hashedPassword });
                    yield newUser.save();
                    return {
                        status: "ok",
                    };
                }
            });
        },
    },
};
exports.default = resolvers;
