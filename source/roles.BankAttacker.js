"use strict";
const _BankRobbers = require("./rolelib.bankrobbers");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["MovingToBankRoom"] = 1] = "MovingToBankRoom";
    State[State["MovingToAttackPosition"] = 2] = "MovingToAttackPosition";
    State[State["WaitingForHealer"] = 3] = "WaitingForHealer";
    State[State["DestroyingBank"] = 4] = "DestroyingBank";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToBankRoom);
    }
    switch (creep.getState()) {
        case State.MovingToBankRoom:
            runMoveToBankRoom(creep);
            break;
        case State.MovingToAttackPosition:
            runMoveToBank(creep);
            break;
        case State.WaitingForHealer:
            runWaitingForHealer(creep);
            break;
        case State.DestroyingBank:
            runDestroyingBank(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBankRoom);
            break;
    }
}
exports.run = run;
function runMoveToBankRoom(creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);
    if (creep.room.name !== bankPosition.roomName) {
        creep.travelTo({ pos: bankPosition }, { allowHostile: false, preferHighway: true });
    }
    else {
        creep.setState(State.MovingToAttackPosition);
        runMoveToBank(creep);
    }
}
function runMoveToBank(creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);
    if (creep.pos.getRangeTo(bankPosition) > 1) {
        creep.moveTo({ pos: bankPosition });
    }
    else {
        creep.setState(State.WaitingForHealer);
        runWaitingForHealer(creep);
    }
}
function runWaitingForHealer(creep) {
    if (creep.memory.healerInPosition) {
        creep.setState(State.DestroyingBank);
        runDestroyingBank(creep);
    }
}
function runDestroyingBank(creep) {
    let bank = getBank(creep);
    if (bank !== null) {
        if (_BankRobbers.itIsSafeToAttackBank(creep, bank)) {
            creep.attack(bank);
        }
    }
    else {
        creep.suicide();
    }
}
function getBank(creep) {
    return Game.getObjectById(creep.memory.target);
}
