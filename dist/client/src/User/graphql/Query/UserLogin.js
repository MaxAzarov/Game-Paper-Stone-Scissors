"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const UserLogin = client_1.gql `
  query UserLogin($data: String!, $password: String!) {
    UserLogin(data: $data, password: $password) {
      id
      token
      nickname
      errors
    }
  }
`;
exports.default = UserLogin;
