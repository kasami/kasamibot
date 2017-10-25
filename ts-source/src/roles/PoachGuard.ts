/**
 * PoachGuard
 *
 * Used to guard mineralmining in non-outpost lair-rooms from Source Keepers
 */

import * as PositionLib from "../lib/position";
import * as PathfindingUtilities from "../utilities/Pathfinding";
import * as OrdersRepository from "../repository/Orders";

import {Order} from "../classes/Order";

import {Priority} from "../enums/priority";

enum State {
    MoveToRoom = 1,
    Waiting = 2,
    Fighting = 3,
    Healing = 4
}

export function run(creep: Creep) {

    if (!creep.hasState()) {
        creep.setState(State.MoveToRoom);
    }

    if (creep.memory.orderCopyTick === creep.ticksToLive) {
        orderMyCopy(creep);
    }

    switch(creep.getState()) {
        case State.MoveToRoom:
            runMoveToRoom(creep);
            break;
        case State.Waiting:
            runWaiting(creep);
            break;
        case State.Fighting:
            runFighting(creep);
            break;
        case State.Healing:
            runHealing(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.MoveToRoom);
            break;
    }
}

function runMoveToRoom(creep: Creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }

    let targetRoom = creep.memory.target;
    if (targetRoom === undefined) {
        return;
    }
    if (targetRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
        creep.travelToRoom(targetRoom, {allowSK: true, ignoreRoads: true});
    } else {
        creep.setState(State.Waiting);
        runWaiting(creep);
    }
}

// TODO: Heal friendlies
function runWaiting(creep: Creep) {
    if (creep.memory.mineralId === undefined) {
        recordIds(creep);
    }

    if (creep.memory.orderCopyTick === undefined) {
        setOrderCopyTick(creep);
    }

    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }

    if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
        let lair = Game.getObjectById(creep.memory.lair) as StructureKeeperLair | null;
        if (lair !== null && creep.pos.getRangeTo(lair.pos) > 1) {
            creep.moveTo(lair, {maxRooms: 1});
        }
        creep.memory.sleep = creep.memory.sleep - 1;
        return;
    }
    let mineral = Game.getObjectById(creep.memory.mineralId) as Mineral;
    if (mineral === null) {
        console.log("No mineral found for Guard: " + creep.pos);
        return;
    }

    let keeper = findKeeper(mineral);
    if (keeper !== undefined) {
        creep.memory.keeper = keeper.id;
        creep.setState(State.Fighting);
        runFighting(creep);
        return;
    } else {
        creep.memory.keeper = undefined;
    }

    let lair = Game.getObjectById(creep.memory.lair) as StructureKeeperLair | null;
    if (lair !== null && lair.ticksToSpawn !== undefined) {
        creep.memory.sleep = lair.ticksToSpawn;
    } else {
        creep.memory.sleep = 20;
    }
}

function runFighting(creep: Creep) {
    let keeper = Game.getObjectById(creep.memory.keeper) as Creep | null;
    if (keeper === null) {
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        creep.memory.keeper = undefined;
        creep.setState(State.Healing);
        return;
    }
    if (creep.pos.getRangeTo(keeper.pos) > 1) {
        creep.moveTo(keeper, {maxRooms: 1});
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    } else {
        creep.attack(keeper);
        creep.moveTo(keeper, {ignoreCreeps: true, maxRooms: 1});
    }
}

function runHealing(creep: Creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
        return;
    }
    let healTarget = Game.getObjectById(creep.memory.healTarget) as Creep | null;
    if (healTarget !== null) {
        let mineral = Game.getObjectById(creep.memory.mineralId) as Mineral;
        if (mineral !== null && mineral.pos.getRangeTo(healTarget) > 10) {
            creep.memory.healTarget = undefined;
            return;
        }
        if (healTarget.hits === healTarget.hitsMax) {
            creep.memory.healTarget = undefined;
            return;
        }
        let range = creep.pos.getRangeTo(healTarget);
        if (range > 1) {
            creep.moveTo(healTarget);
        }
        if (range < 4) {
            creep.heal(healTarget);
        }
    } else {
        let needsHealing = creep.pos.findInRange(FIND_MY_CREEPS, 7, {filter: (c: Creep) => c.hits < c.hitsMax}) as Creep[];
        if (needsHealing.length > 0) {
            creep.memory.healTarget = needsHealing[0].id;
            return;
        } else {
            creep.setState(State.Waiting);
        }
    }
}

function recordIds(creep: Creep) {
    let mineral = creep.room.getMineral();
    if (mineral === undefined) {
        console.log("PoachGuard could not find mineral: " + creep.room.name);
        creep.disable();
        return;
    }
    creep.memory.mineralId = mineral.id;

    let lair = mineral.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (s: Structure) => s.structureType === STRUCTURE_KEEPER_LAIR}) as StructureKeeperLair | undefined;
    if (lair !== undefined && lair !== null) {
        creep.memory.lair = lair.id;
    }

    let keeper = findKeeper(mineral);
    if (keeper !== undefined) {
        creep.memory.keeper = keeper.id;
    }
}

function findKeeper(mineral: Mineral): Creep | undefined {
    let creep = mineral.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep | null;
    if (creep === null) {
        return undefined;
    }
    if (mineral.pos.getRangeTo(creep.pos) > 6) {
        return undefined;
    }
    return creep;
}

function setOrderCopyTick(creep: Creep) {
    let mineral = Game.getObjectById(creep.memory.mineralId);
    let spawn = Game.rooms[creep.memory.homeroom].getSpawn() as Spawn;
    if (mineral instanceof Mineral && spawn instanceof StructureSpawn) {
        creep.memory.orderCopyTick = Math.ceil(PathfindingUtilities.getDistanseBetween(mineral.pos, spawn.pos) + 150);
    }
    else {
        creep.memory.orderCopyTick = -1;
    }
}

function orderMyCopy(creep: Creep) {
    if(Game.rooms[creep.memory.homeroom] === undefined || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege() ||
        !_.contains(Game.rooms[creep.memory.homeroom].memory.poaching, creep.memory.target)) {
        return;
    }
    let mineral = Game.getObjectById(creep.memory.mineralId) as Mineral;
    if (mineral === null || mineral.ticksToRegeneration !== undefined) {
        return;
    }

    let order = new Order();
    order.body = _.map(creep.body, (p) => p.type);
    order.priority = Priority.Important;
    order.memory = {role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier};

    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
}
