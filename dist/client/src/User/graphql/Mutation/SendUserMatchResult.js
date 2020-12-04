"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const SendMatchResult = client_1.gql `
  mutation sendUserMatchResult($result: String!) {
    sendUserMatchResult(result: $result) {
      errors
      status
    }
  }
`;
exports.default = SendMatchResult;
