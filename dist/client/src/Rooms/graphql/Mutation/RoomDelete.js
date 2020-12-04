"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomUpdate = client_1.gql `
  mutation roomUpdate($id: String!) {
    roomUpdate(id: $id) {
      status
      errors
    }
  }
`;
exports.default = roomUpdate;
