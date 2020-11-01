import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    user: String
    nickname: String
    # id: String
  }
  type Response {
    status: String
    error: [String]
  }

  enum MatchResult {
    Win
    Defeat
    Draw
  }
  type GetRoomResponse {
    id: ID
    users: [User]
    name: String
    password: String
    createdAt: String
    updatedAt: String
    error: [String!]
  }
  type Rooms {
    rooms: [GetRoomResponse]
  }
  extend type Mutation {
    roomCreate(name: String!, password: String!): GetRoomResponse
    roomUpdate(id: String!): Response
    roomJoin(id: String!, password: String!): Response
    roomSendUserChoice(roomId: String!, result: Int!): Response
  }
  extend type Query {
    getRooms: Rooms
    getRoom(id: String!): GetRoomResponse
  }

  extend type Subscription {
    roomCreated: GetRoomResponse
    roomUserJoin: User
    roomLastUserLeave: String!
    roomUserLeave: String!
    roomGetMatchResult: MatchResult!
  }
`;
export default typeDefs;
