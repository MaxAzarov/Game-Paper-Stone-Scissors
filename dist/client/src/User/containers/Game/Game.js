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
const SendUserMatchResult_1 = __importDefault(require("../../graphql/Mutation/SendUserMatchResult"));
const UserStatistics_1 = __importDefault(require("../../components/UserStatistics/UserStatistics"));
const GetUserMatchResult_1 = __importDefault(require("../../graphql/Query/GetUserMatchResult"));
const Buttons_1 = __importDefault(require("../../../Common/components/Buttons/Buttons"));
const GameLogic_1 = __importDefault(require("../../utilities/GameLogic"));
const GameResult_1 = __importDefault(require("../../../Common/components/GameResult/GameResult"));
const Info_1 = __importDefault(require("../../../Common/components/Info/Info"));
const Error_1 = __importDefault(require("./../../../Common/components/Error/Error"));
const Menu_1 = __importDefault(require("../../../Common/components/Menu/Menu"));
require("./Game.scss");
const Game = () => {
    const [userChoice, setUserChoice] = react_1.useState();
    const [random, setRandom] = react_1.useState();
    const [choice, setChoice] = react_1.useState();
    const [matchResult, setMatchResult] = react_1.useState();
    const [sendMatchResult, { data, error }] = client_1.useMutation(SendUserMatchResult_1.default);
    const { data: initialUserResult, error: MatchResultError, refetch, } = client_1.useQuery(GetUserMatchResult_1.default);
    const history = react_router_dom_1.useHistory();
    react_1.useEffect(() => {
        if (data) {
            refetch().catch((e) => {
                history.push("/login");
            });
        }
    }, [data, refetch, history]);
    react_1.useEffect(() => {
        if (userChoice !== undefined && userChoice !== null) {
            let MatchResult;
            let rand = Math.floor(Math.random() * 3);
            setRandom(rand);
            MatchResult = GameLogic_1.default(rand, userChoice);
            setChoice(userChoice);
            setMatchResult(MatchResult);
            sendMatchResult({
                variables: {
                    result: MatchResult,
                },
            }).catch((e) => {
                history.push("/login");
            });
            setTimeout(() => {
                setMatchResult(undefined);
            }, 2000);
            setUserChoice(undefined);
        }
    }, [userChoice, setUserChoice, sendMatchResult, random, history]);
    return (<section className="single-game">
      <Menu_1.default />
      {matchResult && (<GameResult_1.default choice={choice} random={random} matchResult={matchResult}/>)}
      {error && <Error_1.default error={error === null || error === void 0 ? void 0 : error.message}/>}
      {MatchResultError && <Error_1.default error={MatchResultError === null || MatchResultError === void 0 ? void 0 : MatchResultError.message}/>}
      <Buttons_1.default setUserChoice={setUserChoice} initialResult={initialUserResult && !matchResult}/>
      <Info_1.default />
      {initialUserResult && (<UserStatistics_1.default statistics={initialUserResult.getUserMatchResult}/>)}
    </section>);
};
exports.default = Game;
