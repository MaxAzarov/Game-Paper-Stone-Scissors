import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";

import UserLogin from "../../graphql/Query/UserLogin";
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
  const [errors, setErrors] = useState<string[] | null | undefined>(
    data?.UserLogin?.errors
  );
  // console.log(data);
  const history = useHistory();
  if (data?.UserLogin.id && data?.UserLogin.token && data?.UserLogin.nickname) {
    localStorage.setItem("token", data.UserLogin.token);
    localStorage.setItem("id", data.UserLogin.id);
    localStorage.setItem("nickname", data.UserLogin.nickname);
    history.push("/game");
  }

  useEffect(() => {
    if (data) {
      setErrors(data.UserLogin.errors);
      setTimeout(() => {
        setErrors(undefined);
      }, 3000);
    }
  }, [data]);
  return (
    <section className="login-wrapper">
      <img
        src={require("./../../../Common/components/Home/logo2.png")}
        alt=""
      />
      <div className="login">
        <p className="login-title">Login</p>
        <div className="login-row">
          <label htmlFor="email">Email/Nick:</label>
          <input
            type="text"
            value={userData}
            id="email"
            onChange={(e) => setUserData(e.target.value)}
          />
        </div>
        <div className="login-row">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors?.length &&
          errors.map((item, index) => (
            <p className="login-error" key={index}>
              {item}
            </p>
          ))}

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
        <p className="login-register">
          Don't have an account? &nbsp;
          <Link to="/register" style={{ textDecoration: "none" }}>
            <span>Click here to register!</span>
          </Link>
        </p>
      </div>
    </section>
  );
};
export default Login;
