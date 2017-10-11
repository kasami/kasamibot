"use strict";
const _Military = require("./rolelib.military");
const _Targeting = require("./rolelib.targeting");
const _BankRobbers = require("./rolelib.bankrobbers");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["MovingToBank"] = 1] = "MovingToBank";
    State[State["AttackingBank"] = 2] = "AttackingBank";
    State[State["DefendingBankroom"] = 3] = "DefendingBankroom";
})(State || (State = {}));
function run(creep) {
    healIfNeeded(creep);
    if (!creep.hasState()) {
        creep.setState(State.MovingToBank);
    }
    switch (creep.getState()) {
        case State.MovingToBank:
            runMoveToBank(creep);
            break;
        case State.AttackingBank:
            runAttackingBank(creep);
            break;
        case State.DefendingBankroom:
            runDefendingBankroom(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBank);
            break;
    }
}
exports.run = run;
function runMoveToBank(creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);
    if (creep.room.name !== bankPosition.roomName || creep.pos.getRangeTo(bankPosition) > 3) {
        creep.travelTo({ pos: bankPosition }, { preferHighway: true, allowHostile: false });
    }
    else {
        creep.setState(State.AttackingBank);
        runAttackingBank(creep);
    }
}
function runAttackingBank(creep) {
    if (Game.time % 13 === 0) {
        if (checkForHostiles(creep)) {
            creep.setState(State.DefendingBankroom);
            runDefendingBankroom(creep);
            return;
        }
    }
    let bank = getBank(creep);
    if (bank !== null) {
        if (_BankRobbers.itIsSafeToAttackBank(creep, bank)) {
            creep.rangedAttack(bank);
        }
    }
    else {
    }
}
function runDefendingBankroom(creep) {
    if (Game.time % 5 === 0) {
        checkForHostiles(creep);
    }
    let target = Game.getObjectById(creep.memory.hostileTarget);
    if (target === null) {
        creep.memory.hostileTarget = undefined;
        creep.setState(State.MovingToBank);
        runMoveToBank(creep);
        return;
    }
    _Military.kiteAndAttack(creep, target);
}
function healIfNeeded(creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }
}
function getBank(creep) {
    return Game.getObjectById(creep.memory.target);
}
function checkForHostiles(creep) {
    let target = _Targeting.getPrioritizedTarget(creep);
    if (target !== null) {
        creep.memory.hostileTarget = target.id;
        return true;
    }
    return false;
}
