import { gql } from "apollo-server-express";

const typedefs = gql`
  type Error {
    error: [String]
  }

  type MatchResultResponse {
    error: [String]
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
    error: [String]
    data: [UserStats]
  }

  extend type Mutation {
    sendMatchResult(result: String!): MatchResultResponse!
  }

  extend type Query {
    getUserMatchResult: MatchResultResponse!
    getUsersStatistics: UsersStatistics!
  }
`;

export default typedefs;
