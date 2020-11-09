import { gql } from "@apollo/client";

const roomGetMatchResult = gql`
  subscription {
    roomGetMatchResult {
      result
      opponent
    }
  }
`;

export default roomGetMatchResult;
