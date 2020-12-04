"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const getRoom = client_1.gql `
  query getRoom($id: String!) {
    getRoom(id: $id) {
      id
      users {
        user
        nickname
      }
      name
      createdAt
      updatedAt
      private
      errors
    }
  }
`;
exports.default = getRoom;
