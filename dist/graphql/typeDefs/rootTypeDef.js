"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const UserAuth_1 = __importDefault(require("./UserAuth"));
const UserGame_1 = __importDefault(require("./UserGame"));
const Rooms_1 = __importDefault(require("./Rooms"));
const root = apollo_server_express_1.gql `
  directive @auth on FIELD_DEFINITION
  type Response {
    status: String
    errors: [String]
  }
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;
exports.default = [root, UserAuth_1.default, UserGame_1.default, Rooms_1.default];
