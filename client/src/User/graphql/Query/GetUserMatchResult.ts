import { gql } from "@apollo/client";

const getUserMatchResult = gql`
  query getUserMatchResult {
    getUserMatchResult {
      wins
      draw
      error
      defeat
      percentOfWin
    }
  }
`;

export default getUserMatchResult;
