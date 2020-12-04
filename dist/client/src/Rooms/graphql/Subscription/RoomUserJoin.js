"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const roomUserJoin = client_1.gql `
  subscription roomUserJoin {
    roomUserJoin {
      user
      nickname
    }
  }
`;
exports.default = roomUserJoin;
