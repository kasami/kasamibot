"use strict";
const PositionLib = require("./lib.position");
const PathfindingUtilities = require("./utilities.Pathfinding");
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["TankUpInHomeroom"] = 1] = "TankUpInHomeroom";
    State[State["MoveToPraiseroom"] = 2] = "MoveToPraiseroom";
    State[State["DecideWhereToPutEnergy"] = 3] = "DecideWhereToPutEnergy";
    State[State["MoveToHomeroom"] = 4] = "MoveToHomeroom";
    State[State["TransferEnergyToStructure"] = 5] = "TransferEnergyToStructure";
    State[State["GiveEnergyToCreep"] = 6] = "GiveEnergyToCreep";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.TankUpInHomeroom);
    }
    switch (creep.getState()) {
        case State.TankUpInHomeroom:
            runTankUpInHomeroom(creep);
            break;
        case State.MoveToPraiseroom:
            runMoveToPraiseroom(creep);
            break;
        case State.DecideWhereToPutEnergy:
            runDecideWhereToPutEnergy(creep);
            break;
        case State.TransferEnergyToStructure:
            runTransferEnergyToStructure(creep);
            break;
        case State.GiveEnergyToCreep:
            runGiveEnergyToCreep(creep);
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
        creep.room.terminal !== undefined && creep.room.storage !== undefined) {
        let pickUpStructure = creep.room.storage;
        if (creep.room.storage.store[RESOURCE_ENERGY] < 10000) {
            pickUpStructure = creep.room.terminal;
        }
        let distanceToStorage = creep.pos.getRangeTo(pickUpStructure.pos);
        if (distanceToStorage > 1) {
            creep.moveTo(pickUpStructure);
        }
        else {
            creep.withdraw(pickUpStructure, RESOURCE_ENERGY);
        }
    }
    else {
        creep.setState(State.MoveToPraiseroom);
        runMoveToPraiseroom(creep);
    }
}
function runMoveToPraiseroom(creep) {
    let praiseroom = creep.memory.target;
    if (praiseroom !== creep.room.name || PositionLib.positionIsBorderOrNextToBorder(creep.pos)) {
        creep.travelToRoom(praiseroom);
    }
    else {
        creep.setState(State.DecideWhereToPutEnergy);
        runDecideWhereToPutEnergy(creep);
    }
}
function runDecideWhereToPutEnergy(creep) {
    if (creep.room.terminal !== undefined && creep.room.terminal.isActive()) {
        creep.memory.structureid = creep.room.terminal.id;
        creep.setState(State.TransferEnergyToStructure);
        runTransferEnergyToStructure(creep);
        return;
    }
    if (creep.room.storage !== undefined && creep.room.storage.isActive()) {
        creep.memory.structureid = creep.room.storage.id;
        creep.setState(State.TransferEnergyToStructure);
        runTransferEnergyToStructure(creep);
        return;
    }
    creep.setState(State.GiveEnergyToCreep);
    runGiveEnergyToCreep(creep);
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
    let structure = Game.getObjectById(creep.memory.structureid);
    if (structure === null) {
        creep.setState(State.DecideWhereToPutEnergy);
        runDecideWhereToPutEnergy(creep);
        return;
    }
    let distanceToStorage = creep.pos.getRangeTo(structure.pos);
    if (distanceToStorage > 3) {
        creep.travelTo(structure);
    }
    else if (distanceToStorage > 1) {
        creep.moveTo(structure);
    }
    else {
        creep.transfer(structure, RESOURCE_ENERGY);
    }
}
function runGiveEnergyToCreep(creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.MoveToHomeroom);
        runMoveToHomeroom(creep);
        return;
    }
    let praiser = Game.getObjectById(creep.memory.praiser);
    if (praiser === null || praiser.carry.energy === praiser.carryCapacity) {
        creep.memory.praiser = undefined;
        findPraiserToProvide(creep);
        return;
    }
    let distanceToPraiser = creep.pos.getRangeTo(praiser.pos);
    if (distanceToPraiser > 1) {
        creep.moveTo(praiser);
    }
    else {
        creep.transfer(praiser, RESOURCE_ENERGY);
        creep.memory.praiser = undefined;
    }
}
function runMoveToHomeroom(creep) {
    let homeroom = creep.memory.homeroom;
    if (homeroom !== creep.room.name) {
        creep.travelToRoom(homeroom);
    }
    else {
        creep.setState(State.TankUpInHomeroom);
        runTankUpInHomeroom(creep);
    }
}
function findPraiserToProvide(creep) {
    let creeps = creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === role_1.Role.Praiser && c.carry.energy < c.carryCapacity / 2 });
    if (creeps.length > 0) {
        let closest = creep.pos.findClosestByRange(creeps);
        creep.memory.praiser = closest.id;
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
