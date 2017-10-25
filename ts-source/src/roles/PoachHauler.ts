/**
 * PoachGuard
 *
 * Used for hauling minerals from non-outpost lairrooms
 */

import * as PathfindingUtilities from "../utilities/Pathfinding";

import {Role} from "../enums/role";

enum State {
    MoveToMineral = 1,
    Collecting = 2,
    Returning = 3
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.MoveToMineral);
    }

    switch(creep.getState()) {
        case State.MoveToMineral:
        runMoveToMineral(creep);
            break;
        case State.Collecting:
            runCollecting(creep);
            break;
        case State.Returning:
            runReturning(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.MoveToMineral);
            break;
    }
}

function runMoveToMineral(creep: Creep) {
    let mineral = getMineral(creep);
    if (mineral !== null) {
        if (mineral.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(mineral) > 3) {
            creep.travelTo(mineral, {allowSK: true, ignoreRoads: true, avoidKeepers: true, allowHostile: false}, true);
        } else {
            creep.setState(State.Collecting);
            runCollecting(creep);
        }
    }
}

function runCollecting(creep: Creep) {
    if (creep.carryCapacity === _.sum(creep.carry) || (creep.memory.distance !== undefined && creep.ticksToLive - 50 < creep.memory.distance)) {
        if (_.sum(creep.carry) === 0) {
            creep.suicide();
            return;
        }
        creep.setState(State.Returning);
        runReturning(creep);
    } else {
        if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
            creep.memory.sleep = creep.memory.sleep - 1;
            return;
        }
        let current = Game.getObjectById(creep.memory.current) as Creep | null;
        if (current !== null && _.sum(current.carry) > 0) {
            if (creep.pos.getRangeTo(current) > 1) {
                creep.moveTo(current);
            } else {
                current.transfer(creep, getInventoryType(current));
                creep.memory.current = undefined;
            }
        } else {
            creep.memory.current = undefined;
            let newTarget = getNewMinerTarget(creep);
            if (newTarget === undefined) {
                creep.memory.sleep = 20;
            } else {
                creep.memory.current = newTarget.id;
            }
        }
    }
}

function runReturning(creep: Creep) {
    let homeRoom = Game.rooms[creep.getHomeroom()];
    if (homeRoom !== undefined && homeRoom.storage !== undefined) {
        if (homeRoom.storage.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(homeRoom.storage) > 1) {
            creep.travelTo(homeRoom.storage, {allowSK: true, ignoreRoads: true, avoidKeepers: true, allowHostile: false}, true);
        } else {
            for (let m of Object.keys(creep.carry)) {
                if (creep.carry[m] > 0) {
                    creep.transfer(homeRoom.storage, m);
                    return;
                }
            }
            if(shouldDoAnotherRun(creep)) {
                creep.setState(State.MoveToMineral);
                runMoveToMineral(creep);
            } else {
                creep.suicide();
            }
        }
    }
}

function getNewMinerTarget(creep: Creep): Creep | undefined {
    let target = creep.room.find(FIND_MY_CREEPS, {filter: (c: Creep) => _.sum(c.carry) > (c.carryCapacity / 2) && c.memory.role === Role.PoachMiner}) as Creep[];
    if (target.length > 0) {
        return target[0];
    }
}

function shouldDoAnotherRun(creep: Creep): boolean {
    let mineral = getMineral(creep);
    if (creep.room.storage === undefined || mineral === null) {
        return false;
    }
    let distance = PathfindingUtilities.getDistanseBetween(creep.room.storage.pos, mineral.pos);
    creep.memory.distance = distance;
    return distance * 3 < creep.ticksToLive;
}

function getMineral(creep: Creep): Mineral | null  {
    let mineral = Game.getObjectById(creep.memory.target) as Mineral | null;
    return mineral;
}

function getInventoryType(creep: Creep): string {
    for (let r of Object.keys(creep.carry)) {
        if (creep.carry[r] > 0) {
            return r;
        }
    }
    return RESOURCE_ENERGY;
}
