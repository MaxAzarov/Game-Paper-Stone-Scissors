"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Login_1 = __importDefault(require("./User/containers/Login/Login"));
const Registration_1 = __importDefault(require("./User/containers/Registration/Registration"));
const Game_1 = __importDefault(require("./User/containers/Game/Game"));
const Home_1 = __importDefault(require("./Common/components/Home/Home"));
const RoomContainer_1 = __importDefault(require("./Rooms/containers/RoomContainer/RoomContainer"));
const RoomCreation_1 = __importDefault(require("./Rooms/containers/RoomCreation/RoomCreation"));
const PrivateRoute_1 = __importDefault(require("./Common/components/PrivateRoute/PrivateRoute"));
const Statistics_1 = __importDefault(require("./User/containers/Statistics/Statistics"));
const Room_1 = __importDefault(require("./Rooms/containers/Room/Room"));
require("./App.scss");
const App = () => {
    return (<react_router_dom_1.Switch>
      <react_router_dom_1.Route path="/login">
        <Login_1.default></Login_1.default>
      </react_router_dom_1.Route>
      <react_router_dom_1.Route path="/register" exact>
        <Registration_1.default></Registration_1.default>
      </react_router_dom_1.Route>
      <PrivateRoute_1.default path="/game" exact component={Game_1.default}/>
      <PrivateRoute_1.default path="/rooms" exact component={RoomContainer_1.default}></PrivateRoute_1.default>
      <PrivateRoute_1.default path="/room/:id" exact component={Room_1.default}></PrivateRoute_1.default>
      <PrivateRoute_1.default path="/room-create" exact component={RoomCreation_1.default}></PrivateRoute_1.default>
      <react_router_dom_1.Route path="/statistics" exact>
        <Statistics_1.default></Statistics_1.default>
      </react_router_dom_1.Route>
      <react_router_dom_1.Route path="/" exact>
        <Home_1.default></Home_1.default>
      </react_router_dom_1.Route>
    </react_router_dom_1.Switch>);
};
exports.default = App;
