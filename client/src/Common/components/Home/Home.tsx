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
      <p className="home-game">
        <Link to="/game" style={{ textDecoration: "none" }}>
          <span>Start personal game!</span>
        </Link>
      </p>
      <p className="home-room">
        <Link to="/rooms" style={{ textDecoration: "none" }}>
          <span>Play online</span>
        </Link>
      </p>
    </section>
  );
};
export default Home;
