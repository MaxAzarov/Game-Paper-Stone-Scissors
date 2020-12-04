"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const getRooms = client_1.gql `
  query {
    getRooms {
      rooms {
        name
        id
        users {
          user
          nickname
        }
        createdAt
        updatedAt
        private
      }
      errors
    }
  }
`;
exports.default = getRooms;
