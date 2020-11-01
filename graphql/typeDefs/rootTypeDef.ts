import { gql } from "apollo-server-express";
import userAuth from "./UserAuth";
import userGame from "./UserGame";
import rooms from "./Rooms";

const root = gql`
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
