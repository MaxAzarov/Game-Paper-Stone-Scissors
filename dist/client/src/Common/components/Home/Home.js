"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const gif_gif_1 = __importDefault(require("./gif.gif"));
require("./Home.scss");
const Home = () => {
    return (<section className="home">
      <img src={gif_gif_1.default} alt="" className="gif1"/>
      <img src={gif_gif_1.default} alt="" className="gif2"/>
      <p className="home-title">Game</p>
      <img src={require("./logo2.png")} className="home-logo" alt=""/>
      <react_router_dom_1.Link to="/game" className="home-link" style={{ textDecoration: "none" }}>
        <span>Start personal game!</span>
      </react_router_dom_1.Link>
      <react_router_dom_1.Link to="/rooms" className="home-link" style={{ textDecoration: "none" }}>
        <span>Play online</span>
      </react_router_dom_1.Link>
      <react_router_dom_1.Link to="/login" className="home-link" style={{ textDecoration: "none" }}>
        <span>Register</span>
      </react_router_dom_1.Link>
      <react_router_dom_1.Link to="/login" className="home-link" style={{ textDecoration: "none" }}>
        <span>Login</span>
      </react_router_dom_1.Link>
    </section>);
};
exports.default = Home;
