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

import * as BaseLib from "../lib/base";

import * as RoomRepository from "../repository/Room";

enum State {
    MoveToPosition = 1,
    Fortify = 2
}


export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.MoveToPosition);
    }

    switch(creep.getState()) {
        case State.MoveToPosition:
            runMoveToPosition(creep);
            break;
        case State.Fortify:
            runFortify(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MoveToPosition);
            break;
    }
}

function runMoveToPosition(creep: Creep) {
    let basepos = RoomRepository.getBasePosition(creep.room);
    if (basepos === undefined) {
        console.log("Error with roomposition, Protector do not know where to move: " + creep.room.name);
        creep.disable();
        return;
    }
    let position = new RoomPosition(basepos.x, basepos.y + 2, basepos.roomName);
    if (creep.pos.getRangeTo(position) > 0) {
        creep.moveTo(position);
    } else {
        creep.setState(State.Fortify);
        return;
    }
}

function runFortify(creep: Creep) {
    if (creep.room.storage === undefined) {
        console.log("Error with storage, Protector can not tank: " + creep.room.name);
        creep.disable();
        return;
    }
    if (creep.carry[RESOURCE_ENERGY] < (creep.getActiveBodyparts(WORK) * 2)) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    }
    let target = getTargetWall(creep);

    if (target !== null) {
        let response = creep.repair(target);
        if (response === OK) {
            if (Memory.stats['room.' + creep.room.name + '.wallsRepaired'] === undefined) {
                Memory.stats['room.' + creep.room.name + '.wallsRepaired'] = 0;
            }
            Memory.stats['room.' + creep.room.name + '.wallsRepaired'] += creep.getActiveBodyparts(WORK);
        }
    }
}

function getTargetWall(creep: Creep): StructureWall | StructureRampart | null {
    if (creep.memory.freq === undefined) {
        creep.memory.freq = Math.floor(Math.random() * 50) + 100;
    }
    let wall = Game.getObjectById(creep.memory.wallid) as StructureWall | StructureRampart | null;
    if (wall === null || Game.time % creep.memory.freq === 0) {
        wall = getMostDamagedWall(creep);
        if (wall !== null) {
            creep.memory.wallid = wall.id;
        }
    }
    return wall;
}

function getMostDamagedWall(creep: Creep): StructureWall | StructureRampart | null {
    let walls = BaseLib.getFortressRamparts(creep.room);
    let wall: StructureWall | StructureRampart | null = null;
    let wallHP = WALL_HITS_MAX;
    for (let s of walls) {
        if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
            if (s.hits < wallHP) {
                wall = s as StructureRampart | StructureWall;
                wallHP = s.hits;
            }
        }
    }
    return wall;
}
