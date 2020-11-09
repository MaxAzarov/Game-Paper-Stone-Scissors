import { gql } from "@apollo/client";

const getRooms = gql`
  query {
    getRooms {
      rooms {
        name
        id
        users {
          user
          nickname
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export default getRooms;
