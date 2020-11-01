import { gql } from "@apollo/client";

export const UserRegister = gql`
  mutation Register($email: String!, $nickname: String!, $password: String!) {
    UserRegister(email: $email, nickname: $nickname, password: $password) {
      errors
      status
    }
  }
`;
