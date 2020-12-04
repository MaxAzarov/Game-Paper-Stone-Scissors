"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegister = void 0;
const client_1 = require("@apollo/client");
exports.UserRegister = client_1.gql `
  mutation Register($email: String!, $nickname: String!, $password: String!) {
    UserRegister(email: $email, nickname: $nickname, password: $password) {
      errors
      status
    }
  }
`;
