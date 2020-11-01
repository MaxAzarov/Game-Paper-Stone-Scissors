import { gql } from "@apollo/client";

const roomJoin = gql`
  mutation roomJoin($id: String!, $password: String!) {
    roomJoin(id: $id, password: $password) {
      error
      status
    }
  }
`;

export default roomJoin;
