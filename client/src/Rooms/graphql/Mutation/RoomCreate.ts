import { gql } from "@apollo/client";

const RoomCreate = gql`
  mutation roomCreate($name: String!, $password: String!) {
    roomCreate(name: $name, password: $password) {
      id
      users {
        user
        nickname
      }
      name
      password
      createdAt
      updatedAt
    }
  }
`;
export default RoomCreate;
