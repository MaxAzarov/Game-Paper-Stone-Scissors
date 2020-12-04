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
const RoomJoin_1 = __importDefault(require("../../graphql/Mutation/RoomJoin"));
require("./RoomItem.scss");
const RoomItem = ({ roomId, item, roomPassword, setRoomId }) => {
    const [RoomJoin, { data: roomJoinResp }] = client_1.useMutation(RoomJoin_1.default);
    const history = react_router_dom_1.useHistory();
    // TODO handle err
    react_1.useEffect(() => {
        if (roomJoinResp && !roomJoinResp.roomJoin.errors) {
            console.log(roomJoinResp);
            history.push(`/room/${roomId}`);
        }
    }, [roomJoinResp, history, roomId]);
    return (<div className="room-item" onClick={() => {
        RoomJoin({
            variables: {
                id: item.id,
                password: roomPassword,
            },
        }).catch((e) => console.log(e));
        setRoomId(item.id);
    }}>
      <p className="room-item__name">
        Room name: &nbsp;<span>{item.name}</span>
      </p>
      <p>
        users:
        {item.users.map((item, index) => {
        return <span key={index}>{item.nickname} &nbsp;</span>;
    })}
      </p>
      {item.private && (<img src={require("./lock.png")} className="room-lock" alt="lock"/>)}
    </div>);
};
exports.default = RoomItem;
