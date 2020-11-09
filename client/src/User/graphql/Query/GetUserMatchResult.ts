import { gql } from "@apollo/client";

const getUserMatchResult = gql`
  query getUserMatchResult {
    getUserMatchResult {
      wins
      draw
      errors
      defeat
      percentOfWin
    }
  }
`;

export default getUserMatchResult;
