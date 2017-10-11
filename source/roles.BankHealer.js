"use strict";
const _BankRobbers = require("./rolelib.bankrobbers");
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["MovingToBankRoom"] = 1] = "MovingToBankRoom";
    State[State["FindingTargetToHeal"] = 2] = "FindingTargetToHeal";
    State[State["MovingToTargetToHeal"] = 3] = "MovingToTargetToHeal";
    State[State["HealingTarget"] = 4] = "HealingTarget";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToBankRoom);
    }
    switch (creep.getState()) {
        case State.MovingToBankRoom:
            runMoveToBankRoom(creep);
            break;
        case State.FindingTargetToHeal:
            runFindingTargetToHeal(creep);
            break;
        case State.MovingToTargetToHeal:
            runMovingToTargetToHeal(creep);
            break;
        case State.HealingTarget:
            runHealingTarget(creep);
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
    if (creep.room.name !== bankPosition.roomName || creep.pos.getRangeTo(bankPosition) > 5) {
        creep.travelTo({ pos: bankPosition }, { preferHighway: true, allowHostile: false });
    }
    else {
        creep.setState(State.FindingTargetToHeal);
        runFindingTargetToHeal(creep);
    }
}
function runFindingTargetToHeal(creep) {
    if (Game.time % 5 === 0) {
        let targetToHeal = getTargetToHeal(creep);
        if (targetToHeal instanceof Creep) {
            creep.memory.targetToHeal = targetToHeal.id;
            targetToHeal.memory.healer = creep.id;
            creep.setState(State.MovingToTargetToHeal);
            runMovingToTargetToHeal(creep);
        }
    }
}
function runMovingToTargetToHeal(creep) {
    let targetToHeal = getTargetToHeal(creep);
    if (targetToHeal !== null) {
        if (creep.pos.getRangeTo(targetToHeal) > 1) {
            creep.travelTo(targetToHeal);
        }
        else {
            targetToHeal.memory.healerInPosition = true;
            creep.setState(State.HealingTarget);
            runHealingTarget(creep);
        }
    }
    else {
        creep.setState(State.FindingTargetToHeal);
    }
}
function runHealingTarget(creep) {
    let targetToHeal = getTargetToHeal(creep);
    if (targetToHeal !== null) {
        creep.heal(targetToHeal);
    }
    else {
        creep.suicide();
    }
}
function getTargetToHeal(creep) {
    if (creep.memory.targetToHeal !== undefined) {
        return Game.getObjectById(creep.memory.targetToHeal);
    }
    let targetToHeal = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: function (c) {
            return c.memory.role === role_1.Role.BankAttacker && c.memory.healerInPosition === undefined && c.ticksToLive > 300;
        } });
    if (targetToHeal instanceof Creep) {
        return targetToHeal;
    }
    return null;
}
