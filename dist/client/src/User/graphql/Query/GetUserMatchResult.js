"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const getUserMatchResult = client_1.gql `
  query getUserMatchResult {
    getUserMatchResult {
      wins
      draw
      errors
      defeat
      percentOfWin
    }
  }
`;
exports.default = getUserMatchResult;
