"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const RoomCreate = client_1.gql `
  mutation roomCreate($name: String!, $password: String!) {
    roomCreate(name: $name, password: $password) {
      id
      users {
        user
        nickname
      }
      name
      createdAt
      updatedAt
      errors
      private
    }
  }
`;
exports.default = RoomCreate;
