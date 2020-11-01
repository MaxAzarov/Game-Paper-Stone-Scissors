import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
const Home = () => {
  return (
    <section className="home">
      <img src={require("./logo.jpg")} alt="" />
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
