import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./User/containers/Login/Login";
import Registration from "./User/containers/Registration/Registration";
import Game from "./User/containers/Game/Game";
import Home from "./Common/components/Home/Home";
import RoomsView from "./Rooms/containers/RoomContainer/RoomContainer";
import RoomCreate from "./Rooms/containers/RoomCreation/RoomCreation";
import PrivateRoute from "./Common/components/PrivateRoute/PrivateRoute";
import Statistics from "./User/containers/Statistics/Statistics";
import Room from "./Rooms/containers/Room/Room";
import "./App.scss";

const App = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register" exact>
        <Registration></Registration>
      </Route>
      <PrivateRoute path="/game" exact component={Game} />
      <PrivateRoute path="/rooms" exact component={RoomsView}></PrivateRoute>
      <PrivateRoute path="/room/:id" exact component={Room}></PrivateRoute>
      <PrivateRoute
        path="/room-create"
        exact
        component={RoomCreate}
      ></PrivateRoute>
      <Route path="/statistics" exact>
        <Statistics></Statistics>
      </Route>
      <Route path="/" exact>
        <Home></Home>
      </Route>
    </Switch>
  );
};

export default App;
