import { gql } from "@apollo/client";

const getRooms = gql`
  query {
    getRooms {
      rooms {
        name
        password
        id
        users {
          user
          nickname
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export default getRooms;
