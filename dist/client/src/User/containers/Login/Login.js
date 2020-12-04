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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const react_router_dom_1 = require("react-router-dom");
const UserLogin_1 = __importDefault(require("../../graphql/Query/UserLogin"));
require("./Login.scss");
const Login = () => {
    var _a;
    const history = react_router_dom_1.useHistory();
    const [email, setEmail] = react_1.useState("");
    const [password, setPassword] = react_1.useState("");
    const [userLogin, { data }] = client_1.useLazyQuery(UserLogin_1.default);
    const [errors, setErrors] = react_1.useState((_a = data === null || data === void 0 ? void 0 : data.UserLogin) === null || _a === void 0 ? void 0 : _a.errors);
    if ((data === null || data === void 0 ? void 0 : data.UserLogin.id) && (data === null || data === void 0 ? void 0 : data.UserLogin.token) && (data === null || data === void 0 ? void 0 : data.UserLogin.nickname)) {
        localStorage.setItem("token", data.UserLogin.token);
        localStorage.setItem("id", data.UserLogin.id);
        localStorage.setItem("nickname", data.UserLogin.nickname);
        history.push("/");
    }
    react_1.useEffect(() => {
        if (data) {
            setErrors(data.UserLogin.errors);
            setTimeout(() => {
                setErrors(undefined);
            }, 3000);
        }
    }, [data]);
    return (<section className="login">
      <div className="login-wrapper">
        <p className="login-title">Login</p>
        <img src={require("./../../../Common/components/Home/logo2.png")} alt=""/>
        <input type="text" value={email} id="email" onChange={(e) => setEmail(e.target.value)} placeholder={"Email"}/>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Password"}/>
        {(errors === null || errors === void 0 ? void 0 : errors.length) &&
        errors.map((item, index) => (<p className="login-error" key={index}>
              {item}
            </p>))}
        <button onClick={() => userLogin({ variables: { data: email, password } })}>
          Login!
        </button>
        <p className="login-register">
          Don't have an account? &nbsp;
          <react_router_dom_1.Link to="/register" style={{ textDecoration: "none" }}>
            <span>Click here to register!</span>
          </react_router_dom_1.Link>
          &nbsp;
          <react_router_dom_1.Link to="/" style={{ textDecoration: "none" }}>
            <span>Home</span>
          </react_router_dom_1.Link>
        </p>
      </div>
    </section>);
};
exports.default = Login;
