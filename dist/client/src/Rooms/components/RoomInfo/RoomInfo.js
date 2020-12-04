"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./RoomInfo.scss");
const RoomInfo = ({ data, date, enemy }) => {
    var _a, _b;
    return (<>
      <div className="room-info">
        Room name: <span className="room-name">{(_a = data === null || data === void 0 ? void 0 : data.getRoom) === null || _a === void 0 ? void 0 : _a.name}</span>
        <br />
        Room id:
        <p className="room-id">{(_b = data === null || data === void 0 ? void 0 : data.getRoom) === null || _b === void 0 ? void 0 : _b.id}</p>
        Created at: {date && date.getHours()} hour {date && date.getMinutes()}{" "}
        minute {date && date.getSeconds()} seconds
      </div>
      <p className="room-opponent">
        opponent: {(enemy === null || enemy === void 0 ? void 0 : enemy.nickname) || "waiting..."}
      </p>
      {!(enemy === null || enemy === void 0 ? void 0 : enemy.nickname) && (<p className="room-waiting">
          Please wait for new user to start game...
        </p>)}
    </>);
};
exports.default = RoomInfo;
