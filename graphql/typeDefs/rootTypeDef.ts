import { gql } from "apollo-server-express";
import userAuth from "./UserAuth";
import userGame from "./UserGame";
import rooms from "./Rooms";

const root = gql`
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

export default [root, userAuth, userGame, rooms];
