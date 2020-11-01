import { gql } from "@apollo/client";

const roomUserLeave = gql`
  subscription {
    roomUserLeave
  }
`;
export default roomUserLeave;
