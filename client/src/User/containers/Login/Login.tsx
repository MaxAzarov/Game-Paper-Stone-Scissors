import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import UserLogin from "../../graphql/Query/UserLogin";
import { SetUserLogin } from "../../../redux/actions/user";
import { IUser } from "../../../../../types/rootTypes";
import "./Login.scss";

interface IUserLogin {
  UserLogin: {
    errors: [string];
  } & IUser;
}

const Login = () => {
  const [userData, setUserData] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userLogin, { data }] = useLazyQuery<IUserLogin>(UserLogin);
  const dispatch = useDispatch();
  const history = useHistory();
  if (data?.UserLogin.id && data?.UserLogin.token && data?.UserLogin.nickname) {
    localStorage.setItem("token", data.UserLogin.token);
    localStorage.setItem("id", data.UserLogin.id);
    localStorage.setItem("nickname", data.UserLogin.nickname);
    dispatch(
      SetUserLogin(
        data.UserLogin.token,
        data.UserLogin.id,
        data.UserLogin.nickname
      )
    );
    history.push("/game");
  }
  return (
    <section className="login-wrapper">
      <div className="login">
        <p className="login-title">Login</p>
        <div className="login-row">
          <label htmlFor="email">Email/Nick:</label>
          <input
            type="text"
            value={userData}
            id="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserData(e.target.value)
            }
          />
        </div>
        <div className="login-row">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          onClick={() => {
            userLogin({
              variables: {
                data: userData,
                password,
              },
            });
          }}
        >
          Login!
        </button>
      </div>
    </section>
  );
};
export default Login;
