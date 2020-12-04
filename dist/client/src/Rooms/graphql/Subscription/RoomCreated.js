"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomCreated = client_1.gql `
  subscription {
    roomCreated {
      id
      name
      users {
        user
        nickname
      }
      createdAt
      private
    }
  }
`;
exports.default = roomCreated;
