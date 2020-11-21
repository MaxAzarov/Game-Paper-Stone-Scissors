import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    user: String
    nickname: String
  }

  enum MatchResult {
    Win
    Defeat
    Draw
  }

  type RoomUserChoiceAndResult {
    result: MatchResult
    opponent: Int
  }

  type GetRoomResponse {
    id: ID
    users: [User]
    name: String
    createdAt: String
    updatedAt: String
    errors: [String!]
    private: Boolean
  }
  type Rooms {
    rooms: [GetRoomResponse]
    errors: [String!]
  }
  extend type Mutation {
    roomCreate(name: String!, password: String!): GetRoomResponse @auth
    roomUpdate(id: String!): Response @auth
    roomJoin(id: String!, password: String): Response @auth
    roomSendUserChoice(roomId: String!, result: Int!): Response @auth
  }
  extend type Query {
    getRooms: Rooms @auth
    getRoom(id: String!): GetRoomResponse @auth
  }

  extend type Subscription {
    roomCreated: GetRoomResponse
    roomUserJoin: User
    roomLastUserLeave: String!
    roomUserLeave: String!
    roomGetMatchResult: RoomUserChoiceAndResult! @auth
  }
`;
export default typeDefs;
