"use strict";
const _BankRobbers = require("./rolelib.bankrobbers");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["MovingToBankPosition"] = 1] = "MovingToBankPosition";
    State[State["WaitForPower"] = 2] = "WaitForPower";
    State[State["PickUpPower"] = 3] = "PickUpPower";
    State[State["ReturnToBase"] = 4] = "ReturnToBase";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToBankPosition);
    }
    switch (creep.getState()) {
        case State.MovingToBankPosition:
            runMovingToBankPosition(creep);
            break;
        case State.WaitForPower:
            runWaitForPower(creep);
            break;
        case State.PickUpPower:
            runPickUpPower(creep);
            break;
        case State.ReturnToBase:
            runReturnToBase(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToBankPosition);
            break;
    }
}
exports.run = run;
function runMovingToBankPosition(creep) {
    let bankPosition = _BankRobbers.getBankPosition(creep);
    if (creep.room.name !== bankPosition.roomName || creep.isAtBorder() || creep.pos.getRangeTo(bankPosition) > 7) {
        creep.travelTo({ pos: bankPosition }, { preferHighway: true, allowHostile: false });
    }
    else {
        creep.setState(State.WaitForPower);
        runWaitForPower(creep);
    }
}
function runWaitForPower(creep) {
    let bank = Game.getObjectById(creep.memory.target);
    if (bank === null) {
        creep.setState(State.PickUpPower);
        runPickUpPower(creep);
    }
}
function runPickUpPower(creep) {
    if (creep.carry.power === creep.carryCapacity) {
        creep.setState(State.ReturnToBase);
        runReturnToBase(creep);
    }
    else {
        let powerStack = getPowerStackInRoom(creep);
        if (powerStack !== null) {
            if (creep.pos.getRangeTo(powerStack) === 1) {
                creep.pickup(powerStack);
            }
            else {
                if (creep.fatigue === 0) {
                    creep.moveTo(powerStack);
                }
            }
        }
        else if (creep.carry.power > 0) {
            creep.setState(State.ReturnToBase);
            runReturnToBase(creep);
        }
        else {
            creep.suicide();
        }
    }
}
function runReturnToBase(creep) {
    if (creep.carry === undefined || creep.carry.power === undefined) {
        creep.suicide();
    }
    let homeroom = Game.rooms[creep.memory.homeroom];
    if (homeroom.storage !== undefined) {
        if (creep.room.name === homeroom.name && creep.pos.getRangeTo(homeroom.storage) === 1) {
            creep.transfer(homeroom.storage, RESOURCE_POWER);
        }
        else {
            creep.travelTo(homeroom.storage, { preferHighway: true });
        }
    }
    else {
        Logger_1.log.error("BankHauler " + creep.name + " is missing homeroom or storage in home room", creep.memory.homeroom);
    }
}
function getPowerStackInRoom(creep) {
    let powerStacks = creep.room.find(FIND_DROPPED_RESOURCES, { filter: function (r) {
            return r.resourceType === RESOURCE_POWER;
        } });
    if (powerStacks !== undefined && powerStacks.length > 0) {
        return powerStacks[0];
    }
    else {
        return null;
    }
}
