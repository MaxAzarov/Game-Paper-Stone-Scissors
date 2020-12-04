import React from "react";
import { Link } from "react-router-dom";

import gif from "./gif.gif";
import "./Home.scss";

const Home = () => {
  return (
    <section className="home">
      <img src={gif} alt="" className="gif1" />
      <img src={gif} alt="" className="gif2" />
      <p className="home-title">Game</p>
      <img src={require("./logo2.png")} className="home-logo" alt="" />
      <Link to="/game" className="home-link" style={{ textDecoration: "none" }}>
        <span>Start personal game!</span>
      </Link>
      <Link
        to="/rooms"
        className="home-link"
        style={{ textDecoration: "none" }}
      >
        <span>Play online</span>
      </Link>
      <Link
        to="/login"
        className="home-link"
        style={{ textDecoration: "none" }}
      >
        <span>Register</span>
      </Link>
      <Link
        to="/login"
        className="home-link"
        style={{ textDecoration: "none" }}
      >
        <span>Login</span>
      </Link>
    </section>
  );
};
export default Home;
