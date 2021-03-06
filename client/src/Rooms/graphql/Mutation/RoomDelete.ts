import { gql } from "@apollo/client";

const roomUpdate = gql`
  mutation roomUpdate($id: String!) {
    roomUpdate(id: $id) {
      status
      errors
    }
  }
`;

export default roomUpdate;
