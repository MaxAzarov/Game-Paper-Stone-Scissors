import React from "react";
import { Link } from "react-router-dom";

import "./Menu.scss";

const Menu = () => {
  return (
    <div className="menu">
      <p>Your nickname: {localStorage.getItem("nickname")}</p>
      <Link to="/statistics" className="menu__link">
        <p>Best users</p>
      </Link>

      <Link to="/" className="menu__link">
        Home
      </Link>
    </div>
  );
};
export default Menu;
