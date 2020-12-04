"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomJoin = client_1.gql `
  mutation roomJoin($id: String!, $password: String) {
    roomJoin(id: $id, password: $password) {
      errors
      status
    }
  }
`;
exports.default = roomJoin;
