import React from "react";
import { Link } from "react-router-dom";
import "./GameError.scss";

const GameError = () => {
  return (
    <div className="single-game__error">
      Please login to play! &nbsp;
      {
        <Link to="/login" style={{ textDecoration: "none", color: "#000" }}>
          Click here to login
        </Link>
      }
    </div>
  );
};
export default GameError;
