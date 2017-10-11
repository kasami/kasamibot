"use strict";
const PositionLib = require("./lib.position");
const PathfindingUtilities = require("./utilities.Pathfinding");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["TankUpInHomeroom"] = 1] = "TankUpInHomeroom";
    State[State["MoveToTargetRoom"] = 2] = "MoveToTargetRoom";
    State[State["TransferEnergyToStructure"] = 3] = "TransferEnergyToStructure";
    State[State["MoveToHomeroom"] = 4] = "MoveToHomeroom";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.TankUpInHomeroom);
    }
    switch (creep.getState()) {
        case State.TankUpInHomeroom:
            runTankUpInHomeroom(creep);
            break;
        case State.MoveToTargetRoom:
            runMoveToTargetRoom(creep);
            break;
        case State.TransferEnergyToStructure:
            runTransferEnergyToStructure(creep);
            break;
        case State.MoveToHomeroom:
            runMoveToHomeroom(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MoveToHomeroom);
            break;
    }
}
exports.run = run;
function runTankUpInHomeroom(creep) {
    if (creep.carry.energy < creep.carryCapacity && creep.room.name === creep.memory.homeroom &&
        creep.room.storage !== undefined) {
        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
        if (distanceToStorage > 1) {
            creep.moveTo(creep.room.storage);
        }
        else {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    }
    else {
        creep.setState(State.MoveToTargetRoom);
        runMoveToTargetRoom(creep);
    }
}
function runMoveToTargetRoom(creep) {
    let targetRoom = creep.memory.target;
    if (targetRoom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(targetRoom, { allowHostile: false }, true);
    }
    else {
        creep.setState(State.TransferEnergyToStructure);
        runTransferEnergyToStructure(creep);
    }
}
function runTransferEnergyToStructure(creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }
    if (creep.room.storage === undefined) {
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }
    let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
    if (distanceToStorage > 1) {
        creep.travelTo(creep.room.storage);
    }
    else {
        creep.transfer(creep.room.storage, RESOURCE_ENERGY);
    }
}
function runMoveToHomeroom(creep) {
    let homeroom = creep.memory.homeroom;
    if (homeroom !== creep.room.name) {
        creep.travelToRoom(homeroom, { allowHostile: false }, true);
    }
    else {
        creep.setState(State.TankUpInHomeroom);
        runTankUpInHomeroom(creep);
    }
}
function shouldShouldAnotherRun(creep) {
    let homeroom = Game.rooms[creep.memory.homeroom];
    if (homeroom == undefined || homeroom.terminal === undefined) {
        return true;
    }
    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, homeroom.terminal.pos);
    return creep.ticksToLive > distanceToTerminal * 2.1;
}
