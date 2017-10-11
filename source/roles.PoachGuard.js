"use strict";
const PositionLib = require("./lib.position");
const PathfindingUtilities = require("./utilities.Pathfinding");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const priority_1 = require("./enums.priority");
var State;
(function (State) {
    State[State["MoveToRoom"] = 1] = "MoveToRoom";
    State[State["Waiting"] = 2] = "Waiting";
    State[State["Fighting"] = 3] = "Fighting";
    State[State["Healing"] = 4] = "Healing";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MoveToRoom);
    }
    if (creep.memory.orderCopyTick === creep.ticksToLive) {
        orderMyCopy(creep);
    }
    switch (creep.getState()) {
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
exports.run = run;
function runMoveToRoom(creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
    }
    let targetRoom = creep.memory.target;
    if (targetRoom === undefined) {
        return;
    }
    if (targetRoom !== creep.room.name || PositionLib.positionIsBorder(creep.pos)) {
        creep.travelToRoom(targetRoom, { allowSK: true, ignoreRoads: true });
    }
    else {
        creep.setState(State.Waiting);
        runWaiting(creep);
    }
}
function runWaiting(creep) {
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
        let lair = Game.getObjectById(creep.memory.lair);
        if (lair !== null && creep.pos.getRangeTo(lair.pos) > 1) {
            creep.moveTo(lair, { maxRooms: 1 });
        }
        creep.memory.sleep = creep.memory.sleep - 1;
        return;
    }
    let mineral = Game.getObjectById(creep.memory.mineralId);
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
    }
    else {
        creep.memory.keeper = undefined;
    }
    let lair = Game.getObjectById(creep.memory.lair);
    if (lair !== null && lair.ticksToSpawn !== undefined) {
        creep.memory.sleep = lair.ticksToSpawn;
    }
    else {
        creep.memory.sleep = 20;
    }
}
function runFighting(creep) {
    let keeper = Game.getObjectById(creep.memory.keeper);
    if (keeper === null) {
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        creep.memory.keeper = undefined;
        creep.setState(State.Healing);
        return;
    }
    if (creep.pos.getRangeTo(keeper.pos) > 1) {
        creep.moveTo(keeper, { maxRooms: 1 });
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
    else {
        creep.attack(keeper);
        creep.moveTo(keeper, { ignoreCreeps: true, maxRooms: 1 });
    }
}
function runHealing(creep) {
    if (creep.hits < creep.hitsMax) {
        creep.heal(creep);
        return;
    }
    let healTarget = Game.getObjectById(creep.memory.healTarget);
    if (healTarget !== null) {
        let mineral = Game.getObjectById(creep.memory.mineralId);
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
    }
    else {
        let needsHealing = creep.pos.findInRange(FIND_MY_CREEPS, 7, { filter: (c) => c.hits < c.hitsMax });
        if (needsHealing.length > 0) {
            creep.memory.healTarget = needsHealing[0].id;
            return;
        }
        else {
            creep.setState(State.Waiting);
        }
    }
}
function recordIds(creep) {
    let mineral = creep.room.getMineral();
    if (mineral === undefined) {
        console.log("PoachGuard could not find mineral: " + creep.room.name);
        creep.disable();
        return;
    }
    creep.memory.mineralId = mineral.id;
    let lair = mineral.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_KEEPER_LAIR });
    if (lair !== undefined && lair !== null) {
        creep.memory.lair = lair.id;
    }
    let keeper = findKeeper(mineral);
    if (keeper !== undefined) {
        creep.memory.keeper = keeper.id;
    }
}
function findKeeper(mineral) {
    let creep = mineral.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (creep === null) {
        return undefined;
    }
    if (mineral.pos.getRangeTo(creep.pos) > 6) {
        return undefined;
    }
    return creep;
}
function setOrderCopyTick(creep) {
    let mineral = Game.getObjectById(creep.memory.mineralId);
    let spawn = Game.rooms[creep.memory.homeroom].getSpawn();
    if (mineral instanceof Mineral && spawn instanceof StructureSpawn) {
        creep.memory.orderCopyTick = Math.ceil(PathfindingUtilities.getDistanseBetween(mineral.pos, spawn.pos) + 150);
    }
    else {
        creep.memory.orderCopyTick = -1;
    }
}
function orderMyCopy(creep) {
    if (Game.rooms[creep.memory.homeroom] === undefined || Game.rooms[creep.memory.homeroom].isAbandoned() || Game.rooms[creep.memory.homeroom].isUnderSiege() ||
        !_.contains(Game.rooms[creep.memory.homeroom].memory.poaching, creep.memory.target)) {
        return;
    }
    let mineral = Game.getObjectById(creep.memory.mineralId);
    if (mineral === null || mineral.ticksToRegeneration !== undefined) {
        return;
    }
    let order = new Order_1.Order();
    order.body = _.map(creep.body, (p) => p.type);
    order.priority = priority_1.Priority.Important;
    order.memory = { role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier };
    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
}
