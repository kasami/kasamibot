/**
 * Paladin
 *
 * Used for simple attacks on rooms with bad defenses.
 *
 * MEMORY
 *   target - target room for either waypoint or for destroying
 *   route - list of target rooms to be visited
 *   targetToAttack - id for structure or creep to attack
 *
 * STATE
 *   Idle - Waiting for healer to spawn
 *   MovingToTarget - Moving to target room
 *   Attacking - Attacking target room
 */

import * as _Targeting from "../rolelib/targeting";

import * as PositionLib from "../lib/position";

import {log} from "../tools/Logger";

enum State {
    Waiting = 1,
    MovingToTarget = 2,
    Attacking = 3,
    Sleep = 4
}

export function run(creep: Creep) {
    creep.notifyWhenAttacked(false);

    if (!creep.hasState()) {
        creep.setState(State.Waiting);
    }

    healIfNeeded(creep);

    switch(creep.getState()) {
        case State.Waiting:
            runWaiting(creep);
            break;
        case State.MovingToTarget:
            runMovingToTarget(creep);
            break;
        case State.Attacking:
            runAttacking(creep);
            break;
        case State.Sleep:
            runSleep(creep);
            break;
        default:
            log.error("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState(), creep.room.name);
            creep.setState(State.Waiting);
            break;
    }
};

function runWaiting(creep: Creep): void {
    creep.setState(State.MovingToTarget);
}

function runSleep(creep: Creep): void {
    if (Game.time % 9 === 0) {
        creep.setState(State.Attacking);
    }
}

function runMovingToTarget(creep: Creep): void {

    let targetRoom: string | undefined = creep.memory.target;
    if (targetRoom === undefined) {
        targetRoom = getNextTargetRoom(creep);
        if (targetRoom === undefined) {
            log.error("Paladin " + creep.name + " has no target room.", creep.room.name);
            return;
        }
    }

    if (targetRoom === creep.room.name && !PositionLib.positionIsBorder(creep.pos)) {
        creep.setState(State.Attacking);
    } else {
        creep.travelToRoom(targetRoom, {allowSK: true, ignoreRoads: true});
    }
}

function runAttacking(creep: Creep): void {

    let targetToAttack = getTargetToAttack(creep);
    if (Game.time % 13 === 0) {
        targetToAttack = getNewTargetToAttack(creep);
        if (targetToAttack !== null) {
            creep.memory.targetToAttack = targetToAttack.id;
        }
    }

    if (targetToAttack !== null) {
        moveAndAttack(creep, targetToAttack);
    } else {
        targetToAttack = getNewTargetToAttack(creep);
        if (targetToAttack !== null) {
            creep.memory.targetToAttack = targetToAttack.id;
            moveAndAttack(creep,targetToAttack);
        } else {
            let targetRoom = getNextTargetRoom(creep);
            if (targetRoom !== undefined && targetRoom !== creep.pos.roomName) {
                log.info("Paladin " + creep.name + " is moving to a new target room: " + targetRoom, creep.room.name);
                creep.setState(State.MovingToTarget);
            } else {
                creep.setState(State.Sleep);
            }
        }
    }
}

function getTargetToAttack(creep: Creep): Structure | Creep | null {
    let targetToAttack: Structure | Creep | null = Game.getObjectById(creep.memory.targetToAttack) as Structure | Creep | null;
    if (targetToAttack !== null) {
        return targetToAttack;
    } else {
        return null;
    }
}

function getNewTargetToAttack(creep: Creep): Structure | Creep | null {

    let allCreeps = _Targeting.findHostileCreepsInRoom(creep.room);

    if (allCreeps.length > 0) {
        let dangerous: Creep[] = [];
        let claimers: Creep[] = [];
        for (let c of allCreeps) {
            if (c.getActiveBodyparts(CLAIM) > 0) {
                claimers.push(c)
            }
            if (c.getActiveBodyparts(ATTACK) > 0 || c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(HEAL) > 0) {
                dangerous.push(c);
            }
        }
        if (dangerous.length > 0) {
            return creep.pos.findClosestByRange(dangerous);
        }
        if (claimers.length > 0) {
            return creep.pos.findClosestByRange(claimers);
        }
        return creep.pos.findClosestByRange(allCreeps);
    }

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

function moveAndAttack(creep: Creep, targetToAttack: Structure | Creep) {

    let range = creep.pos.getRangeTo(targetToAttack);

    if (range === 1) {
        creep.attack(targetToAttack);
        creep.moveTo(targetToAttack, {ignoreCreeps: true, maxRooms: 1});
    }

    if (range > 1) {
        let response = creep.moveTo(targetToAttack, {maxRooms: 1});
        if (response === ERR_NO_PATH) {
            findWallToDestroy(creep, targetToAttack);
        }
    }
}

function findWallToDestroy(creep: Creep, targetToAttack: Structure  | Creep) {
    let path = PathFinder.search(
        creep.pos,
        {pos: targetToAttack.pos, range: 1},
        {maxRooms: 1, roomCallback: getRoomCallbackForWallDestruction
    }).path;
    for (let roomPos of path) {
        let structures = roomPos.lookFor(LOOK_STRUCTURES) as Structure[];
        if (structures.length > 0) {
            for (let s of structures) {
                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                    log.info("Paladin needs to destroy " + s.structureType + " at " + s.pos + " to get to a building.", creep.room.name);
                    creep.memory.targetToAttack = s.id;
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
            costs.set(structure.pos.x, structure.pos.y, Math.min(250, structure.hits / 1000));
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

function healIfNeeded(creep: Creep) {
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL) > 0) {
        creep.heal(creep);
    }
}
