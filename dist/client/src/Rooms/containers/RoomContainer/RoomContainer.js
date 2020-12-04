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
const index_1 = require("../../../index");
const GetRooms_1 = __importDefault(require("../../graphql/Query/GetRooms"));
const RoomCreated_1 = __importDefault(require("../../graphql/Subscription/RoomCreated"));
const RoomLastUserLeave_1 = __importDefault(require("../../graphql/Subscription/RoomLastUserLeave"));
const Menu_1 = __importDefault(require("../../../Common/components/Menu/Menu"));
const RoomItem_1 = __importDefault(require("./RoomItem"));
require("./RoomContainer.scss");
const RoomsView = () => {
    const [rooms, setRooms] = react_1.useState([]);
    const [roomPassword, setRoomPassword] = react_1.useState("");
    const [roomId, setRoomId] = react_1.useState("");
    const { data } = client_1.useQuery(GetRooms_1.default, {
        fetchPolicy: "network-only",
    });
    const history = react_router_dom_1.useHistory();
    react_1.useEffect(() => {
        if (data) {
            setRooms(data.getRooms.rooms);
        }
    }, [data]);
    react_1.useEffect(() => {
        // room created
        const roomCreateSubscription = index_1.client
            .subscribe({
            query: RoomCreated_1.default,
        })
            .subscribe(({ data }) => {
            console.log(" room created SUBSCRIBE received", data);
            if (data) {
                setRooms([...rooms, data.roomCreated]);
            }
        });
        // id of deleted room
        const roomDeleteSubscription = index_1.client
            .subscribe({
            query: RoomLastUserLeave_1.default,
        })
            .subscribe(({ data: id }) => {
            setRooms([...rooms.filter((item) => item.id !== id.roomLastUserLeave)]);
        });
        return () => {
            roomCreateSubscription.unsubscribe();
            roomDeleteSubscription.unsubscribe();
        };
    });
    return (<section className="rooms">
      <Menu_1.default />
      <section className="rooms-wrapper">
        <div className="rooms-container">
          {rooms &&
        rooms.map((item, index) => (<RoomItem_1.default key={index} roomId={roomId} item={item} roomPassword={roomPassword} setRoomId={setRoomId}/>))}
          {rooms.length === 0 && (<p className="rooms-message">No available rooms</p>)}
        </div>
        <input type="password" value={roomPassword} className="rooms-password" placeholder="enter room password to join room" onChange={(e) => setRoomPassword(e.target.value)}/>
        <p className="rooms-label">or</p>
        <button className="rooms-create" onClick={() => history.push("/room-create")}>
          Create room
        </button>
      </section>
      <img src={require("./../../../Common/components/Home/logo2.png")} alt="data" className="rooms-logo"/>
    </section>);
};
exports.default = RoomsView;
