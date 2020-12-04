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
require("./Info.scss");
const Info = () => {
    const [show, setShow] = react_1.useState(false);
    const handleClick = () => {
        setShow(true);
        document.addEventListener("click", closeMenu);
    };
    const closeMenu = () => {
        setShow(false);
        document.removeEventListener("click", closeMenu);
    };
    return (<div className="game-info">
      <div className="game-info__wrapper">
        <img src={require("./infoico.png")} alt="info-icon" onClick={handleClick}/>
        {show && (<div className="info">
            A player who decides to play rock will beat another player who has
            chosen scissors ("rock crushes scissors" or sometimes "blunts
            scissors"), but will lose to one who has played paper ("paper covers
            rock"); a play of paper will lose to a play of scissors ("scissors
            cuts paper").
          </div>)}
      </div>
    </div>);
};
exports.default = Info;
