"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomSendUserChoice = client_1.gql `
  mutation roomSendUserChoice($result: Int!, $roomId: String!) {
    roomSendUserChoice(result: $result, roomId: $roomId) {
      status
      errors
    }
  }
`;
exports.default = roomSendUserChoice;
