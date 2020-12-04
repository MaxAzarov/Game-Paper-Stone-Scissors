"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Spinner.scss");
const Spinner = () => {
    return (<div className="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>);
};
exports.default = Spinner;
