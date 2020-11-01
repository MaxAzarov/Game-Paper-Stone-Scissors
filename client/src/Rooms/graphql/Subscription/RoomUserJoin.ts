import { gql } from "@apollo/client";

const roomUserJoin = gql`
  subscription roomUserJoin {
    roomUserJoin {
      user
      nickname
    }
  }
`;
export default roomUserJoin;
