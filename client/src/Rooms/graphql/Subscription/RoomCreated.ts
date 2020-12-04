import { gql } from "@apollo/client";

const roomCreated = gql`
  subscription {
    roomCreated {
      id
      name
      users {
        user
        nickname
      }
      createdAt
      private
    }
  }
`;

export default roomCreated;
