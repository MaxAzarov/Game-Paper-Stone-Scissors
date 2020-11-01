import { gql } from "apollo-server-express";

const typeDefs = gql`
  type UserLoginResponse {
    id: String
    token: String
    nickname: String
    errors: [String]
  }
  type UserRegisterResponse {
    errors: [String]
    status: String
  }
  extend type Mutation {
    UserRegister(
      email: String!
      nickname: String!
      password: String!
    ): UserRegisterResponse!
  }
  extend type Query {
    UserLogin(data: String!, password: String!): UserLoginResponse!
  }

  extend type Subscription {
    login: UserRegisterResponse
  }
`;
export default typeDefs;
