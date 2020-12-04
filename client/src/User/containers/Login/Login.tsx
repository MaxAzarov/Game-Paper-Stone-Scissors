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
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userLogin, { data }] = useLazyQuery<IUserLogin>(UserLogin);
  const [errors, setErrors] = useState<string[] | null | undefined>(
    data?.UserLogin?.errors
  );
  if (data?.UserLogin.id && data?.UserLogin.token && data?.UserLogin.nickname) {
    localStorage.setItem("token", data.UserLogin.token);
    localStorage.setItem("id", data.UserLogin.id);
    localStorage.setItem("nickname", data.UserLogin.nickname);
    history.push("/");
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
    <section className="login">
      <div className="login-wrapper">
        <p className="login-title">Login</p>
        <img
          src={require("./../../../Common/components/Home/logo2.png")}
          alt=""
        />
        <input
          type="text"
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"Email"}
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Password"}
        />
        {errors?.length &&
          errors.map((item, index) => (
            <p className="login-error" key={index}>
              {item}
            </p>
          ))}
        <button
          onClick={() => userLogin({ variables: { data: email, password } })}
        >
          Login!
        </button>
        <p className="login-register">
          Don't have an account? &nbsp;
          <Link to="/register" style={{ textDecoration: "none" }}>
            <span>Click here to register!</span>
          </Link>
          &nbsp;
          <Link to="/" style={{ textDecoration: "none" }}>
            <span>Home</span>
          </Link>
        </p>
      </div>
    </section>
  );
};
export default Login;
