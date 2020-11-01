import React from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import { SetUserLogin } from "./redux/actions/user";
import Login from "./User/containers/Login/Login";
import Registration from "./User/containers/Registration/Registration";
import Game from "./User/containers/Game/Game";
import Home from "./Common/components/Home/Home";
import RoomsView from "./Rooms/containers/RoomContainer/RoomContainer";
import RoomCreate from "./Rooms/containers/RoomCreation/RoomCreation";
import Room from "./Rooms/containers/Room/Room";
import "./App.scss";

function App() {
  const dispatch = useDispatch();
  const token: string | null = localStorage.getItem("token");
  const id: string | null = localStorage.getItem("id");
  const nickname: string | null = localStorage.getItem("nickname");
  if (token && id && nickname) {
    dispatch(SetUserLogin(token, id, nickname));
  }

  return (
    <Switch>
      <Route path="/login">
        <Login></Login>
      </Route>
      <Route path="/register" exact>
        <Registration></Registration>
      </Route>
      <Route path="/game" exact>
        <Game></Game>
      </Route>
      <Route path="/rooms" exact>
        <RoomsView></RoomsView>
      </Route>
      <Route path="/room/:id">
        <Room></Room>
      </Route>
      <Route path="/room-create" exact>
        <RoomCreate></RoomCreate>
      </Route>
      <Route path="/" exact>
        <Home></Home>
      </Route>
    </Switch>
  );
}

export default App;
