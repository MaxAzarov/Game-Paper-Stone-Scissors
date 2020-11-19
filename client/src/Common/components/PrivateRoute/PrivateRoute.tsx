import React from "react";
import { Route, Redirect } from "react-router-dom";

interface Props {
  component: React.ComponentType<any>;
  path: any;
  exact: any;
}

const PrivateRoute = ({ component: Component, ...rest }: Props) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <Component {...props}></Component>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    ></Route>
  );
};
export default PrivateRoute;
