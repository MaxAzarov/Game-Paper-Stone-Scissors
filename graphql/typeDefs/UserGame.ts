import { gql } from "apollo-server-express";

const typedefs = gql`
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

export default typedefs;
