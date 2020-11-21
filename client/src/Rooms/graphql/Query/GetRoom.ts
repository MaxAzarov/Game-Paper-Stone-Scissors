import { gql } from "@apollo/client";

const getRoom = gql`
  query getRoom($id: String!) {
    getRoom(id: $id) {
      id
      users {
        user
        nickname
      }
      name
      createdAt
      updatedAt
      private
      errors
    }
  }
`;
export default getRoom;
