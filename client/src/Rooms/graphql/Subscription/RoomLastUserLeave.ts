import { gql } from "@apollo/client";

const roomLastUserLeave = gql`
  subscription {
    roomLastUserLeave
  }
`;

export default roomLastUserLeave;
