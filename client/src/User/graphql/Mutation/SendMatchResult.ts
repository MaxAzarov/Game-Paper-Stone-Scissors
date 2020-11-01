import { gql } from "@apollo/client";

const SendMatchResult = gql`
  mutation sendMatchResult($result: String!) {
    sendMatchResult(result: $result) {
      error
      wins
      defeat
      draw
      percentOfWin
      data {
        nickname
        percentOfWin
      }
    }
  }
`;

export default SendMatchResult;
