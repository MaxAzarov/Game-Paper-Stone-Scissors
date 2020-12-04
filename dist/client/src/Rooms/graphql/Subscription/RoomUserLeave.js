"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomUserLeave = client_1.gql `
  subscription {
    roomUserLeave
  }
`;
exports.default = roomUserLeave;
