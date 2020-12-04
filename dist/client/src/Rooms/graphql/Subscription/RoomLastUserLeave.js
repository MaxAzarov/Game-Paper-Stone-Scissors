"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomLastUserLeave = client_1.gql `
  subscription {
    roomLastUserLeave
  }
`;
exports.default = roomLastUserLeave;
