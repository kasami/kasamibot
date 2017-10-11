"use strict";
const PathfindingUtilities = require("./utilities.Pathfinding");
const role_1 = require("./enums.role");
var State;
(function (State) {
    State[State["MoveToMineral"] = 1] = "MoveToMineral";
    State[State["Collecting"] = 2] = "Collecting";
    State[State["Returning"] = 3] = "Returning";
})(State || (State = {}));
function run(creep) {
    if (!creep.hasState()) {
        creep.setState(State.MoveToMineral);
    }
    switch (creep.getState()) {
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
exports.run = run;
function runMoveToMineral(creep) {
    let mineral = getMineral(creep);
    if (mineral !== null) {
        if (mineral.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(mineral) > 3) {
            creep.travelTo(mineral, { allowSK: true, ignoreRoads: true, avoidKeepers: true, allowHostile: false }, true);
        }
        else {
            creep.setState(State.Collecting);
            runCollecting(creep);
        }
    }
}
function runCollecting(creep) {
    if (creep.carryCapacity === _.sum(creep.carry) || (creep.memory.distance !== undefined && creep.ticksToLive - 50 < creep.memory.distance)) {
        if (_.sum(creep.carry) === 0) {
            creep.suicide();
            return;
        }
        creep.setState(State.Returning);
        runReturning(creep);
    }
    else {
        if (creep.memory.sleep !== undefined && creep.memory.sleep > 0) {
            creep.memory.sleep = creep.memory.sleep - 1;
            return;
        }
        let current = Game.getObjectById(creep.memory.current);
        if (current !== null && _.sum(current.carry) > 0) {
            if (creep.pos.getRangeTo(current) > 1) {
                creep.moveTo(current);
            }
            else {
                current.transfer(creep, getInventoryType(current));
                creep.memory.current = undefined;
            }
        }
        else {
            creep.memory.current = undefined;
            let newTarget = getNewMinerTarget(creep);
            if (newTarget === undefined) {
                creep.memory.sleep = 20;
            }
            else {
                creep.memory.current = newTarget.id;
            }
        }
    }
}
function runReturning(creep) {
    let homeRoom = Game.rooms[creep.getHomeroom()];
    if (homeRoom !== undefined && homeRoom.storage !== undefined) {
        if (homeRoom.storage.pos.roomName !== creep.pos.roomName || creep.pos.getRangeTo(homeRoom.storage) > 1) {
            creep.travelTo(homeRoom.storage, { allowSK: true, ignoreRoads: true, avoidKeepers: true, allowHostile: false }, true);
        }
        else {
            for (let m of Object.keys(creep.carry)) {
                if (creep.carry[m] > 0) {
                    creep.transfer(homeRoom.storage, m);
                    return;
                }
            }
            if (shouldDoAnotherRun(creep)) {
                creep.setState(State.MoveToMineral);
                runMoveToMineral(creep);
            }
            else {
                creep.suicide();
            }
        }
    }
}
function getNewMinerTarget(creep) {
    let target = creep.room.find(FIND_MY_CREEPS, { filter: (c) => _.sum(c.carry) > (c.carryCapacity / 2) && c.memory.role === role_1.Role.PoachMiner });
    if (target.length > 0) {
        return target[0];
    }
}
function shouldDoAnotherRun(creep) {
    let mineral = getMineral(creep);
    if (creep.room.storage === undefined || mineral === null) {
        return false;
    }
    let distance = PathfindingUtilities.getDistanseBetween(creep.room.storage.pos, mineral.pos);
    creep.memory.distance = distance;
    return distance * 3 < creep.ticksToLive;
}
function getMineral(creep) {
    let mineral = Game.getObjectById(creep.memory.target);
    return mineral;
}
function getInventoryType(creep) {
    for (let r of Object.keys(creep.carry)) {
        if (creep.carry[r] > 0) {
            return r;
        }
    }
    return RESOURCE_ENERGY;
}
