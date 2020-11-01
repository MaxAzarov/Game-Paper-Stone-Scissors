import { gql } from "@apollo/client";

const UserLogin = gql`
  query UserLogin($data: String!, $password: String!) {
    UserLogin(data: $data, password: $password) {
      id
      token
      nickname
      errors
    }
  }
`;
export default UserLogin;
