import { gql } from "@apollo/client";

const getUsersStatistics = gql`
  query {
    getUsersStatistics {
      error
      data {
        nickname
        percentOfWin
      }
    }
  }
`;

export default getUsersStatistics;
