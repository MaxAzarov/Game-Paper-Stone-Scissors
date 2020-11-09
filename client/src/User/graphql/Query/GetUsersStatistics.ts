import { gql } from "@apollo/client";

const getUsersStatistics = gql`
  query {
    getUsersStatistics {
      errors
      data {
        nickname
        percentOfWin
      }
    }
  }
`;

export default getUsersStatistics;
