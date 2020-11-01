import { gql } from "@apollo/client";

const roomSendUserChoice = gql`
  mutation roomSendUserChoice($result: Int!, $roomId: String!) {
    roomSendUserChoice(result: $result, roomId: $roomId) {
      status
      error
    }
  }
`;

export default roomSendUserChoice;
