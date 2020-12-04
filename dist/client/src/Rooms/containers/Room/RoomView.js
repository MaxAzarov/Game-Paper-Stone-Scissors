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
const Buttons_1 = __importDefault(require("../../../Common/components/Buttons/Buttons"));
const GetRoom_1 = __importDefault(require("../../graphql/Query/GetRoom"));
const RoomSendUserChoice_1 = __importDefault(require("../../graphql/Mutation/RoomSendUserChoice"));
const RoomGetMatchResult_1 = __importDefault(require("../../graphql/Subscription/RoomGetMatchResult"));
const GameResult_1 = __importDefault(require("../../../Common/components/GameResult/GameResult"));
const Info_1 = __importDefault(require("../../../Common/components/Info/Info"));
const RoomInfo_1 = __importDefault(require("../../components/RoomInfo/RoomInfo"));
const Error_1 = __importDefault(require("../../../Common/components/Error/Error"));
const __1 = require("../../..");
require("./RoomView.scss");
// /room/:id
const RoomView = ({ id, opponent }) => {
    var _a;
    const [userChoice, setUserChoice] = react_1.useState();
    const [enemy, setEnemy] = react_1.useState(opponent);
    const [choice, setChoice] = react_1.useState();
    const [matchResult, setMatchResult] = react_1.useState();
    const [opponentChoice, setOpponentChoice] = react_1.useState();
    const history = react_router_dom_1.useHistory();
    const [roomSendUserOption] = client_1.useMutation(RoomSendUserChoice_1.default);
    const { data, loading } = client_1.useQuery(GetRoom_1.default, {
        variables: {
            id,
        },
        fetchPolicy: "no-cache",
    });
    react_1.useEffect(() => {
        var _a, _b;
        setEnemy(opponent);
        // find opponent
        let user = (_b = (_a = data === null || data === void 0 ? void 0 : data.getRoom) === null || _a === void 0 ? void 0 : _a.users) === null || _b === void 0 ? void 0 : _b.find((item) => item.user !== localStorage.getItem("id"));
        if (!(opponent === null || opponent === void 0 ? void 0 : opponent.nickname)) {
            setEnemy(user);
        }
    }, [setEnemy, data, opponent]);
    react_1.useEffect(() => {
        let timeout;
        const matchResult = __1.client
            .subscribe({ query: RoomGetMatchResult_1.default })
            .subscribe(({ data }) => {
            setMatchResult(data.roomGetMatchResult.result);
            timeout = setTimeout(() => {
                setMatchResult(null);
            }, 2000);
            setOpponentChoice(data.roomGetMatchResult.opponent);
        });
        return () => {
            matchResult.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);
    react_1.useEffect(() => {
        if (userChoice !== undefined) {
            roomSendUserOption({
                variables: {
                    result: userChoice,
                    roomId: id,
                },
            });
            setChoice(userChoice);
            setUserChoice(undefined);
        }
    }, [userChoice, setUserChoice, roomSendUserOption, id]);
    if (!loading && ((_a = data === null || data === void 0 ? void 0 : data.getRoom) === null || _a === void 0 ? void 0 : _a.errors)) {
        return <Error_1.default error={"Can't get this room"}></Error_1.default>;
    }
    let date;
    if (data) {
        date = new Date(+data.getRoom.createdAt);
    }
    return (<section className="room">
      <RoomInfo_1.default date={date} enemy={enemy} data={data}></RoomInfo_1.default>
      {matchResult && (<GameResult_1.default matchResult={matchResult} choice={choice} random={opponentChoice}></GameResult_1.default>)}
      <Buttons_1.default initialResult={(enemy === null || enemy === void 0 ? void 0 : enemy.nickname) && !matchResult} setUserChoice={setUserChoice}></Buttons_1.default>
      <Info_1.default></Info_1.default>
      <div onClick={() => history.push("/rooms")} className="room-leave">
        leave
      </div>
    </section>);
};
exports.default = RoomView;
