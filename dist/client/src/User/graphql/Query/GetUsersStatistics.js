"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const getUsersStatistics = client_1.gql `
  query {
    getUsersStatistics {
      errors
      data {
        nickname
        percentOfWin
      }
    }
  }
`;
exports.default = getUsersStatistics;
