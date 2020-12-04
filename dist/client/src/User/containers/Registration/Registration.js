"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const react_router_dom_1 = require("react-router-dom");
const UserRegister_1 = require("../../graphql/Mutation/UserRegister");
require("./Registration.scss");
const Registration = () => {
    var _a;
    const history = react_router_dom_1.useHistory();
    const [email, setEmail] = react_1.useState("");
    const [nickname, setNickName] = react_1.useState("");
    const [password, setPassword] = react_1.useState("");
    const [repPassword, setRepPassword] = react_1.useState("");
    const [userRegister, { data }] = client_1.useMutation(UserRegister_1.UserRegister);
    if (data && data.UserRegister.status) {
        history.push("/login");
    }
    return (<section className="registration">
      {(_a = data === null || data === void 0 ? void 0 : data.UserRegister) === null || _a === void 0 ? void 0 : _a.errors}
      <div className="registration-wrapper">
        <div className="registration-title">Register</div>
        <img src={require("./../../../Common/components/Home/logo2.png")} alt=""/>
        <input type="text" value={email} id="email" onChange={(e) => setEmail(e.target.value)} placeholder={"Email"}/>
        <input type="text" id="nickname" value={nickname} onChange={(e) => setNickName(e.target.value)} placeholder={"Nickname"}/>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Password"}/>
        <input type="password" id="repPassword" value={repPassword} onChange={(e) => setRepPassword(e.target.value)} placeholder={"Repeat password"}/>
        <button onClick={() => userRegister({ variables: { email, nickname, password } })}>
          Register!
        </button>
        <react_router_dom_1.Link to="/login" className="registration-link" style={{ textDecoration: "none" }}>
          Have an account?
        </react_router_dom_1.Link>
        <react_router_dom_1.Link to="/" className="registration-link" style={{ textDecoration: "none" }}>
          Home
        </react_router_dom_1.Link>
      </div>
    </section>);
};
exports.default = Registration;
