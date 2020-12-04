"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomGetMatchResult = client_1.gql `
  subscription {
    roomGetMatchResult {
      result
      opponent
    }
  }
`;
exports.default = roomGetMatchResult;
