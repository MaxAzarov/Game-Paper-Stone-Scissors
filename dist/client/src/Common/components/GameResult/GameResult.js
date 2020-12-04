"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./GameResult.scss");
const paper_png_1 = __importDefault(require("./paper.png"));
const scissors_png_1 = __importDefault(require("./scissors.png"));
const stone_png_1 = __importDefault(require("./stone.png"));
const GameResult = ({ choice, random, matchResult }) => {
    return (<div className="match-view">
      {choice === 2 && <img src={paper_png_1.default} alt="paper" className="paper"/>}
      {choice === 1 && (<img src={scissors_png_1.default} alt="scissors" className="scissors"/>)}
      {choice === 0 && <img src={stone_png_1.default} alt="stone" className="stone"/>}
      <div className="match-view__result">{matchResult}</div>
      {random === 2 && (<img src={paper_png_1.default} alt="paper" className="paper-reverse"/>)}
      {random === 1 && (<img src={scissors_png_1.default} alt="scissors" className="scissors-reverse"/>)}
      {random === 0 && (<img src={stone_png_1.default} alt="stone" className="stone-reverse"/>)}
    </div>);
};
exports.default = GameResult;
