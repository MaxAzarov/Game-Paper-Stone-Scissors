"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Match;
(function (Match) {
    Match[Match["Stone"] = 0] = "Stone";
    Match[Match["Scissors"] = 1] = "Scissors";
    Match[Match["Paper"] = 2] = "Paper";
})(Match || (Match = {}));
// Stone 0
// Scissors 1
// Paper 2
const GameLogic = (random, userChoice) => {
    if ((random === Match.Stone && userChoice === Match.Scissors) ||
        (random === Match.Scissors && userChoice === Match.Paper) ||
        (random === Match.Paper && userChoice === Match.Stone)) {
        return "Defeat";
    }
    else if ((random === Match.Scissors && userChoice === Match.Stone) ||
        (random === Match.Paper && userChoice === Match.Scissors) ||
        (random === Match.Stone && userChoice === Match.Paper)) {
        return "Win";
    }
    else if (userChoice !== undefined &&
        random !== undefined &&
        userChoice === random) {
        return "Draw";
    }
    return "Defeat";
};
exports.default = GameLogic;
