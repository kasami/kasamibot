/**
 * Wrecker
 *
 * Used to break down walls and destroy bases. Not able to handle towers or attackers.
 *
 * MEMORY
 *   target - target room for either waypoint or for wrecking
 *   route - list of target rooms to be visited
 *   targetToDismantle - id for structure that is planned for destruction
 *
 * STATE
 *   MovingToTarget - Moving to target room
 *   Wrecking - Wrecking target room
 */

import * as _Targeting from "../rolelib/targeting";

import * as PositionLib from "../lib/position";

import {log} from "../tools/Logger";

enum State {
    MovingToTarget = 1,
    Wrecking = 2
}

export function run(creep: Creep) {
    if (!creep.hasState()) {
        creep.setState(State.MovingToTarget);
    }

    switch(creep.getState()) {
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.Wrecking:
            runWrecking(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.MovingToTarget);
            break;
    }
};

function runMovingToTarget(creep: Creep): void {

    let targetRoom: string | undefined = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            log.error("Wrecker " + creep.name + " has no target room.", creep.room.name);
            return;
        }
    }

    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
        creep.setState(State.Wrecking);
        runWrecking(creep);
    } else {
        creep.travelToRoom(targetRoom, {allowSK: true, ignoreRoads: true});
    }
}

function runWrecking(creep: Creep): void {
    let targetToDismantle = getTargetToDismantle(creep);

    if (targetToDismantle !== null) {
        moveAndDismantle(creep, targetToDismantle);
    } else {
        targetToDismantle = getNewTargetToDismantle(creep);
        if (targetToDismantle !== null) {
            creep.memory.targetToDismantle = targetToDismantle.id;
            moveAndDismantle(creep,targetToDismantle);
        } else {
            let targetRoom = getNextTargetRoom(creep);
            log.info("Wrecker " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
            creep.setState(State.MovingToTarget);
        }
    }
}

function getTargetToDismantle(creep: Creep): Structure | null {
    let targetToDismantle: Structure | null = Game.getObjectById(creep.memory.targetToDismantle) as Structure;
    if (targetToDismantle instanceof Structure) {
        return targetToDismantle;
    } else {
        return null;
    }
}

function getNewTargetToDismantle(creep: Creep): Structure | null {

    let vitalStructures = _Targeting.findHostileVitalStructures(creep.room);

    let vitalStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(vitalStructures);

    if (vitalStructuresWithoutBigRampart.length > 0) {
        return creep.pos.findClosestByRange(vitalStructuresWithoutBigRampart);
    }

    let allStructures = _Targeting.findHostileStructures(creep.room);
    let allStructuresWithoutBigRampart = _Targeting.filterStructuresOnBigRamparts(allStructures);

    if (allStructuresWithoutBigRampart.length > 0) {
        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
    }

    if (vitalStructures.length > 0) {
        return creep.pos.findClosestByRange(vitalStructures);
    }

    if (allStructures.length > 0) {
        return creep.pos.findClosestByRange(allStructuresWithoutBigRampart);
    }

    return null;
}
function moveAndDismantle(creep: Creep, targetToDismantle: Structure) {

    let closestCreep = _Targeting.findClosestHostileCreepsInRoom(creep.pos);
    let shouldIMove = true;
    if (closestCreep && creep.pos.getRangeTo(closestCreep.pos) < 3) {
        shouldIMove = Game.time % 2 === 0;
    }

    if (creep.dismantle(targetToDismantle) === ERR_NOT_IN_RANGE && shouldIMove) {
        let response = creep.moveTo(targetToDismantle);
        if (response === ERR_NO_PATH) {
            findWallToDestroy(creep, targetToDismantle);
        }
    }
}

function findWallToDestroy(creep: Creep, targetToDismantle: Structure) {
    let path = PathFinder.search(
        creep.pos,
        {pos: targetToDismantle.pos, range: 1},
        {maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
    }).path;
    for (let roomPos of path) {
        let structures = roomPos.lookFor(LOOK_STRUCTURES) as Structure[];
        if (structures.length > 0) {
            for (let s of structures) {
                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                    log.info("Wrecker needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
                    creep.memory.targetToDismantle = s.id;
                    return;
                }
            }
        }
    }
    log.error("Found no walls/ramparts to destroy to get to an interesting target.", creep.room.name);
}
function getRoomCallbackForWallDestruction(roomName: string): CostMatrix {
    let room = Game.rooms[roomName];
    if (!room) return new PathFinder.CostMatrix;

    let costs = new PathFinder.CostMatrix;
    room.find(FIND_STRUCTURES).forEach(function(structure: Structure) {
        if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 20000));
        }
    });
    return costs;
}

function getNextTargetRoom(creep: Creep): string | undefined {
    if (creep.memory.route !== undefined && creep.memory.route.length > 0) {
        creep.memory.target = creep.memory.route.shift();
    }
    return creep.memory.target;
}
