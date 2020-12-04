import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { client } from "../../..";
import { IUser } from "../../../../../types/rootTypes";
import roomUserJoin from "../../graphql/Subscription/RoomUserJoin";
import roomUpdate from "./../../graphql/Mutation/RoomDelete";
import roomUserLeave from "../../graphql/Subscription/RoomUserLeave";
import RoomView from "./RoomView";

interface Props {
  id: string;
}

// wrapper for /room/:id
const Rooms = ({ match }: RouteComponentProps<Props>) => {
  const [RoomUpdate] = useMutation(roomUpdate);
  const [opponent, setOpponent] = useState<IUser | null | undefined>();

  useEffect(() => {
    const userJoin = client
      .subscribe({
        query: roomUserJoin,
      })
      .subscribe(({ data }) => {
        setOpponent(data.roomUserJoin);
      });

    const userLeave = client
      .subscribe({ query: roomUserLeave })
      .subscribe(({ data: userId }) => {
        setOpponent(undefined);
      });

    return () => {
      userJoin.unsubscribe();
      userLeave.unsubscribe();
      RoomUpdate({
        variables: {
          id: match.params.id,
        },
      }).catch((e) => console.log(e));
    };
  }, [RoomUpdate, match.params.id]);

  return <RoomView id={match.params.id} opponent={opponent} />;
};
export default withRouter(Rooms);
