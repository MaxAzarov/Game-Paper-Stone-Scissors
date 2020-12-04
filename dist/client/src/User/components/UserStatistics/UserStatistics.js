"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./UserStatistics.scss");
const UserStatistics = ({ statistics: { wins, defeat, draw, percentOfWin }, }) => {
    return (<section className="statistics">
      <p>Statistics:</p>
      <p>Wins:{wins}</p>
      <p>Defeat:{defeat}</p>
      <p>Draw:{draw}</p>
      Percent of win:
      {percentOfWin}
    </section>);
};
exports.default = UserStatistics;
