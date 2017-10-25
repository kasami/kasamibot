/**
 * Protector
 *
 * Used to fortify the inner base
 *
 * MEMORY
 *   wallid - id for structure is currently being repaired
 *   freq - frequency for changing target wall
 */

import {log} from "../tools/Logger";
import {RoomLevel} from "../enums/roomlevel";

import * as _Common from "../rolelib/common";

import * as RoomRepository from "../repository/Room";

import * as EnergyLib from "../lib/energy";
import * as PositionLib from "../lib/position";

enum State {
    Waiting = 1,
    Constructing = 2,
    Fortify = 3,
    Tanking = 4,
    RepairWall = 5
}


export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }

    switch(creep.getState()) {
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
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
}

function runWaiting(creep: Creep) {
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

function runConstructing(creep: Creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite) as ConstructionSite | null;
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
    } else
    if (response === OK) {
        if (targetSite.structureType === STRUCTURE_RAMPART || targetSite.structureType === STRUCTURE_WALL) {
            creep.memory.wallPos = targetSite.pos;
            creep.memory.targetSite = undefined;
            creep.setState(State.RepairWall);
        }
    }
}

function runFortify(creep: Creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite) as Structure | null;
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
    } else {
        creep.travelTo(targetSite);
    }

    if (targetSite.hits === targetSite.hitsMax) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Waiting);
    }
}

function runRepairWall(creep: Creep) {
    if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.targetSite = undefined;
        creep.memory.rampartPos = undefined;
        creep.setState(State.Tanking);
        runTanking(creep);
        return;
    }
    let targetSite = Game.getObjectById(creep.memory.targetSite) as Structure | null;
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
    } else
    if (response === ERR_NOT_IN_RANGE) {
        creep.travelTo(targetSite);
    }
    if (targetSite.hits === targetSite.hitsMax) {
        creep.memory.targetSite = undefined;
        creep.setState(State.Waiting);
    }
}

function runTanking(creep: Creep) {
    let homeroom = Game.rooms[creep.memory.homeroom];
    let storage = homeroom.storage;
    if (storage === undefined) {
        let buildingId = EnergyLib.getBuildingIdForTanking(creep.room);
        storage = Game.getObjectById(buildingId) as Storage;
        if (storage === null) {
            console.log("BaseBuilder without energy pickup " + homeroom.name);
            return;
        }
    }
    if (shouldTank(creep, storage)) {
        if (creep.pos.getRangeTo(storage) === 1) {
            creep.withdraw(storage, RESOURCE_ENERGY);
            creep.setState(State.Waiting);
        } else {
            creep.travelTo(storage);
        }
    } else {
        _Common.moveOffRoad(creep)
    }
}

function findWallJustBuilt(creep: Creep): Structure | null {
    if (creep.memory.wallPos === undefined || creep.memory.wallPos.x === undefined) {
        return null;
    }
    let pos = new RoomPosition(creep.memory.wallPos.x, creep.memory.wallPos.y, creep.memory.wallPos.roomName);
    let atPos = pos.lookFor(LOOK_STRUCTURES) as Structure[];
    for (let s of atPos) {
        if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
            return s;
        }
    }
    return null;
}

function findNewTargetConstructionSite(creep: Creep): ConstructionSite | null {
    let closestSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES) as ConstructionSite;
    if (closestSite === undefined || closestSite === null) {
        let enemySitesNeedingBuilding = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES, {filter: (c: ConstructionSite) => c.structureType === STRUCTURE_EXTRACTOR}) as ConstructionSite[];
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


function findNewTargetWallSite(creep: Creep): Structure | null {
    let walls = creep.room.find(FIND_STRUCTURES, {filter: function(s: Structure) {
        return (s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL)
    }}) as Structure[];

    if (walls.length === 0) {
        creep.memory.targetSite = undefined;
        return null;
    }

    let minHpFound = RAMPART_HITS_MAX[8];
    let target: Structure | null = null;
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

function shouldTank(creep: Creep, storage: StructureStorage): boolean {
    if (storage !== undefined && storage.structureType !== STRUCTURE_STORAGE) {
        return true;
    }
    if (storage.store[RESOURCE_ENERGY] > 20000 ||
    (storage.store[RESOURCE_ENERGY] > 5000 && RoomRepository.getRoomLevel(creep.room) < RoomLevel.Metropolis)) {
        return true;
    }
    return false;
}
