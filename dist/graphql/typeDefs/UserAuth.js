"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
  type UserLoginResponse {
    id: String
    token: String
    nickname: String
    errors: [String]
  }
  extend type Mutation {
    UserRegister(
      email: String!
      nickname: String!
      password: String!
    ): Response!
  }
  extend type Query {
    UserLogin(data: String!, password: String!): UserLoginResponse!
  }
  extend type Subscription {
    login: Response
  }
`;
exports.default = typeDefs;
