"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAuth_1 = __importDefault(require("./userAuth"));
const userGame_1 = __importDefault(require("./userGame"));
const rooms_1 = __importDefault(require("./rooms"));
exports.default = [userAuth_1.default, userGame_1.default, rooms_1.default];
