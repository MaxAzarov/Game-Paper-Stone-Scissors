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
const RoomCreate_1 = __importDefault(require("../../graphql/Mutation/RoomCreate"));
require("./RoomCreation.scss");
const RoomCreation = () => {
    const [roomName, setRoomName] = react_1.useState("");
    const [roomPassword, setRoomPassword] = react_1.useState("");
    const [createRoom, { data, error }] = client_1.useMutation(RoomCreate_1.default);
    const history = react_router_dom_1.useHistory();
    react_1.useEffect(() => {
        if (data && data.roomCreate.id) {
            history.push(`/room/${data.roomCreate.id}`);
        }
    }, [data, history]);
    return (<section className="room-create">
      <div className="room-create__wrapper">
        <img src={require("./../../../Common/components/Home/logo2.png")} alt=""/>
        {data && data.roomCreate.error && (<div className="room-create__error">{data.roomCreate.error[0]}</div>)}
        {error && <div className="room-create__error">{error.message}</div>}
        <input type="text" id="room-name" value={roomName} placeholder="Enter email" onChange={(e) => setRoomName(e.target.value)}/>
        <input type="password" id="room-password" value={roomPassword} placeholder="Enter password" onChange={(e) => setRoomPassword(e.target.value)}/>

        <button type="submit" onClick={() => {
        createRoom({
            variables: {
                name: roomName,
                password: roomPassword,
            },
        }).catch((e) => {
            console.log(e.message);
        });
    }}>
          Create New Room!
        </button>

        <react_router_dom_1.Link to="/rooms" className="room-create__link" style={{ textDecoration: "none" }}>
          Return to all rooms
        </react_router_dom_1.Link>
      </div>
    </section>);
};
exports.default = RoomCreation;
