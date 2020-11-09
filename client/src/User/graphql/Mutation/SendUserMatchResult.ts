import { gql } from "@apollo/client";

const SendMatchResult = gql`
  mutation sendUserMatchResult($result: String!) {
    sendUserMatchResult(result: $result) {
      errors
      status
    }
  }
`;

export default SendMatchResult;
