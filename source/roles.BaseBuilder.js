"use strict";
const Logger_1 = require("./tools.Logger");
const roomlevel_1 = require("./enums.roomlevel");
const _Common = require("./rolelib.common");
const RoomRepository = require("./repository.Room");
const EnergyLib = require("./lib.energy");
const PositionLib = require("./lib.position");
var State;
(function (State) {
    State[State["Waiting"] = 1] = "Waiting";
    State[State["Constructing"] = 2] = "Constructing";
    State[State["Fortify"] = 3] = "Fortify";
    State[State["Tanking"] = 4] = "Tanking";
    State[State["RepairWall"] = 5] = "RepairWall";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }
    switch (creep.getState()) {
        case State.Waiting:
            runWaiting(creep);
            break;
        case State.Constructing:
            runConstructing(creep);
            break;
        case State.Fortify:
            runFortify(creep);
            break;
        case State.RepairWall:
            runRepairWall(creep);
            break;
        case State.Tanking:
            runTanking(creep);
            break;
        default:
            Logger_1.log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
}
exports.run = run;
function runWaiting(creep) {
    if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
        creep.memory.sleep--;
        _Common.moveOffRoad(creep);
        return;
    }
    if (creep.carry[RESOURCE_ENERGY] < (creep.carryCapacity / 2)) {
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let currentConstructionSite = Game.getObjectById(creep.memory.targetSite);
    if (currentConstructionSite instanceof ConstructionSite) {
        creep.setState(State.Constructing);
        runConstructing(creep);
        return;
    }
    let targetConstructionSite = findNewTargetConstructionSite(creep);
    if (targetConstructionSite !== null) {
        creep.setState(State.Constructing);
        runConstructing(creep);
        return;
    }
    let targetWallSite = findNewTargetWallSite(creep);
    if (targetWallSite !== null) {
        creep.setState(State.Fortify);
        runFortify(creep);
        return;
    }
    if (!creep.isFull()) {
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    creep.memory.sleep = 15;
    _Common.moveOffRoad(creep);
}
function runConstructing(creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite);
    if (!(targetSite instanceof ConstructionSite)) {
        targetSite = findNewTargetConstructionSite(creep);
    }
    if (targetSite === null) {
        creep.setState(State.Waiting);
        return;
    }
    let response = creep.build(targetSite);
    if (response === ERR_NOT_IN_RANGE) {
        creep.travelTo(targetSite);
    }
    else if (response === OK) {
        if (targetSite.structureType === STRUCTURE_RAMPART || targetSite.structureType === STRUCTURE_WALL) {
            creep.memory.wallPos = targetSite.pos;
            creep.memory.targetSite = undefined;
            creep.setState(State.RepairWall);
        }
    }
}
function runFortify(creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite);
    if (!(targetSite instanceof Structure)) {
        targetSite = findNewTargetWallSite(creep);
    }
    if (targetSite === null) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Waiting);
        return;
    }
    let range = creep.pos.getRangeTo(targetSite);
    if (range > 0 && range < 4 && !PositionLib.positionIsBorder(creep.pos)) {
        creep.repair(targetSite);
        if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
        }
        Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
    }
    else {
        creep.travelTo(targetSite);
    }
    if (targetSite.hits === targetSite.hitsMax) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Waiting);
    }
}
function runRepairWall(creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.targetSite = undefined;
        creep.memory.rampartPos = undefined;
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite);
    if (targetSite === null) {
        targetSite = findWallJustBuilt(creep);
    }
    if (targetSite === null) {
        creep.memory.targetSite = undefined;
        creep.memory.rampartPos = undefined;
        creep.setState(State.Waiting);
        return;
    }
    creep.memory.targetSite = targetSite.id;
    let response = creep.repair(targetSite);
    if (response === OK) {
        if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
        }
        Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
    }
    else if (response === ERR_NOT_IN_RANGE) {
        creep.travelTo(targetSite);
    }
    if (targetSite.hits === targetSite.hitsMax) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Waiting);
    }
}
function runTanking(creep) {
    let homeroom = Game.rooms[creep.memory.homeroom];
    let storage = homeroom.storage;
    if (storage === undefined) {
        let buildingId = EnergyLib.getBuildingIdForTanking(creep.room);
        storage = Game.getObjectById(buildingId);
        if (storage === null) {
            console.log("BaseBuilder without energy pickup " + homeroom.name);
            return;
        }
    }
    if (shouldTank(creep, storage)) {
        if (creep.pos.getRangeTo(storage) === 1) {
            creep.withdraw(storage, RESOURCE_ENERGY);
            creep.setState(State.Waiting);
        }
        else {
            creep.travelTo(storage);
        }
    }
    else {
        _Common.moveOffRoad(creep);
    }
}
function findWallJustBuilt(creep) {
    if (creep.memory.wallPos === undefined || creep.memory.wallPos.x === undefined) {
        return null;
    }
    let pos = new RoomPosition(creep.memory.wallPos.x, creep.memory.wallPos.y, creep.memory.wallPos.roomName);
    let atPos = pos.lookFor(LOOK_STRUCTURES);
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
            return s;
        }
    }
    return null;
}
function findNewTargetConstructionSite(creep) {
    let closestSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (closestSite === undefined || closestSite === null) {
        let enemySitesNeedingBuilding = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES, { filter: (c) => c.structureType === STRUCTURE_EXTRACTOR });
        if (enemySitesNeedingBuilding.length > 0 && creep.room.controller !== undefined && creep.room.controller.level > 5 && creep.room.controller.my) {
            creep.memory.targetSite = enemySitesNeedingBuilding[0].id;
            return enemySitesNeedingBuilding[0];
        }
        creep.memory.targetSite = undefined;
        return null;
    }
    creep.memory.targetSite = closestSite.id;
    return closestSite;
}
function findNewTargetWallSite(creep) {
    let walls = creep.room.find(FIND_STRUCTURES, { filter: function (s) {
            return (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL);
        } });
    if (walls.length === 0) {
        creep.memory.targetSite = undefined;
        return null;
    }
    let minHpFound = RAMPART_HITS_MAX[8];
    let target = null;
    for (let w of walls) {
        if (w.hits < minHpFound) {
            minHpFound = w.hits;
            target = w;
        }
    }
    if (target === null) {
        return null;
    }
    creep.memory.targetSite = target.id;
    return target;
}
function shouldTank(creep, storage) {
    if (storage !== undefined && storage.structureType !== STRUCTURE_STORAGE) {
        return true;
    }
    if (storage.store[RESOURCE_ENERGY] > 20000 ||
        (storage.store[RESOURCE_ENERGY] > 5000 && RoomRepository.getRoomLevel(creep.room) < roomlevel_1.RoomLevel.Metropolis)) {
        return true;
    }
    return false;
}
