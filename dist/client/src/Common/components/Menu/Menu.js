"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./Menu.scss");
const Menu = () => {
    return (<div className="menu">
      <p>Your nickname: {localStorage.getItem("nickname")}</p>
      <react_router_dom_1.Link to="/statistics" className="menu__link">
        <p>Best users</p>
      </react_router_dom_1.Link>

      <react_router_dom_1.Link to="/" className="menu__link">
        Home
      </react_router_dom_1.Link>
    </div>);
};
exports.default = Menu;
