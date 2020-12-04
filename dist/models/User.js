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
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    wins: {
        type: Number,
        default: 0,
        validate: {
            validator: function (wins) {
                return wins >= 0;
            },
            message: (props) => `${props.value} is not a positive number!`,
        },
    },
    draw: {
        type: Number,
        default: 0,
        validate: {
            validator: function (draw) {
                return draw >= 0;
            },
            message: (props) => `${props.value} is not a positive number!`,
        },
    },
    percentOfWin: {
        type: Number,
        default: 0,
        validate: {
            validator: function (draw) {
                return draw >= 0;
            },
            message: (props) => `${props.value} is not a positive number!`,
        },
    },
    defeat: {
        type: Number,
        default: 0,
        validate: {
            validator: function (defeat) {
                return defeat >= 0;
            },
            message: (props) => `${props.value} is not a positive number!`,
        },
    },
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
