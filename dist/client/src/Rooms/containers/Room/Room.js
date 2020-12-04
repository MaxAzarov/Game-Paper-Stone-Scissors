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
const __1 = require("../../..");
const RoomUserJoin_1 = __importDefault(require("../../graphql/Subscription/RoomUserJoin"));
const RoomDelete_1 = __importDefault(require("./../../graphql/Mutation/RoomDelete"));
const RoomUserLeave_1 = __importDefault(require("../../graphql/Subscription/RoomUserLeave"));
const RoomView_1 = __importDefault(require("./RoomView"));
// wrapper for /room/:id
const Rooms = ({ match }) => {
    const [RoomUpdate] = client_1.useMutation(RoomDelete_1.default);
    const [opponent, setOpponent] = react_1.useState();
    react_1.useEffect(() => {
        const userJoin = __1.client
            .subscribe({
            query: RoomUserJoin_1.default,
        })
            .subscribe(({ data }) => {
            setOpponent(data.roomUserJoin);
        });
        const userLeave = __1.client
            .subscribe({ query: RoomUserLeave_1.default })
            .subscribe(({ data: userId }) => {
            setOpponent(undefined);
        });
        return () => {
            userJoin.unsubscribe();
            userLeave.unsubscribe();
            RoomUpdate({
                variables: {
                    id: match.params.id,
                },
            }).catch((e) => console.log(e));
        };
    }, [RoomUpdate, match.params.id]);
    return <RoomView_1.default id={match.params.id} opponent={opponent}/>;
};
exports.default = react_router_dom_1.withRouter(Rooms);
