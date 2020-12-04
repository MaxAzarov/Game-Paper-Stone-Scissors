import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";

import { UserRegister } from "../../graphql/Mutation/UserRegister";
import { Response } from "../../../../../types/rootTypes";
import "./Registration.scss";

interface IUserRegister {
  UserRegister: Response;
}
interface IUserRegistersVariables {
  email: string;
  nickname: string;
  password: string;
}

const Registration: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repPassword, setRepPassword] = useState<string>("");
  const [userRegister, { data }] = useMutation<
    IUserRegister,
    IUserRegistersVariables
  >(UserRegister);

  if (data && data.UserRegister.status) {
    history.push("/login");
  }
  return (
    <section className="registration">
      {data?.UserRegister?.errors}
      <div className="registration-wrapper">
        <div className="registration-title">Register</div>
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
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickName(e.target.value)}
          placeholder={"Nickname"}
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"Password"}
        />
        <input
          type="password"
          id="repPassword"
          value={repPassword}
          onChange={(e) => setRepPassword(e.target.value)}
          placeholder={"Repeat password"}
        />
        <button
          onClick={() =>
            userRegister({ variables: { email, nickname, password } })
          }
        >
          Register!
        </button>
        <Link
          to="/login"
          className="registration-link"
          style={{ textDecoration: "none" }}
        >
          Have an account?
        </Link>
        <Link
          to="/"
          className="registration-link"
          style={{ textDecoration: "none" }}
        >
          Home
        </Link>
      </div>
    </section>
  );
};
export default Registration;
