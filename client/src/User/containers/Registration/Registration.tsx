import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

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
    <section className="registration-wrapper">
      {data?.UserRegister?.errors}
      <img
        src={require("./../../../Common/components/Home/logo2.png")}
        alt=""
      />
      <div className="registration">
        <div className="registration-row">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="registration-row">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickName(e.target.value)}
          />
        </div>

        <div className="registration-row">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="registration-row">
          <label htmlFor="repPassword">Repeat password:</label>
          <input
            type="password"
            id="repPassword"
            value={repPassword}
            onChange={(e) => setRepPassword(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            userRegister({
              variables: {
                email,
                nickname,
                password,
              },
            });
          }}
        >
          Register!
        </button>
      </div>
    </section>
  );
};
export default Registration;
