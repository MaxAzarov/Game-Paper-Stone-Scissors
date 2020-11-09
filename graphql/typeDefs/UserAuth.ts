import { gql } from "apollo-server-express";

const typeDefs = gql`
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
export default typeDefs;
