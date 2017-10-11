"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const OrdersRepository = require("./repository.Orders");
const Order_1 = require("./classes.Order");
const priority_1 = require("./enums.priority");
var State;
(function (State) {
    State[State["MoveToMineral"] = 1] = "MoveToMineral";
    State[State["Mining"] = 2] = "Mining";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MoveToMineral);
    }
    if (creep.memory.orderCopyTick === creep.ticksToLive) {
        orderMyCopy(creep);
    }
    switch (creep.getState()) {
        case State.MoveToMineral:
            runMoveToMineral(creep);
            break;
        case State.Mining:
            runMining(creep);
            break;
        default:
            console.log("Creep with unknown state: " + creep.name + " - " + creep.room.name + " - State: " + creep.getState());
            creep.setState(State.MoveToMineral);
            break;
    }
}
exports.run = run;
function runMoveToMineral(creep) {
    let mineral = getMineral(creep);
    if (mineral !== null) {
        if (mineral.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(mineral) > 1) {
            creep.travelTo(mineral, { allowSK: true, avoidKeepers: true }, true);
        }
        else {
            if (creep.memory.orderCopyTick === undefined) {
                setOrderCopyTick(creep);
            }
            creep.setState(State.Mining);
            runMining(creep);
        }
    }
}
function runMining(creep) {
    if (Game.time % 6 !== 1) {
        return;
    }
    let mineral = getMineral(creep);
    if (mineral !== null && mineral.ticksToRegeneration !== undefined && mineral.ticksToRegeneration > 0) {
        creep.suicide();
        return;
    }
    if (mineral !== null && (creep.carryCapacity - _.sum(creep.carry) > creep.getWorkerParts())) {
        let response = creep.harvest(mineral);
        if (response === OK) {
            if (Memory.stats['mineralmined.' + mineral.mineralType] === undefined) {
                Memory.stats['mineralmined.' + mineral.mineralType] = 0;
            }
            Memory.stats['mineralmined.' + mineral.mineralType] += creep.getActiveBodyparts(WORK);
        }
    }
}
function getMineral(creep) {
    let mineral = Game.getObjectById(creep.memory.target);
    return mineral;
}
function setOrderCopyTick(creep) {
    let mineral = getMineral(creep);
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
    let mineral = getMineral(creep);
    if (mineral === null || mineral.ticksToRegeneration !== undefined) {
        return;
    }
    let order = new Order_1.Order();
    order.body = _.map(creep.body, (p) => p.type);
    order.priority = priority_1.Priority.Important;
    order.memory = { role: creep.memory.role, target: creep.memory.target, tier: creep.memory.tier };
    OrdersRepository.orderCreep(Game.rooms[creep.memory.homeroom], order);
}
