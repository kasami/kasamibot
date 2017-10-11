"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const _Common = require("./rolelib.common");
const role_1 = require("./enums.role");
const Logger_1 = require("./tools.Logger");
var State;
(function (State) {
    State[State["TankUp"] = 1] = "TankUp";
    State[State["GiveEnergyToCreep"] = 2] = "GiveEnergyToCreep";
    State[State["DropEnergyInContainer"] = 3] = "DropEnergyInContainer";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.TankUp);
    }
    switch (creep.getState()) {
        case State.TankUp:
            runTankUp(creep);
            break;
        case State.GiveEnergyToCreep:
            runGiveEnergyToCreep(creep);
            break;
        case State.DropEnergyInContainer:
            runDropEnergyInContainer(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.TankUp);
            break;
    }
}
exports.run = run;
function runTankUp(creep) {
    if (creep.carry.energy < creep.carryCapacity &&
        creep.room.storage !== undefined) {
        let distanceToStorage = creep.pos.getRangeTo(creep.room.storage.pos);
        if (creep.room.storage.store[RESOURCE_ENERGY] < 2000) {
            return;
        }
        if (distanceToStorage > 1) {
            creep.moveTo(creep.room.storage);
        }
        else {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    }
    else {
        if (creep.room.controller.hasContainer()) {
            creep.setState(State.DropEnergyInContainer);
            runDropEnergyInContainer(creep);
        }
        else {
            creep.setState(State.GiveEnergyToCreep);
            runGiveEnergyToCreep(creep);
        }
    }
}
function runGiveEnergyToCreep(creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.TankUp);
        runTankUp(creep);
        return;
    }
    let upgrader = Game.getObjectById(creep.memory.upgrader);
    if (upgrader === null || upgrader.carry.energy > upgrader.carryCapacity - 50) {
        creep.memory.upgrader = undefined;
        upgrader = findUpgraderToProvide(creep);
    }
    if (upgrader === null) {
        if (creep.room.controller === undefined) {
            _Common.moveOffRoad(creep);
            return;
        }
        let rangeToController = creep.pos.getRangeTo(creep.room.controller);
        if (rangeToController > 5) {
            creep.travelTo(creep.room.controller);
        }
        else {
            _Common.moveOffRoad(creep);
        }
        return;
    }
    let distanceToUpgrader = creep.pos.getRangeTo(upgrader.pos);
    if (distanceToUpgrader > 1) {
        creep.moveTo(upgrader);
    }
    else {
        creep.transfer(upgrader, RESOURCE_ENERGY);
        creep.memory.upgrader = undefined;
    }
}
function runDropEnergyInContainer(creep) {
    if (creep.carry.energy === 0) {
        if (!shouldShouldAnotherRun(creep)) {
            creep.suicide();
            return;
        }
        creep.setState(State.TankUp);
        runTankUp(creep);
        return;
    }
    let container = creep.room.controller.getContainer();
    if (container === undefined) {
        creep.setState(State.GiveEnergyToCreep);
        runGiveEnergyToCreep(creep);
        return;
    }
    let distanceToUpgrader = creep.pos.getRangeTo(container.pos);
    if (distanceToUpgrader > 1) {
        creep.moveTo(container);
    }
    else {
        if (container.store[RESOURCE_ENERGY] < container.storeCapacity) {
            creep.transfer(container, RESOURCE_ENERGY);
        }
    }
}
function findUpgraderToProvide(creep) {
    let creeps = creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === role_1.Role.Upgrader && c.carry.energy < c.carryCapacity / 2 });
    if (creeps.length > 0) {
        let closest = creep.pos.findClosestByRange(creeps);
        creep.memory.upgrader = closest.id;
        return closest;
    }
    return null;
}
function shouldShouldAnotherRun(creep) {
    if (creep.room.storage === undefined) {
        return false;
    }
    let distanceToTerminal = PathfindingUtilities.getDistanseBetween(creep.pos, creep.room.storage.pos);
    return creep.ticksToLive > distanceToTerminal * 3;
}
