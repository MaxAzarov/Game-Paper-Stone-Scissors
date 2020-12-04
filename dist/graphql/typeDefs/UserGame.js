"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typedefs = apollo_server_express_1.gql `
  type MatchResultResponse {
    errors: [String]
    wins: Int
    defeat: Int
    draw: Int
    percentOfWin: Float
    data: [UserStats]
  }
  type UserStats {
    nickname: String
    percentOfWin: Float
  }
  type UsersStatistics {
    errors: [String]
    data: [UserStats]
  }
  extend type Mutation {
    sendUserMatchResult(result: String!): Response! @auth
  }
  extend type Query {
    getUserMatchResult: MatchResultResponse! @auth
    getUsersStatistics: UsersStatistics!
  }
`;
exports.default = typedefs;
